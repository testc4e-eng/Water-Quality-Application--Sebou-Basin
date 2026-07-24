"""Service métier pour le dashboard Pollution Campagnes.

Lecture seule sur qualite.source_pollution_prelevement et tables associées.
Les seuils proviennent de metadata.qualite_seuil_reglementaire quand ils existent,
avec un fallback provisoire pour CrT.
"""

from __future__ import annotations

import re
from datetime import date
from typing import Any, Optional

from sqlalchemy import text
from sqlalchemy.orm import Session


# ============================================================
# PARAMÈTRES SURVEILLÉS
# ============================================================
PARAMETRES_ALERTE_PRIORITAIRES = [
    # Métaux lourds
    "Cd",
    "Pb",
    "Hg",
    "CrT",
    # Métaux traces
    "As_",
    "Cu",
    "Ni",
    "Zn",
    # Pollution organique
    "DBO5",
    "DCO",
    "MES",
    "NH4_",
    "NO3_",
    # Nutriments
    "PT",
    "PO43_",
    "NTK",
    # Physico-chimique
    "pH",
    "Conduc",
    "O2_Diss",
    "T_eau",
    "Turbidité",
]

# Seuils fallback pour les paramètres prioritaires non trouvés dans le référentiel
SEUILS_FALLBACK: dict[str, dict[str, Any]] = {
    "CrT": {"seuil": 0.050, "unite": "mg/L"},
}


# ============================================================
# DÉFINITION DES CAMPAGNES
# ============================================================
def _campagne_id_sql(column: str = "p.date_prelevement") -> str:
    """Expression SQL CASE pour dériver l'identifiant de campagne."""
    return f"""
        CASE
            WHEN {column} BETWEEN '2024-09-01' AND '2024-09-30' THEN 'IDP_GLOBALE_2024'
            WHEN {column} BETWEEN '2025-10-01' AND '2025-12-31' THEN 'IDP_MARCHE_CADRE_2024'
            ELSE 'INCONNU'
        END
    """


def _campagne_id_from_date(d: Optional[date]) -> str:
    if d is None:
        return "INCONNU"
    if date(2024, 9, 1) <= d <= date(2024, 9, 30):
        return "IDP_GLOBALE_2024"
    if date(2025, 10, 1) <= d <= date(2025, 12, 31):
        return "IDP_MARCHE_CADRE_2024"
    return "INCONNU"


def _campagne_date_range(campagne_id: Optional[str]) -> tuple[Optional[date], Optional[date]]:
    if campagne_id == "IDP_GLOBALE_2024":
        return (date(2024, 9, 1), date(2024, 9, 30))
    if campagne_id == "IDP_MARCHE_CADRE_2024":
        return (date(2025, 10, 1), date(2025, 12, 31))
    return (None, None)


# ============================================================
# UTILITAIRES
# ============================================================
def _is_below_lq(qualifier: Optional[str], raw: Optional[str]) -> bool:
    return bool(qualifier == "<" or (raw and raw.strip().startswith("<")))


def _extract_lq(raw: Optional[str]) -> Optional[float]:
    """Extrait la valeur après '<' dans valeur_raw, ex: '<0,010' -> 0.01."""
    if not raw:
        return None
    raw = raw.strip().replace(" ", "")
    if not raw.startswith("<"):
        return None
    candidate = raw[1:].replace(",", ".")
    candidate = re.sub(r"[^0-9.\-]", "", candidate)
    try:
        return float(candidate)
    except ValueError:
        return None


