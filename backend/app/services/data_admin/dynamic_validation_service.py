from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


IDENTIFIER_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
FUTURE_TOLERANCE = timedelta(days=1)


@dataclass(frozen=True)
class DynamicValidationRule:
    rule_id: str
    class_code: str
    field_name: str | None
    rule_code: str
    rule_label: str
    severity: str
    rule_type: str
    reference_schema: str | None
    reference_table: str | None
    reference_column: str | None
    sql_template: str | None
    active: bool
    description: str | None
    created_at: datetime
    updated_at: datetime


@dataclass(frozen=True)
class DynamicValidationIssue:
    row_number: int
    field_name: str | None
    severity: str
    error_code: str
    error_message: str
    raw_value: str | None
    expected_rule: str | None
    error_scope: str
    rule_id: str


class DynamicValidationService:
    def __init__(self, db: Session):
        self.db = db
        self._exists_cache: dict[tuple[str, str, str, str], bool] = {}
        self._duplicate_cache: dict[tuple[str, str, tuple[tuple[str, Any], ...]], bool] = {}

    def list_rules(self, class_code: str | None = None) -> dict[str, Any]:
        query = """
            SELECT
                rule_id::text,
                class_code,
                field_name,
                rule_code,
                rule_label,
                severity,
                rule_type,
                reference_schema,
                reference_table,
                reference_column,
                sql_template,
                active,
                description,
                created_at,
                updated_at
            FROM data_admin.validation_rule_registry
        """
        params: dict[str, Any] = {}
        if class_code:
            query += " WHERE class_code = :class_code"
            params["class_code"] = class_code
        query += " ORDER BY class_code, rule_code"
        rows = self.db.execute(text(query), params).mappings().all()
        data = [dict(row) for row in rows]
        return {
            "status": "OK",
            "count": len(data),
            "data": data,
            "metadata": {"class_code": class_code},
        }

    def get_active_rules(self, class_code: str) -> list[DynamicValidationRule]:
        rows = self.db.execute(
            text(
                """
                SELECT
                    rule_id::text,
                    class_code,
                    field_name,
                    rule_code,
                    rule_label,
                    severity,
                    rule_type,
                    reference_schema,
                    reference_table,
                    reference_column,
                    sql_template,
                    active,
                    description,
                    created_at,
                    updated_at
                FROM data_admin.validation_rule_registry
                WHERE class_code = :class_code
                  AND active = true
                ORDER BY rule_code
                """
            ),
            {"class_code": class_code},
        ).mappings().all()
        return [DynamicValidationRule(**dict(row)) for row in rows]

    def validate_row(
        self,
        *,
        class_code: str,
        row_number: int,
        raw_row: dict[str, Any],
        normalized_row: dict[str, Any],
        active_rules: list[DynamicValidationRule],
    ) -> list[DynamicValidationIssue]:
        issues: list[DynamicValidationIssue] = []
        for rule in active_rules:
            issue = self._apply_rule(
                rule=rule,
                class_code=class_code,
                row_number=row_number,
                raw_row=raw_row,
                normalized_row=normalized_row,
            )
            if issue is not None:
                issues.append(issue)
        return issues

    def _apply_rule(
        self,
        *,
        rule: DynamicValidationRule,
        class_code: str,
        row_number: int,
        raw_row: dict[str, Any],
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        if rule.rule_code == "HYDRO_STATION_EXISTS":
            return self._validate_exists(rule, row_number, normalized_row, "station_id")
        if rule.rule_code == "HYDRO_DUPLICATE_EXISTING":
            return self._validate_duplicate_hydro(rule, row_number, normalized_row)
        if rule.rule_code == "HYDRO_VALUE_REASONABLE_MAX":
            return self._validate_range_max(rule, row_number, normalized_row, "valeur", 5000.0, "Le debit depasse le seuil raisonnable de 5000 m3/s.")
        if rule.rule_code == "HYDRO_TEMPS_NOT_FUTURE":
            return self._validate_not_future(rule, row_number, normalized_row, "temps")

        if rule.rule_code == "METEO_STATION_EXISTS":
            return self._validate_exists(rule, row_number, normalized_row, "station_id")
        if rule.rule_code == "METEO_DUPLICATE_EXISTING":
            return self._validate_duplicate_meteo(rule, row_number, normalized_row)
        if rule.rule_code == "METEO_VALUE_REASONABLE_MAX":
            return self._validate_range_max(rule, row_number, normalized_row, "val_observees", 500.0, "La precipitation depasse le seuil raisonnable de 500 mm.")
        if rule.rule_code == "METEO_TEMPS_NOT_FUTURE":
            return self._validate_not_future(rule, row_number, normalized_row, "temps")

        if rule.rule_code == "QUALITE_STATION_EXISTS":
            return self._validate_exists(rule, row_number, normalized_row, "station_id")
        if rule.rule_code == "QUALITE_IRE_EXISTS":
            return self._validate_exists(rule, row_number, normalized_row, "ire_station")
        if rule.rule_code == "QUALITE_PARAM_EXISTS":
            return self._validate_param_exists(rule, row_number, normalized_row)
        if rule.rule_code == "QUALITE_DUPLICATE_EXISTING":
            return self._validate_duplicate_qualite(rule, row_number, normalized_row)
        if rule.rule_code == "QUALITE_TEMPS_NOT_FUTURE":
            return self._validate_not_future(rule, row_number, normalized_row, "temps")

        if rule.rule_code == "INFRA_STATION_CODE_UNIQUE":
            return self._validate_unique_value(rule, row_number, normalized_row, "code_station")
        if rule.rule_code == "INFRA_GEOM_WKT_VALID":
            return self._validate_geom_parseable(rule, row_number, normalized_row)
        if rule.rule_code == "INFRA_SRID_ALLOWED":
            return self._validate_allowed_srid(rule, row_number, normalized_row)
        if rule.rule_code == "INFRA_GEOM_NOT_EMPTY":
            return self._validate_geom_not_empty(rule, row_number, normalized_row)
        if rule.rule_code == "INFRA_GEOM_WITHIN_MOROCCO_BOUNDS":
            return self._validate_geom_within_morocco(rule, row_number, normalized_row)

        if rule.rule_code == "POLLUTION_SITE_CODE_UNIQUE":
            return self._validate_unique_value(rule, row_number, normalized_row, "site_code")
        if rule.rule_code == "POLLUTION_GEOM_WKT_VALID":
            return self._validate_geom_parseable(rule, row_number, normalized_row)
        if rule.rule_code == "POLLUTION_SRID_ALLOWED":
            return self._validate_allowed_srid(rule, row_number, normalized_row)
        if rule.rule_code == "POLLUTION_GEOM_NOT_EMPTY":
            return self._validate_geom_not_empty(rule, row_number, normalized_row)
        if rule.rule_code == "POLLUTION_GEOM_WITHIN_MOROCCO_BOUNDS":
            return self._validate_geom_within_morocco(rule, row_number, normalized_row)
        if rule.rule_code == "POLLUTION_GEOMETRY_DUPLICATE_WARNING":
            return self._validate_duplicate_pollution_geometry(rule, row_number, normalized_row)

        return None

    def _validate_unique_value(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
        field_name: str,
    ) -> DynamicValidationIssue | None:
        value = normalized_row.get(field_name)
        if value in (None, ""):
            return None

        schema = self._safe_identifier(rule.reference_schema)
        table = self._safe_identifier(rule.reference_table)
        column = self._safe_identifier(rule.reference_column)
        found = self.db.execute(
            text(
                f"""
                SELECT EXISTS (
                    SELECT 1
                    FROM {schema}.{table}
                    WHERE {column} = :value
                ) AS found
                """
            ),
            {"value": value},
        ).scalar_one()
        if not found:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=field_name,
            severity=rule.severity,
            error_code="DUPLICATE_BUSINESS_KEY",
            error_message=f"La valeur fournie pour {field_name} existe deja dans la table cible.",
            raw_value=str(value),
            expected_rule=rule.description or rule.rule_label,
            error_scope="DUPLICATE",
            rule_id=rule.rule_id,
        )

    def _validate_exists(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
        field_name: str,
    ) -> DynamicValidationIssue | None:
        value = normalized_row.get(field_name)
        if value in (None, ""):
            return None

        schema = self._safe_identifier(rule.reference_schema)
        table = self._safe_identifier(rule.reference_table)
        column = self._safe_identifier(rule.reference_column)
        cache_key = (schema, table, column, str(value))
        if cache_key not in self._exists_cache:
            found = self.db.execute(
                text(
                    f"""
                    SELECT EXISTS (
                        SELECT 1
                        FROM {schema}.{table}
                        WHERE {column} = :value
                    ) AS found
                    """
                ),
                {"value": value},
            ).scalar_one()
            if rule.rule_code == "QUALITE_PARAM_EXISTS" and found:
                found = self.db.execute(
                    text(
                        """
                        SELECT EXISTS (
                            SELECT 1
                            FROM metadata.referentiel_parametre_canonique
                            WHERE code_parametre = :value
                              AND statut = 'ACTIF'
                        ) AS found
                        """
                    ),
                    {"value": value},
                ).scalar_one()
            self._exists_cache[cache_key] = bool(found)

        if self._exists_cache[cache_key]:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=field_name,
            severity=rule.severity,
            error_code="REFERENCE_NOT_FOUND",
            error_message=f"Valeur non trouvee dans le referentiel dynamique pour {field_name}.",
            raw_value=str(value),
            expected_rule=rule.description or rule.rule_label,
            error_scope="REFERENTIAL",
            rule_id=rule.rule_id,
        )

    def _validate_param_exists(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        value = normalized_row.get("parametre_qualite")
        if value in (None, ""):
            return None

        cache_key = ("metadata", "referentiel_parametre_canonique", "code_parametre_actif", str(value))
        if cache_key not in self._exists_cache:
            found = self.db.execute(
                text(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM metadata.referentiel_parametre_canonique
                        WHERE code_parametre = :value
                          AND statut = 'ACTIF'
                    ) AS found
                    """
                ),
                {"value": value},
            ).scalar_one()
            self._exists_cache[cache_key] = bool(found)

        if self._exists_cache[cache_key]:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name="parametre_qualite",
            severity=rule.severity,
            error_code="UNKNOWN_CANONICAL_PARAMETER",
            error_message="Le parametre qualite n'existe pas dans le referentiel canonique actif.",
            raw_value=str(value),
            expected_rule=rule.description or rule.rule_label,
            error_scope="REFERENTIAL",
            rule_id=rule.rule_id,
        )

    def _validate_duplicate_hydro(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        station_id = normalized_row.get("station_id")
        temps = normalized_row.get("temps")
        valeur = normalized_row.get("valeur")
        if station_id in (None, "") or temps in (None, "") or not isinstance(valeur, (int, float)):
            return None
        if self._parse_datetime(temps) is None:
            return None

        found = self._exists_duplicate(
            schema="hydro",
            table="mesure_debit",
            conditions={"station_id": station_id, "temps": temps, "valeur": valeur},
        )
        if not found:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=None,
            severity=rule.severity,
            error_code="DUPLICATE_CANDIDATE_EXISTING_MEASURE",
            error_message="Une mesure hydro identique existe deja dans la base metier.",
            raw_value=None,
            expected_rule=rule.description or rule.rule_label,
            error_scope="DUPLICATE",
            rule_id=rule.rule_id,
        )

    def _validate_duplicate_meteo(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        station_id = normalized_row.get("station_id")
        temps = normalized_row.get("temps")
        if station_id in (None, "") or temps in (None, ""):
            return None
        if self._parse_datetime(temps) is None:
            return None

        found = self._exists_duplicate(
            schema="meteo",
            table="mesure_precipitation",
            conditions={"station_id": station_id, "temps": temps},
        )
        if not found:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=None,
            severity=rule.severity,
            error_code="DUPLICATE_CANDIDATE_EXISTING_MEASURE",
            error_message="Une mesure precipitation existe deja dans la base metier.",
            raw_value=None,
            expected_rule=rule.description or rule.rule_label,
            error_scope="DUPLICATE",
            rule_id=rule.rule_id,
        )

    def _validate_duplicate_qualite(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        temps = normalized_row.get("temps")
        param = normalized_row.get("parametre_qualite")
        station_id = normalized_row.get("station_id")
        ire_station = normalized_row.get("ire_station")
        if temps in (None, "") or param in (None, ""):
            return None
        if self._parse_datetime(temps) is None:
            return None

        found = False
        if station_id not in (None, ""):
            found = self._exists_duplicate(
                schema="qualite",
                table="mesure_qualite_riviere",
                conditions={"station_id": station_id, "temps": temps, "parametre_qualite": param},
            )
        elif ire_station not in (None, ""):
            found = self._exists_duplicate(
                schema="qualite",
                table="mesure_qualite_riviere",
                conditions={"ire_station": ire_station, "temps": temps, "parametre_qualite": param},
            )

        if not found:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=None,
            severity=rule.severity,
            error_code="DUPLICATE_CANDIDATE_EXISTING_MEASURE",
            error_message="Une mesure qualite riviere equivalente existe deja dans la base metier.",
            raw_value=None,
            expected_rule=rule.description or rule.rule_label,
            error_scope="DUPLICATE",
            rule_id=rule.rule_id,
        )

    def _validate_range_max(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
        field_name: str,
        max_value: float,
        message: str,
    ) -> DynamicValidationIssue | None:
        value = normalized_row.get(field_name)
        if not isinstance(value, (int, float)) or float(value) <= max_value:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=field_name,
            severity=rule.severity,
            error_code="VALUE_ABOVE_REASONABLE_RANGE",
            error_message=message,
            raw_value=str(value),
            expected_rule=rule.description or rule.rule_label,
            error_scope="REFERENTIAL",
            rule_id=rule.rule_id,
        )

    def _validate_not_future(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
        field_name: str,
    ) -> DynamicValidationIssue | None:
        value = normalized_row.get(field_name)
        if value in (None, ""):
            return None
        moment = self._parse_datetime(value)
        if moment is None or moment <= datetime.now(UTC) + FUTURE_TOLERANCE:
            return None

        return DynamicValidationIssue(
            row_number=row_number,
            field_name=field_name,
            severity=rule.severity,
            error_code="FUTURE_TIMESTAMP",
            error_message="L'horodatage est dans le futur et doit etre verifie.",
            raw_value=str(value),
            expected_rule=rule.description or rule.rule_label,
            error_scope="TEMPORAL",
            rule_id=rule.rule_id,
        )

    def _validate_allowed_srid(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        srid = normalized_row.get("srid")
        if srid in (None, ""):
            return None
        if int(srid) in {4326, 26191}:
            return None
        return DynamicValidationIssue(
            row_number=row_number,
            field_name="srid",
            severity=rule.severity,
            error_code="GEOM_SRID_ALLOWED",
            error_message="Le SRID geometrique doit etre 4326 ou 26191.",
            raw_value=str(srid),
            expected_rule=rule.description or rule.rule_label,
            error_scope="GEOSPATIAL",
            rule_id=rule.rule_id,
        )

    def _validate_geom_parseable(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        geom_wkt = normalized_row.get("geom_wkt")
        srid = normalized_row.get("srid")
        if geom_wkt in (None, "") or srid in (None, ""):
            return None
        try:
            with self.db.begin_nested():
                parsed = self.db.execute(
                    text("SELECT ST_AsText(ST_GeomFromText(:geom_wkt, :srid))"),
                    {"geom_wkt": geom_wkt, "srid": int(srid)},
                ).scalar_one()
        except Exception:  # noqa: BLE001
            parsed = None
        if parsed:
            return None
        return DynamicValidationIssue(
            row_number=row_number,
            field_name="geom_wkt",
            severity=rule.severity,
            error_code="GEOM_WKT_VALID",
            error_message="La geometrie WKT est invalide ou illisible par PostGIS.",
            raw_value=str(geom_wkt),
            expected_rule=rule.description or rule.rule_label,
            error_scope="GEOSPATIAL",
            rule_id=rule.rule_id,
        )

    def _validate_geom_not_empty(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        check = self._geometry_boolean(
            normalized_row,
            "SELECT NOT ST_IsEmpty(ST_GeomFromText(:geom_wkt, :srid))",
        )
        if check is True:
            return None
        return DynamicValidationIssue(
            row_number=row_number,
            field_name="geom_wkt",
            severity=rule.severity,
            error_code="GEOM_NOT_EMPTY",
            error_message="La geometrie ne doit pas etre vide.",
            raw_value=str(normalized_row.get("geom_wkt")),
            expected_rule=rule.description or rule.rule_label,
            error_scope="GEOSPATIAL",
            rule_id=rule.rule_id,
        )

    def _validate_geom_within_morocco(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        check = self._geometry_boolean(
            normalized_row,
            """
            SELECT ST_Intersects(
                ST_Transform(ST_GeomFromText(:geom_wkt, :srid), 4326),
                ST_MakeEnvelope(-17.5, 20.0, -0.5, 37.5, 4326)
            )
            """,
        )
        if check is True:
            return None
        return DynamicValidationIssue(
            row_number=row_number,
            field_name="geom_wkt",
            severity=rule.severity,
            error_code="GEOM_WITHIN_MOROCCO_BOUNDS",
            error_message="La geometrie est hors des bornes geographiques attendues pour le Maroc.",
            raw_value=str(normalized_row.get("geom_wkt")),
            expected_rule=rule.description or rule.rule_label,
            error_scope="GEOSPATIAL",
            rule_id=rule.rule_id,
        )

    def _validate_duplicate_pollution_geometry(
        self,
        rule: DynamicValidationRule,
        row_number: int,
        normalized_row: dict[str, Any],
    ) -> DynamicValidationIssue | None:
        geom_wkt = normalized_row.get("geom_wkt")
        srid = normalized_row.get("srid")
        if geom_wkt in (None, "") or srid in (None, ""):
            return None
        try:
            with self.db.begin_nested():
                found = self.db.execute(
                    text(
                        """
                        SELECT EXISTS (
                            SELECT 1
                            FROM geo.ref_site_pollution
                            WHERE geom_4326 IS NOT NULL
                              AND ST_Equals(
                                  geom_4326,
                                  ST_Transform(ST_GeomFromText(:geom_wkt, :srid), 4326)
                              )
                        ) AS found
                        """
                    ),
                    {"geom_wkt": geom_wkt, "srid": int(srid)},
                ).scalar_one()
        except Exception:  # noqa: BLE001
            found = False
        if not found:
            return None
        return DynamicValidationIssue(
            row_number=row_number,
            field_name="geom_wkt",
            severity=rule.severity,
            error_code="POLLUTION_GEOMETRY_DUPLICATE_WARNING",
            error_message="Une geometrie de site pollution identique existe deja dans la base.",
            raw_value=str(geom_wkt),
            expected_rule=rule.description or rule.rule_label,
            error_scope="DUPLICATE",
            rule_id=rule.rule_id,
        )

    def _exists_duplicate(self, *, schema: str, table: str, conditions: dict[str, Any]) -> bool:
        schema_name = self._safe_identifier(schema)
        table_name = self._safe_identifier(table)
        key = (schema_name, table_name, tuple(sorted(conditions.items())))
        if key in self._duplicate_cache:
            return self._duplicate_cache[key]

        predicates: list[str] = []
        params: dict[str, Any] = {}
        for index, (column, value) in enumerate(conditions.items()):
            column_name = self._safe_identifier(column)
            param_name = f"p{index}"
            predicates.append(f"{column_name} = :{param_name}")
            params[param_name] = value

        found = self.db.execute(
            text(
                f"""
                SELECT EXISTS (
                    SELECT 1
                    FROM {schema_name}.{table_name}
                    WHERE {' AND '.join(predicates)}
                ) AS found
                """
            ),
            params,
        ).scalar_one()
        self._duplicate_cache[key] = bool(found)
        return bool(found)

    def _geometry_boolean(self, normalized_row: dict[str, Any], query: str) -> bool | None:
        geom_wkt = normalized_row.get("geom_wkt")
        srid = normalized_row.get("srid")
        if geom_wkt in (None, "") or srid in (None, ""):
            return None
        try:
            with self.db.begin_nested():
                return bool(
                    self.db.execute(
                        text(query),
                        {"geom_wkt": geom_wkt, "srid": int(srid)},
                    ).scalar_one()
                )
        except Exception:  # noqa: BLE001
            return None

    @staticmethod
    def _parse_datetime(value: Any) -> datetime | None:
        raw = str(value).strip()
        if raw.endswith("Z"):
            raw = raw[:-1] + "+00:00"
        try:
            parsed = datetime.fromisoformat(raw)
        except ValueError:
            return None
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=UTC)
        return parsed.astimezone(UTC)

    @staticmethod
    def _safe_identifier(value: str | None) -> str:
        if not value or not IDENTIFIER_RE.match(value):
            raise ValueError(f"Invalid SQL identifier: {value}")
        return value
