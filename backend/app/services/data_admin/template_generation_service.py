from __future__ import annotations

import csv
import io
import zipfile
from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal
from html import escape
from typing import Any

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.repositories.data_admin.class_registry_repository import ClassRegistryRepository


TEMPLATE_VERSION = "2026.06.mvp2a"


@dataclass(frozen=True)
class GeneratedTemplateFile:
    filename: str
    media_type: str
    content: bytes


FIELD_METADATA_OVERRIDES: dict[str, dict[str, dict[str, Any]]] = {
    "INFRA_STATION": {
        "code_station": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "1586/600",
            "validation_rule": "Code station unique, non vide.",
            "description": "Code metier de la station de mesure.",
        },
        "nom": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "Bab Taza",
            "description": "Nom metier de la station.",
        },
        "type_station": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "pluviometrique",
            "allowed_values_source": "Valeurs metier INFRA_STATION / type_station",
            "description": "Categorie de station.",
        },
        "date_mise_service": {
            "editable": True,
            "ingestable": True,
            "example_value": "2026-01-15",
            "validation_rule": "Format ISO YYYY-MM-DD.",
        },
        "altitude_m": {
            "editable": True,
            "ingestable": True,
            "example_value": "902.00",
            "unit_expected": "m",
        },
        "geom_wkt": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "POINT(-5.20372 35.05764)",
            "validation_rule": "WKT geometrique valide ; SRID declare dans la colonne srid.",
            "description": "Geometrie source requise pour la station.",
        },
        "srid": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "4326",
            "allowed_values_source": "4326 | 26191",
            "validation_rule": "SRID explicite autorise : 4326 ou 26191.",
            "description": "SRID de la geometrie source de la station.",
        },
    },
    "HYDRO_DEBIT": {
        "temps": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "2026-06-01T00:00:00Z",
            "validation_rule": "Timestamp ISO 8601.",
            "description": "Horodatage de mesure journaliere.",
        },
        "station_id": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "validation_rule": "UUID station existant dans infra.stations_mesure.id.",
            "reference_source": "infra.stations_mesure.id",
        },
        "valeur": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "12.75",
            "unit_expected": "m3/s",
            "validation_rule": "Valeur numerique >= 0.",
        },
        "est_valide": {
            "editable": True,
            "ingestable": True,
            "example_value": "true",
        },
    },
    "METEO_PRECIPITATION": {
        "temps": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "2026-06-01T00:00:00Z",
            "validation_rule": "Timestamp ISO 8601.",
        },
        "station_id": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "reference_source": "infra.stations_mesure.id",
            "validation_rule": "UUID station existant dans infra.stations_mesure.id.",
        },
        "val_observees": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "4.2",
            "unit_expected": "mm",
            "validation_rule": "Valeur numerique >= 0.",
        },
        "ire_precipitation": {
            "editable": True,
            "ingestable": True,
            "example_value": "1000/23",
        },
        "pas_temps": {
            "editable": True,
            "ingestable": True,
            "example_value": "daily",
            "allowed_values_source": "daily",
        },
    },
    "QUALITE_RIVIERE": {
        "temps": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "2026-06-01T10:30:00Z",
            "validation_rule": "Timestamp ISO 8601.",
        },
        "station_id": {
            "required": False,
            "editable": True,
            "ingestable": True,
            "reference_source": "infra.stations_mesure.id",
            "validation_rule": "UUID station existant dans infra.stations_mesure.id ; station_id ou ire_station requis.",
        },
        "ire_station": {
            "editable": True,
            "ingestable": True,
            "example_value": "2817/15",
            "reference_source": "infra.stations_mesure.code_station",
            "validation_rule": "Code station existant dans infra.stations_mesure.code_station.",
        },
        "parametre_qualite": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "NH4",
            "reference_source": "metadata.referentiel_parametre_canonique",
            "allowed_values_source": "Codes qualite actifs du referentiel canonique",
        },
        "valeur": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "15.5",
            "validation_rule": "Valeur numerique ; unites selon parametre.",
        },
    },
    "POLLUTION_SITE": {
        "site_code": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "ARB-DECH",
            "validation_rule": "Code site unique, non vide.",
        },
        "site_name": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "Decharge Khemisset",
        },
        "commune": {
            "editable": True,
            "ingestable": True,
            "example_value": "Ait Ouribel",
        },
        "province": {
            "editable": True,
            "ingestable": True,
            "example_value": "Khemisset",
        },
        "bassin": {
            "editable": True,
            "ingestable": True,
            "example_value": "Sebou",
        },
        "validation_status": {
            "editable": True,
            "ingestable": True,
            "example_value": "VALIDATED",
            "allowed_values_source": "VALIDATED | TO_VALIDATE | REJECTED",
        },
        "geom_wkt": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "POINT(-6.05529 32.87652)",
            "validation_rule": "WKT geometrique valide ; SRID declare dans la colonne srid.",
        },
        "srid": {
            "required": True,
            "editable": True,
            "ingestable": True,
            "example_value": "4326",
            "allowed_values_source": "4326 | 26191",
            "validation_rule": "SRID explicite autorise : 4326 ou 26191.",
        },
    },
}