def _load_seuils(db: Session) -> dict[str, dict[str, Any]]:
    """Charge les seuils réglementaires actifs pour les paramètres prioritaires."""
    sql = text(
        """
        SELECT
            m.source_value AS param_code,
            MIN(s.borne_max_moteur) AS seuil,
            MAX(s.unite_moteur) AS unite
        FROM metadata.qualite_seuil_reglementaire s
        JOIN metadata.qualite_parametre_reglementaire p ON p.id = s.parametre_reglementaire_id
        JOIN metadata.referentiel_parametre r ON r.code_canonique = p.code_canonique_cible
        JOIN metadata.mapping_parametre_source m ON m.parametre_ref_id = r.id
        WHERE s.actif = true
          AND s.borne_max_moteur IS NOT NULL
          AND m.source_schema = 'qualite'
          AND m.source_table = 'source_pollution_mesure_param'
          AND m.source_column = 'param_code_legacy'
          AND m.source_value = ANY(:priority_params)
        GROUP BY m.source_value
        """
    )
    rows = db.execute(sql, {"priority_params": PARAMETRES_ALERTE_PRIORITAIRES}).mappings().all()
    seuils = {row.param_code: {"seuil": float(row.seuil), "unite": row.unite} for row in rows}
    for param, fallback in SEUILS_FALLBACK.items():
        if param not in seuils:
            seuils[param] = fallback.copy()
    return seuils


def _alert_level(
    param_code: str,
    valeur: Optional[float],
    qualifier: Optional[str],
    raw: Optional[str],
    seuils: dict[str, dict[str, Any]],
) -> Optional[str]:
    if valeur is None:
        return None
    if _is_below_lq(qualifier, raw):
        return None
    seuil_info = seuils.get(param_code)
    if not seuil_info:
        return None
    seuil = seuil_info["seuil"]
    if valeur >= 2 * seuil:
        return "CRITICAL"
    if valeur >= seuil:
        return "WARNING"
    return None


def _row_to_prelevement_detail(row: Any) -> dict[str, Any]:
    return {
        "id_prelevement": str(row.id),
        "date_prelevement": row.date_prelevement,
        "point_prelevement": row.point_prelevement,
        "campagne_id": _campagne_id_from_date(row.date_prelevement),
        "commune": row.commune,
        "province": row.province,
        "nature": row.nature,
        "observation": row.observation,
        "debit_raw": row.debit_raw,
        "coord_x": row.coord_x,
        "coord_y": row.coord_y,
        "longitude": row.longitude,
        "latitude": row.latitude,
    }


# ============================================================
# LISTES
# ============================================================
def list_campagnes(db: Session) -> list[dict[str, Any]]:
    """Synthèse par campagne déduite des dates de prélèvement."""
    sql = text(
        f"""
        SELECT
            {_campagne_id_sql("p.date_prelevement")} AS campagne_id,
            MIN(p.date_prelevement) AS date_min,
            MAX(p.date_prelevement) AS date_max,
            COUNT(DISTINCT p.id) AS nb_prelevements,
            COUNT(DISTINCT p.point_prelevement) AS nb_points,
            COUNT(DISTINCT m.param_code_legacy) AS nb_parametres
        FROM qualite.source_pollution_prelevement p
        LEFT JOIN qualite.source_pollution_mesure_param m
               ON m.prelevement_id = p.id
        GROUP BY campagne_id
        ORDER BY date_min DESC
        """
    )
    rows = db.execute(sql).mappings().all()
    return [dict(row) for row in rows]


def _count_alertes_par_prelevement(db: Session, ids: list[str]) -> dict[str, int]:
    if not ids:
        return {}
    seuils = _load_seuils(db)
    sql = text(
        """
        SELECT
            prelevement_id,
            param_code_legacy,
            valeur_num,
            valeur_raw,
            valeur_qualifier
        FROM qualite.source_pollution_mesure_param
        WHERE prelevement_id::text = ANY(:ids)
          AND param_code_legacy = ANY(:priority_params)
          AND valeur_num IS NOT NULL
          AND COALESCE(valeur_qualifier, '') != '<'
          AND valeur_raw NOT LIKE '<%'
        """
    )
    rows = db.execute(
        sql, {"ids": ids, "priority_params": PARAMETRES_ALERTE_PRIORITAIRES}
    ).mappings().all()
    counts: dict[str, int] = {}
    for row in rows:
        if _alert_level(row.param_code_legacy, row.valeur_num, row.valeur_qualifier, row.valeur_raw, seuils):
            pid = str(row.prelevement_id)
            counts[pid] = counts.get(pid, 0) + 1
    return counts


