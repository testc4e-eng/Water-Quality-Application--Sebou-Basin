from __future__ import annotations

import csv
import io
import re
import zipfile
from dataclasses import dataclass
from typing import Any
from xml.etree import ElementTree as ET


MAX_INGESTION_ROWS = 10_000
EXCEL_NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pkg": "http://schemas.openxmlformats.org/package/2006/relationships",
}


@dataclass(frozen=True)
class ParsedIngestionFile:
    file_format: str
    headers: list[str]
    rows: list[dict[str, Any]]
    preview: list[dict[str, Any]]
    metadata: dict[str, Any]


def parse_ingestion_file(
    *,
    file_name: str,
    content: bytes,
    mime_type: str,
    template_headers: list[str],
    template_field_labels: list[str],
    template_example_values: list[str],
) -> ParsedIngestionFile:
    lowered = file_name.lower()
    if lowered.endswith(".csv"):
        return _parse_csv_file(content, template_headers, template_field_labels, template_example_values)
    if lowered.endswith(".xlsx"):
        return _parse_xlsx_file(content, template_headers, template_field_labels, template_example_values)
    raise ValueError("UNSUPPORTED_FILE_FORMAT")


def _parse_csv_file(
    content: bytes,
    template_headers: list[str],
    template_field_labels: list[str],
    template_example_values: list[str],
) -> ParsedIngestionFile:
    text = content.decode("utf-8-sig")
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        raise ValueError("EMPTY_FILE")
    headers = [cell.strip() for cell in rows[0]]
    if not any(headers):
        raise ValueError("MISSING_HEADERS")
    data_rows = _rows_to_dicts(rows[1:], headers)
    cleaned_rows = _strip_template_helper_rows(data_rows, template_headers, template_field_labels, template_example_values)
    if len(cleaned_rows) > MAX_INGESTION_ROWS:
        raise ValueError("ROW_LIMIT_EXCEEDED")
    return ParsedIngestionFile(
        file_format="csv",
        headers=headers,
        rows=cleaned_rows,
        preview=cleaned_rows[:10],
        metadata={"sheet_name": None, "source_format": "csv"},
    )


def _parse_xlsx_file(
    content: bytes,
    template_headers: list[str],
    template_field_labels: list[str],
    template_example_values: list[str],
) -> ParsedIngestionFile:
    try:
        archive = zipfile.ZipFile(io.BytesIO(content))
    except zipfile.BadZipFile as exc:
        raise ValueError("INVALID_XLSX_FILE") from exc

    shared_strings = _load_shared_strings(archive)
    sheet_name, sheet_target = _resolve_donnees_sheet(archive)
    rows = _load_sheet_rows(archive, sheet_target, shared_strings)
    if not rows:
        raise ValueError("EMPTY_FILE")
    headers = [str(cell).strip() for cell in rows[0]]
    if not any(headers):
        raise ValueError("MISSING_HEADERS")
    data_rows = _rows_to_dicts(rows[1:], headers)
    cleaned_rows = _strip_template_helper_rows(data_rows, template_headers, template_field_labels, template_example_values)
    if len(cleaned_rows) > MAX_INGESTION_ROWS:
        raise ValueError("ROW_LIMIT_EXCEEDED")
    return ParsedIngestionFile(
        file_format="xlsx",
        headers=headers,
        rows=cleaned_rows,
        preview=cleaned_rows[:10],
        metadata={"sheet_name": sheet_name, "source_format": "xlsx"},
    )


def _load_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    values: list[str] = []
    for si in root.findall("main:si", EXCEL_NS):
        parts = si.findall(".//main:t", EXCEL_NS)
        values.append("".join(part.text or "" for part in parts))
    return values


def _resolve_donnees_sheet(archive: zipfile.ZipFile) -> tuple[str, str]:
    workbook_root = ET.fromstring(archive.read("xl/workbook.xml"))
    rels_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels_root.findall("pkg:Relationship", EXCEL_NS)
    }

    sheet_nodes = workbook_root.findall("main:sheets/main:sheet", EXCEL_NS)
    if not sheet_nodes:
        raise ValueError("MISSING_WORKSHEETS")

    selected_node = None
    for node in sheet_nodes:
        if node.attrib.get("name") == "DONNEES":
            selected_node = node
            break
    if selected_node is None:
        selected_node = sheet_nodes[0]

    rel_id = selected_node.attrib.get(f"{{{EXCEL_NS['rel']}}}id")
    if not rel_id or rel_id not in rel_map:
        raise ValueError("MISSING_WORKSHEET_RELATION")

    target = rel_map[rel_id].replace("\\", "/")
    if not target.startswith("xl/"):
        target = f"xl/{target.lstrip('/')}"
    return selected_node.attrib.get("name", "DONNEES"), target


def _load_sheet_rows(archive: zipfile.ZipFile, sheet_target: str, shared_strings: list[str]) -> list[list[Any]]:
    root = ET.fromstring(archive.read(sheet_target))
    rows: list[list[Any]] = []
    for row_node in root.findall("main:sheetData/main:row", EXCEL_NS):
        cells_by_index: dict[int, Any] = {}
        max_index = 0
        for cell in row_node.findall("main:c", EXCEL_NS):
            ref = cell.attrib.get("r", "")
            col_index = _column_index_from_ref(ref)
            max_index = max(max_index, col_index)
            cells_by_index[col_index] = _read_cell_value(cell, shared_strings)
        row_values = [cells_by_index.get(index, "") for index in range(1, max_index + 1)]
        rows.append(row_values)
    return rows


def _column_index_from_ref(cell_ref: str) -> int:
    match = re.match(r"([A-Z]+)", cell_ref or "")
    if not match:
        return 1
    index = 0
    for char in match.group(1):
        index = index * 26 + (ord(char) - 64)
    return index


def _read_cell_value(cell: ET.Element, shared_strings: list[str]) -> Any:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//main:t", EXCEL_NS))
    if cell_type == "s":
        value = cell.findtext("main:v", default="", namespaces=EXCEL_NS)
        if value == "":
            return ""
        idx = int(value)
        return shared_strings[idx] if idx < len(shared_strings) else ""
    if cell_type == "b":
        return cell.findtext("main:v", default="0", namespaces=EXCEL_NS) == "1"
    value = cell.findtext("main:v", default="", namespaces=EXCEL_NS)
    if value == "":
        return ""
    return value


def _rows_to_dicts(raw_rows: list[list[Any]], headers: list[str]) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    width = len(headers)
    for row in raw_rows:
        padded = list(row) + [""] * max(0, width - len(row))
        output.append({
            headers[index]: padded[index] if index < len(padded) else ""
            for index in range(width)
        })
    return output


def _strip_template_helper_rows(
    rows: list[dict[str, Any]],
    template_headers: list[str],
    template_field_labels: list[str],
    template_example_values: list[str],
) -> list[dict[str, Any]]:
    cleaned = list(rows)
    if cleaned:
        first_row_values = [str(cleaned[0].get(header, "")).strip() for header in template_headers]
        if first_row_values == [value.strip() for value in template_field_labels]:
            cleaned = cleaned[1:]
    if cleaned:
        first_row_values = [str(cleaned[0].get(header, "")).strip() for header in template_headers]
        if first_row_values == [value.strip() for value in template_example_values]:
            cleaned = cleaned[1:]
    return [row for row in cleaned if any(str(value).strip() for value in row.values())]