INSTRUCTION_SETS: dict[str, list[str]] = {
    "HYDRO_DEBIT": [
        "Fournir un horodatage ISO 8601 dans la colonne temps.",
        "La valeur de debit est attendue en m3/s.",
        "Verifier que station_id existe deja dans le referentiel des stations.",
        "Ne pas injecter de doublons temps + station_id.",
    ],
    "METEO_PRECIPITATION": [
        "Utiliser val_observees pour la precipitation mesuree.",
        "Les valeurs sont attendues en mm.",
        "Conserver un pas de temps coherent, daily par defaut.",
    ],
    "QUALITE_RIVIERE": [
        "Renseigner parametre_qualite avec un code canonique actif.",
        "Verifier les unites selon le parametre avant remplissage.",
        "Une ligne correspond a une mesure unique station + date + parametre.",
    ],
    "POLLUTION_SITE": [
        "Chaque ligne represente un site pollution a identifier ou mettre a jour.",
        "Une geometrie WKT valide et un SRID explicite sont requis.",
        "Les codes IDP-C1B-* sont proteges et refuses dans ce lot.",
        "Les objets non localisables resteront hors exploitation metier.",
    ],
    "INFRA_STATION": [
        "Le canevas sert a decrire ou completer une station de mesure.",
        "La geometrie doit etre fournie en WKT avec SRID explicite.",
        "Le code station doit rester unique.",
    ],
}