def list_prelevements(
    db: Session,
    *,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    campagne: Optional[str] = None,
    site: Optional[str] = None,
    parametre: Optional[str] = None,
    limit: int = 500,
    offset: int = 0,
) -> list[dict[str, Any]]:
    """Liste filtrable des prélèvements de campagne."""
    params: dict[str, Any] = {"limit": limit, "offset": offset}

    where = ["p.geom IS NOT NULL"]

    if date_from:
        where.append("p.date_prelevement >= :date_from")
        params["date_from"] = date_from
    if date_to:
        where.append("p.date_prelevement <= :date_to")
        params["date_to"] = date_to
    if site:
        where.append("p.point_prelevement ILIKE :site")
        params["site"] = f"%{site}%"
    if parametre:
        where.append(
            """
            EXISTS (
                SELECT 1 FROM qualite.source_pollution_mesure_param m2
                WHERE m2.prelevement_id = p.id
                  AND m2.param_code_legacy = :parametre
            )
            """
        )
        params["parametre"] = parametre

    nb_mesures_sub = """
        (SELECT COUNT(*) FROM qualite.source_pollution_mesure_param m
         WHERE m.prelevement_id = p.id) AS nb_mesures
    """

    sql = text(
        f"""
        WITH base AS (
            SELECT
                p.id,
                p.date_prelevement,
                p.point_prelevement,
                p.commune,
                {_campagne_id_sql("p.date_prelevement")} AS campagne_id,
                ST_X(ST_Transform(p.geom, 4326)) AS longitude,
                ST_Y(ST_Transform(p.geom, 4326)) AS latitude,
                {nb_mesures_sub}
            FROM qualite.source_pollution_prelevement p
            WHERE {" AND ".join(where)}
        )
        SELECT *
        FROM base
        WHERE (:campagne IS NULL OR campagne_id = :campagne)
        ORDER BY date_prelevement DESC
        LIMIT :limit OFFSET :offset
        """
    )
    params["campagne"] = campagne

    rows = db.execute(sql, params).mappings().all()
    prelevements = [
        {
            "id_prelevement": str(row.id),
            "date_prelevement": row.date_prelevement,
            "point_prelevement": row.point_prelevement,
            "campagne_id": row.campagne_id,
            "longitude": row.longitude,
            "latitude": row.latitude,
            "nb_mesures": row.nb_mesures,
            "nb_alertes": 0,
        }
        for row in rows
    ]

    ids = [p["id_prelevement"] for p in prelevements]
    counts = _count_alertes_par_prelevement(db, ids)
    for p in prelevements:
        p["nb_alertes"] = counts.get(p["id_prelevement"], 0)

    return prelevements


# ============================================================
# DÉTAIL / MESURES / LIENS
# ============================================================
def get_prelevement_detail(db: Session, id_prelevement: str) -> Optional[dict[str, Any]]:
    sql = text(
        """
        SELECT
            p.id,
            p.date_prelevement,
            p.point_prelevement,
            p.commune,
            p.province,
            p.nature,
            p.observation,
            p.debit_raw,
            p.coord_x,
            p.coord_y,
            ST_X(ST_Transform(p.geom, 4326)) AS longitude,
            ST_Y(ST_Transform(p.geom, 4326)) AS latitude
        FROM qualite.source_pollution_prelevement p
        WHERE p.id = :id
        """
    )
    row = db.execute(sql, {"id": id_prelevement}).mappings().first()
    if not row:
        return None
    return _row_to_prelevement_detail(row)


def get_prelevement_mesures(db: Session, id_prelevement: str) -> list[dict[str, Any]]:
    seuils = _load_seuils(db)
    sql = text(
        """
        SELECT
            m.param_code_legacy,
            m.valeur_num,
            m.valeur_raw,
            m.valeur_qualifier,
            ref.unite
        FROM qualite.source_pollution_mesure_param m
        LEFT JOIN metadata.mapping_parametre_source map
               ON map.source_schema = 'qualite'
              AND map.source_table = 'source_pollution_mesure_param'
              AND map.source_column = 'param_code_legacy'
              AND map.source_value = m.param_code_legacy
        LEFT JOIN metadata.referentiel_parametre ref
               ON ref.id = map.parametre_ref_id
        WHERE m.prelevement_id = :id
        ORDER BY m.param_code_legacy
        """
    )
    rows = db.execute(sql, {"id": id_prelevement}).mappings().all()
    result = []
    for row in rows:
        alert = _alert_level(row.param_code_legacy, row.valeur_num, row.valeur_qualifier, row.valeur_raw, seuils)
        result.append(
            {
                "param_code_legacy": row.param_code_legacy,
                "valeur_num": row.valeur_num,
                "valeur_raw": row.valeur_raw,
                "valeur_qualifier": row.valeur_qualifier,
                "unite": row.unite,
                "lq": _extract_lq(row.valeur_raw),
                "alert_level": alert,
                "is_prioritaire": row.param_code_legacy in PARAMETRES_ALERTE_PRIORITAIRES,
            }
        )
    return result


def get_prelevement_liens(db: Session, id_prelevement: str) -> list[dict[str, Any]]:
    sql = text(
        """
        SELECT entite_type, entite_id, mapping_method, is_primary
        FROM qualite.source_pollution_prelevement_lien
        WHERE prelevement_id = :id
        ORDER BY is_primary DESC, entite_type
        """
    )
    rows = db.execute(sql, {"id": id_prelevement}).mappings().all()
    return [dict(row) for row in rows]


# ============================================================
# ALERTES
# ============================================================
def list_alerts(
    db: Session,
    *,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    parametre: Optional[str] = None,
    level: Optional[str] = None,
    campagne: Optional[str] = None,
    limit: int = 500,
) -> list[dict[str, Any]]:
    """Liste des dépassements de seuils sur les paramètres prioritaires."""
    seuils = _load_seuils(db)

    params: dict[str, Any] = {"limit": limit}
    where = [
        "m.valeur_num IS NOT NULL",
        "COALESCE(m.valeur_qualifier, '') != '<'",
        "m.valeur_raw NOT LIKE '<%'",
        "m.param_code_legacy = ANY(:priority_params)",
    ]
    params["priority_params"] = PARAMETRES_ALERTE_PRIORITAIRES

    if date_from:
        where.append("p.date_prelevement >= :date_from")
        params["date_from"] = date_from
    if date_to:
        where.append("p.date_prelevement <= :date_to")
        params["date_to"] = date_to
    if parametre:
        where.append("m.param_code_legacy = :parametre")
        params["parametre"] = parametre

    sql = text(
        f"""
        SELECT
            m.param_code_legacy,
            m.valeur_num,
            m.valeur_raw,
            m.valeur_qualifier,
            ref.unite AS unite_referentiel,
            p.id AS prelevement_id,
            p.date_prelevement,
            p.point_prelevement,
            {_campagne_id_sql("p.date_prelevement")} AS campagne_id
        FROM qualite.source_pollution_mesure_param m
        JOIN qualite.source_pollution_prelevement p ON p.id = m.prelevement_id
        LEFT JOIN metadata.mapping_parametre_source map
               ON map.source_schema = 'qualite'
              AND map.source_table = 'source_pollution_mesure_param'
              AND map.source_column = 'param_code_legacy'
              AND map.source_value = m.param_code_legacy
        LEFT JOIN metadata.referentiel_parametre ref
               ON ref.id = map.parametre_ref_id
        WHERE {" AND ".join(where)}
        ORDER BY p.date_prelevement DESC, p.point_prelevement, m.param_code_legacy
        LIMIT :limit
        """
    )

    rows = db.execute(sql, params).mappings().all()
    alerts = []
    for row in rows:
        alert = _alert_level(row.param_code_legacy, row.valeur_num, row.valeur_qualifier, row.valeur_raw, seuils)
        if not alert:
            continue
        seuil_info = seuils[row.param_code_legacy]
        alert_campagne = _campagne_id_from_date(row.date_prelevement)
        if campagne and alert_campagne != campagne:
            continue
        if level and alert != level:
            continue
        alerts.append(
            {
                "parametre": row.param_code_legacy,
                "valeur": row.valeur_num,
                "seuil": seuil_info["seuil"],
                "unite": seuil_info.get("unite") or row.unite_referentiel or "",
                "station_nom": row.point_prelevement,
                "date_prelevement": row.date_prelevement,
                "alert_level": alert,
                "prelevement_id": str(row.prelevement_id),
                "campagne_id": alert_campagne,
            }
        )
    return alerts