class TemplateGenerationService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ClassRegistryRepository(db)

    def get_template_spec(self, class_code: str) -> dict[str, Any]:
        registry_row, state = self.repository.get_class(class_code)
        fields, field_source, field_registry_incomplete = self._resolve_template_fields(class_code, registry_row)
        warnings: list[str] = []
        if field_registry_incomplete:
            warnings.append("FIELD_REGISTRY_INCOMPLETE: spec generee via introspection/fallback controle.")
        if not registry_row.get("exposure_view_name"):
            warnings.append("Aucune vue d'exposition dediee: introspection ciblee sur la table source.")

        instructions = [
            f"Objectif: preparer un lot metier pour la classe {registry_row['class_label']}.",
            "Remplir uniquement la feuille DONNEES.",
            "Respecter les noms de colonnes et les types indiques.",
            "Consulter DICTIONNAIRE_CHAMPS et METADATA avant diffusion client.",
            *INSTRUCTION_SETS.get(class_code, []),
        ]

        return {
            "status": "OK" if not state.db_execution_pending else "DB_EXECUTION_PENDING",
            "class_code": class_code,
            "data": {
                "class_code": class_code,
                "class_label": registry_row["class_label"],
                "domain": registry_row["domain"],
                "target_schema": registry_row["target_schema"],
                "target_table": registry_row["target_table"],
                "staging_schema": registry_row.get("staging_schema"),
                "staging_table": registry_row.get("staging_table"),
                "template_version": TEMPLATE_VERSION,
                "file_formats": ["xlsx", "csv"],
                "field_source": field_source,
                "field_registry_incomplete": field_registry_incomplete,
                "fields": fields,
                "sheets": [
                    {
                        "sheet_name": "DONNEES",
                        "purpose": "Feuille a remplir par l'utilisateur metier.",
                        "columns": [field["field_name"] for field in fields],
                    },
                    {
                        "sheet_name": "INSTRUCTIONS",
                        "purpose": "Regles de remplissage et erreurs frequentes.",
                        "columns": ["section", "contenu"],
                    },
                    {
                        "sheet_name": "DICTIONNAIRE_CHAMPS",
                        "purpose": "Dictionnaire technique et metier des champs.",
                        "columns": [
                            "field_name",
                            "field_label",
                            "data_type",
                            "required",
                            "editable",
                            "ingestable",
                            "validation_rule",
                            "reference_source",
                            "example_value",
                        ],
                    },
                    {
                        "sheet_name": "METADATA",
                        "purpose": "Trace technique du canevas genere.",
                        "columns": ["key", "value"],
                    },
                ],
                "instructions": instructions,
                "metadata_rows": self._build_metadata_rows(registry_row),
                "warnings": warnings,
            },
            "metadata": {
                "registry_source": state.registry_source,
                "db_execution_pending": state.db_execution_pending,
                "warning": state.warning,
                "field_source": field_source,
                "field_registry_incomplete": field_registry_incomplete,
            },
        }

    def generate_template(self, class_code: str, file_format: str = "xlsx", generated_by: str | None = None) -> GeneratedTemplateFile:
        spec = self.get_template_spec(class_code)
        data = spec["data"]
        if file_format == "csv":
            content = self._build_csv_content(data["fields"])
            return GeneratedTemplateFile(
                filename=f"{class_code.lower()}_template_{datetime.now(UTC).strftime('%Y%m%d_%H%M%S')}.csv",
                media_type="text/csv; charset=utf-8",
                content=content,
            )

        content = self._build_xlsx_content(data, generated_by=generated_by or "data_admin_ui")
        return GeneratedTemplateFile(
            filename=f"{class_code.lower()}_template_{datetime.now(UTC).strftime('%Y%m%d_%H%M%S')}.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            content=content,
        )

    def _resolve_template_fields(
        self,
        class_code: str,
        registry_row: dict[str, Any],
    ) -> tuple[list[dict[str, Any]], str, bool]:
        field_registry_columns = self._field_registry_column_names()
        field_registry_rows: list[dict[str, Any]] = []
        if self.repository._table_exists("data_admin", "field_registry"):
            selectable_columns = [
                "field_name",
                "field_label",
                "data_type",
                "required",
                "editable",
                "ingestable",
                "validation_rule",
                "reference_source",
                "display_order",
            ]
            for optional_column in ("example_value", "unit_expected", "allowed_values_source", "description"):
                if optional_column in field_registry_columns:
                    selectable_columns.append(optional_column)

            sql = f"""
                SELECT {", ".join(selectable_columns)}
                FROM data_admin.field_registry
                WHERE class_code = :class_code
                ORDER BY display_order, field_name
            """
            try:
                field_registry_rows = [
                    dict(row)
                    for row in self.db.execute(text(sql), {"class_code": class_code}).mappings().all()
                ]
            except SQLAlchemyError:
                field_registry_rows = []

        if field_registry_rows:
            enriched = [self._apply_field_override(class_code, row, sample_row=None) for row in field_registry_rows]
            return enriched, "data_admin.field_registry", False

        schema_fields, _ = self.repository.get_class_schema(class_code)
        sample_row = self._load_sample_row(registry_row)
        enriched = [self._apply_field_override(class_code, row, sample_row=sample_row) for row in schema_fields]
        return enriched, "introspection_fallback", True

    def _field_registry_column_names(self) -> set[str]:
        try:
            rows = self.db.execute(
                text(
                    """
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_schema = 'data_admin'
                      AND table_name = 'field_registry'
                    """
                )
            ).all()
            return {str(row[0]) for row in rows}
        except SQLAlchemyError:
            return set()

    def _load_sample_row(self, registry_row: dict[str, Any]) -> dict[str, Any] | None:
        source_schema, source_name, _ = self.repository._resolve_read_source(registry_row)
        if not self.repository._object_exists(source_schema, source_name):
            return None
        try:
            qualified = self.repository._qualified_identifier(source_schema, source_name)
            row = self.db.execute(text(f"SELECT * FROM {qualified} LIMIT 1")).mappings().first()
            return dict(row) if row else None
        except SQLAlchemyError:
            return None

    def _apply_field_override(
        self,
        class_code: str,
        field_row: dict[str, Any],
        *,
        sample_row: dict[str, Any] | None,
    ) -> dict[str, Any]:
        merged = dict(field_row)
        override = FIELD_METADATA_OVERRIDES.get(class_code, {}).get(str(field_row["field_name"]), {})
        merged.update({key: value for key, value in override.items() if value is not None})
        merged.setdefault("required", False)
        merged.setdefault("editable", False)
        merged.setdefault("ingestable", False)
        merged.setdefault("validation_rule", None)
        merged.setdefault("reference_source", None)
        merged.setdefault("display_order", 0)
        merged.setdefault("example_value", None)
        merged.setdefault("unit_expected", None)
        merged.setdefault("allowed_values_source", None)
        merged.setdefault("description", None)

        if merged.get("example_value") is None and sample_row is not None:
            sample_value = sample_row.get(str(field_row["field_name"]))
            merged["example_value"] = self._serialize_example(sample_value)

        if merged.get("description") is None:
            merged["description"] = f"Champ {merged['field_label']} pour la classe {class_code}."

        return merged

    def _build_metadata_rows(self, registry_row: dict[str, Any]) -> list[dict[str, str]]:
        generated_at = datetime.now(UTC).isoformat()
        return [
            {"key": "class_code", "value": str(registry_row["class_code"])},
            {"key": "class_label", "value": str(registry_row["class_label"])},
            {"key": "domain", "value": str(registry_row["domain"])},
            {"key": "target_schema", "value": str(registry_row["target_schema"])},
            {"key": "target_table", "value": str(registry_row["target_table"])},
            {"key": "staging_schema", "value": str(registry_row.get("staging_schema") or "")},
            {"key": "staging_table", "value": str(registry_row.get("staging_table") or "")},
            {"key": "generated_at", "value": generated_at},
            {"key": "template_version", "value": TEMPLATE_VERSION},
            {"key": "generated_by", "value": "data_admin_service"},
        ]

    def _build_csv_content(self, fields: list[dict[str, Any]]) -> bytes:
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow([field["field_name"] for field in fields])
        writer.writerow([field.get("example_value") or "" for field in fields])
        return buffer.getvalue().encode("utf-8-sig")

    def _build_xlsx_content(self, data: dict[str, Any], *, generated_by: str) -> bytes:
        workbook = io.BytesIO()
        metadata_rows = list(data["metadata_rows"])
        metadata_rows[-1] = {"key": "generated_by", "value": generated_by}
        sheets = [
            (
                "DONNEES",
                [
                    [field["field_name"] for field in data["fields"]],
                    [field.get("field_label") or field["field_name"] for field in data["fields"]],
                    [field.get("example_value") or "" for field in data["fields"]],
                ],
            ),
            (
                "INSTRUCTIONS",
                [["section", "contenu"]]
                + [["GENERAL", instruction] for instruction in data["instructions"]]
                + [["WARNING", warning] for warning in data["warnings"]],
            ),
            (
                "DICTIONNAIRE_CHAMPS",
                [[
                    "field_name",
                    "field_label",
                    "data_type",
                    "required",
                    "editable",
                    "ingestable",
                    "validation_rule",
                    "reference_source",
                    "example_value",
                    "unit_expected",
                    "allowed_values_source",
                    "description",
                ]]
                + [[
                    field["field_name"],
                    field["field_label"],
                    field["data_type"],
                    field["required"],
                    field["editable"],
                    field["ingestable"],
                    field.get("validation_rule") or "",
                    field.get("reference_source") or "",
                    field.get("example_value") or "",
                    field.get("unit_expected") or "",
                    field.get("allowed_values_source") or "",
                    field.get("description") or "",
                ] for field in data["fields"]],
            ),
            (
                "METADATA",
                [["key", "value"]] + [[row["key"], row["value"]] for row in metadata_rows],
            ),
        ]

        with zipfile.ZipFile(workbook, "w", zipfile.ZIP_DEFLATED) as archive:
            archive.writestr("[Content_Types].xml", self._build_content_types_xml(len(sheets)))
            archive.writestr("_rels/.rels", self._build_root_rels_xml())
            archive.writestr("xl/workbook.xml", self._build_workbook_xml(sheets))
            archive.writestr("xl/_rels/workbook.xml.rels", self._build_workbook_rels_xml(len(sheets)))
            archive.writestr("docProps/core.xml", self._build_core_xml())
            archive.writestr("docProps/app.xml", self._build_app_xml(sheets))
            for index, (_, rows) in enumerate(sheets, start=1):
                archive.writestr(f"xl/worksheets/sheet{index}.xml", self._build_sheet_xml(rows))
        return workbook.getvalue()

    def _build_sheet_xml(self, rows: list[list[Any]]) -> str:
        xml_rows: list[str] = []
        for row_index, row in enumerate(rows, start=1):
            cells: list[str] = []
            for column_index, value in enumerate(row, start=1):
                cell_ref = f"{self._column_letter(column_index)}{row_index}"
                if value is None:
                    continue
                if isinstance(value, bool):
                    cells.append(f'<c r="{cell_ref}" t="b"><v>{1 if value else 0}</v></c>')
                    continue
                if isinstance(value, (int, float, Decimal)) and not isinstance(value, bool):
                    cells.append(f'<c r="{cell_ref}"><v>{value}</v></c>')
                    continue
                safe_text = escape(str(value))
                cells.append(f'<c r="{cell_ref}" t="inlineStr"><is><t>{safe_text}</t></is></c>')
            xml_rows.append(f'<row r="{row_index}">{"".join(cells)}</row>')
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            f'<sheetData>{"".join(xml_rows)}</sheetData>'
            "</worksheet>"
        )

    def _build_content_types_xml(self, sheet_count: int) -> str:
        overrides = [
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
            '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
            '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
        ]
        overrides.extend(
            f'<Override PartName="/xl/worksheets/sheet{index}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for index in range(1, sheet_count + 1)
        )
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/xml"/>'
            f'{"".join(overrides)}'
            "</Types>"
        )

    def _build_root_rels_xml(self) -> str:
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
            '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
            "</Relationships>"
        )

    def _build_workbook_xml(self, sheets: list[tuple[str, list[list[Any]]]]) -> str:
        sheet_nodes = "".join(
            f'<sheet name="{escape(name)}" sheetId="{index}" r:id="rId{index}"/>'
            for index, (name, _) in enumerate(sheets, start=1)
        )
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            f"<sheets>{sheet_nodes}</sheets>"
            "</workbook>"
        )

    def _build_workbook_rels_xml(self, sheet_count: int) -> str:
        relationships = "".join(
            f'<Relationship Id="rId{index}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{index}.xml"/>'
            for index in range(1, sheet_count + 1)
        )
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            f"{relationships}"
            "</Relationships>"
        )

    def _build_core_xml(self) -> str:
        now = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
            'xmlns:dc="http://purl.org/dc/elements/1.1/" '
            'xmlns:dcterms="http://purl.org/dc/terms/" '
            'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
            "<dc:creator>data_admin_service</dc:creator>"
            "<cp:lastModifiedBy>data_admin_service</cp:lastModifiedBy>"
            f'<dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>'
            f'<dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>'
            "</cp:coreProperties>"
        )

    def _build_app_xml(self, sheets: list[tuple[str, list[list[Any]]]]) -> str:
        titles = "".join(f"<vt:lpstr>{escape(name)}</vt:lpstr>" for name, _ in sheets)
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
            'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
            "<Application>WQDSS SAD Data Admin</Application>"
            f"<TitlesOfParts><vt:vector size=\"{len(sheets)}\" baseType=\"lpstr\">{titles}</vt:vector></TitlesOfParts>"
            "</Properties>"
        )

    @staticmethod
    def _column_letter(index: int) -> str:
        letters = ""
        current = index
        while current > 0:
            current, remainder = divmod(current - 1, 26)
            letters = chr(65 + remainder) + letters
        return letters

    @staticmethod
    def _serialize_example(value: Any) -> str | None:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, Decimal):
            return format(value, "f")
        return str(value)
