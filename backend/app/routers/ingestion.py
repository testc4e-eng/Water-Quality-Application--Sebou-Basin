# backend/app/routers/ingestion.py
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, BackgroundTasks, Request, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
import shutil
import time
from pathlib import Path
from app.db.climate_database import get_climate_db
from app.services.ingestion_structural_validation import validate_structural_file
from app.services.ingestion_mapping_service import build_mapping_report
from app.services.ingestion_dedup_service import detect_duplicate_before_ingestion
from app.services.ingestion_simulation_service import simulate_ingestion_dry_run
from app.services.qa_validation_service import validate_scenario_qa
from app.services.ingestion_audit_service import (
    AuditResultInfo,
    build_file_info_from_path,
    list_ingestion_audit_logs,
    log_ingestion_action,
)
from app.services.qa_validation_service import QaFilters
from app.services.qa_validation_service import build_qa_critical_csv_export
from app.services.qa_threshold_service import list_thresholds, upsert_threshold
from app.security.deps import get_current_user
from app.security.models import SecurityUser

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])

UPLOAD_DIR = Path("data/uploads")


def _guess_model_from_filename(filename: str) -> str:
    name = filename.lower()
    if "swat" in name or name.endswith(".mdb") or name.endswith(".accdb"):
        return "SWAT OUTPUT"
    if "wasp" in name or "toxi" in name or name.endswith(".xlsx") or name.endswith(".xls"):
        return "WASP TOXI"
    return "INCONNU"


def _guess_encoding_from_filename(filename: str) -> str:
    name = filename.lower()
    if name.endswith(".mdb") or name.endswith(".accdb"):
        return "binary-mdb"
    if name.endswith(".xlsx") or name.endswith(".xls"):
        return "binary-excel"
    if name.endswith(".csv"):
        return "inconnu-csv"
    return "inconnu"


@router.post("/upload")
async def upload_files(
    request: Request,
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_climate_db),
    current_user: SecurityUser = Depends(get_current_user),
):
    """
    Handle multi-file upload for SWAT/WASP results.
    Detection of scenarios is done automatically in the background.
    """
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    saved_paths = []
    structural_reports = []
    mapping_reports = []
    duplicate_reports = []
    for file in files:
        started = time.perf_counter()
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_paths.append(str(file_path))
        try:
            report = validate_structural_file(str(file_path), original_filename=file.filename)
        except Exception as exc:
            report = {
                "modele_detecte": _guess_model_from_filename(file.filename),
                "colonnes_detectees": [],
                "colonnes_manquantes": [],
                "types_inferres": {},
                "lignes_vides": 0,
                "encodage": _guess_encoding_from_filename(file.filename),
                "statut_format": "INVALIDE",
                "message": str(exc),
            }
        structural_reports.append(
            {
                "filename": file.filename,
                "rapport_structurel": report,
            }
        )
        try:
            mapping_report = build_mapping_report(str(file_path), original_filename=file.filename)
        except Exception as exc:
            mapping_report = {
                "modele_detecte": report.get("modele_detecte", "INCONNU"),
                "format_detecte": report.get("format_detecte"),
                "score_completude_pct": 0.0,
                "score_pret_migration_pct": 0.0,
                "colonnes_orphelines": [],
                "champs_cibles_non_couverts": [],
                "champs_cibles_non_prets_migration": [],
                "tableau_mapping": [],
                "message": str(exc),
            }
        mapping_reports.append({"filename": file.filename, "rapport_mapping": mapping_report})
        try:
            duplicate_report = detect_duplicate_before_ingestion(
                db=db,
                path=str(file_path),
                original_filename=file.filename,
            )
        except Exception as exc:
            duplicate_report = {
                "statut": "NOUVEAU",
                "scenario_existant_id": None,
                "date_ingestion_originale": None,
                "action_requise": "PROCEDER",
                "zones_chevauchement": [],
                "autorisation": "PROCEDER",
                "message": str(exc),
            }
        duplicate_reports.append({"filename": file.filename, "controle_doublon": duplicate_report})
        nb_errors = len(report.get("colonnes_manquantes", []))
        if report.get("statut_format") == "INVALIDE" and nb_errors == 0:
            nb_errors = 1
        duration_ms = int((time.perf_counter() - started) * 1000)
        file_type = "SWAT" if "SWAT" in str(report.get("modele_detecte", "")).upper() else "WASP"
        log_ingestion_action(
            db=db,
            action="IMPORT",
            request=request,
            user_identifier=current_user.email,
            scenario_id=None,
            file_info=build_file_info_from_path(file_path, file_type=file_type),
            result=AuditResultInfo(
                statut=str(report.get("statut_format", "INVALIDE")),
                nb_erreurs=nb_errors,
                nb_lignes=int(report.get("total_lignes", 0) or 0),
                duree_ms=duration_ms,
            ),
            message_lisible=(
                f"Import du fichier {file.filename} ({file_type}) - "
                f"statut {report.get('statut_format', 'INVALIDE')}."
            ),
            metadata={"modele_detecte": report.get("modele_detecte"), "format_detecte": report.get("format_detecte")},
        )
    
    # Trigger background ingestion task (to be implemented)
    # background_tasks.add_task(process_ingestion_batch, saved_paths)
    
    return {
        "message": f"Successfully uploaded {len(files)} files.",
        "files": [f.filename for f in files],
        "status": "Processing in background...",
        "validation_structurelle": structural_reports,
        "rapport_mapping": mapping_reports,
        "controle_doublon": duplicate_reports,
    }


@router.post("/validation/structure")
async def validate_structure_before_ingestion(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_climate_db),
    current_user: SecurityUser = Depends(get_current_user),
):
    """
    Structural validation before value-level QA:
    - model detection (SWAT OUTPUT / WASP TOXI)
    - required columns
    - inferred types
    - empty rows / null values / encoding
    """
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    started = time.perf_counter()
    try:
        report = validate_structural_file(str(file_path), original_filename=file.filename)
        nb_errors = len(report.get("colonnes_manquantes", []))
        if report.get("statut_format") == "INVALIDE" and nb_errors == 0:
            nb_errors = 1
        file_type = "SWAT" if "SWAT" in str(report.get("modele_detecte", "")).upper() else "WASP"
        log_ingestion_action(
            db=db,
            action="VALIDATION",
            request=request,
            user_identifier=current_user.email,
            scenario_id=None,
            file_info=build_file_info_from_path(file_path, file_type=file_type),
            result=AuditResultInfo(
                statut=str(report.get("statut_format", "INVALIDE")),
                nb_erreurs=nb_errors,
                nb_lignes=int(report.get("total_lignes", 0) or 0),
                duree_ms=int((time.perf_counter() - started) * 1000),
            ),
            message_lisible=f"Validation structurelle du fichier {file.filename}: {report.get('statut_format', 'INVALIDE')}.",
            metadata={"modele_detecte": report.get("modele_detecte"), "format_detecte": report.get("format_detecte")},
        )
        return {
            "filename": file.filename,
            "rapport_structurel": report,
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Validation structurelle echouee: {exc}") from exc


@router.post("/validation/mapping")
async def validate_mapping_before_ingestion(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_climate_db),
    current_user: SecurityUser = Depends(get_current_user),
):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    started = time.perf_counter()
    try:
        mapping = build_mapping_report(str(file_path), original_filename=file.filename)
        log_ingestion_action(
            db=db,
            action="VALIDATION",
            request=request,
            user_identifier=current_user.email,
            scenario_id=None,
            file_info=build_file_info_from_path(file_path, file_type="SWAT" if "SWAT" in str(mapping.get("modele_detecte", "")).upper() else "WASP"),
            result=AuditResultInfo(
                statut="VALIDE" if float(mapping.get("score_completude_pct", 0.0)) > 0 else "ERREURS DETECTEES",
                nb_erreurs=len(mapping.get("champs_cibles_non_couverts", [])),
                nb_lignes=len(mapping.get("tableau_mapping", [])),
                duree_ms=int((time.perf_counter() - started) * 1000),
            ),
            message_lisible=f"Rapport mapping genere pour {file.filename}. Score completude: {mapping.get('score_completude_pct', 0.0)}%.",
            metadata={"mapping": True},
        )
        return {"filename": file.filename, "rapport_mapping": mapping}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Validation mapping echouee: {exc}") from exc


@router.post("/simulation/dry-run")
async def simulate_ingestion_before_publish(
    file: UploadFile = File(...),
    db: Session = Depends(get_climate_db),
    _: SecurityUser = Depends(get_current_user),
):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        report = simulate_ingestion_dry_run(
            db=db,
            path=str(file_path),
            original_filename=file.filename,
        )
        return report
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Simulation ingestion echouee: {exc}") from exc


@router.get("/scenarios")
def get_ingested_scenarios(db: Session = Depends(get_climate_db)):
    """
    Retrieve all available scenarios across SWAT and WASP.
    """
    swat_scenarios = db.execute(text("SELECT id, name, description FROM swat_sebou.swat_scenarios")).mappings().all()
    wasp_scenarios = db.execute(text("SELECT id, name, description FROM wasp_sebou.wasp_scenarios")).mappings().all()
    
    return {
        "swat": swat_scenarios,
        "wasp": wasp_scenarios
    }

@router.get("/validation/anomalies")
def get_data_anomalies(
    request: Request,
    scenario_id: int, 
    model: str = Query("swat", enum=["swat", "wasp"]),
    variable: str | None = Query(None),
    entity_id: int | None = Query(None),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    statut: str | None = Query(None),
    limit: int = Query(5000, ge=1, le=20000),
    db: Session = Depends(get_climate_db),
    current_user: SecurityUser = Depends(get_current_user),
):
    """
    Check for values exceeding thresholds (QA Rules).
    """
    started = time.perf_counter()
    statut_norm = statut.upper().strip() if statut else None
    try:
        qa_report = validate_scenario_qa(
            db=db,
            scenario_id=scenario_id,
            model=model,
            filters=QaFilters(
                variable=variable,
                entity_id=entity_id,
                date_from=date_from,
                date_to=date_to,
                statut=statut_norm,
            ),
            limit=limit,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    log_ingestion_action(
        db=db,
        action="VALIDATION",
        request=request,
        user_identifier=current_user.email,
        scenario_id=scenario_id,
        file_info=None,
        result=AuditResultInfo(
            statut=str(qa_report["statut_global"]),
            nb_erreurs=int(qa_report["total_erreurs"]),
            nb_lignes=int(qa_report["total_lignes"]),
            duree_ms=int((time.perf_counter() - started) * 1000),
        ),
        message_lisible=(
            f"Validation QA du scenario {scenario_id} ({model.upper()}) - "
            f"{qa_report['statut_global']} ({qa_report['total_erreurs']} anomalies)."
        ),
        metadata={
            "filters": {
                "variable": variable,
                "entity_id": entity_id,
                "date_from": date_from,
                "date_to": date_to,
                "statut": statut_norm,
            }
        },
    )

    # Backward-compatible keys for current frontend + new QA summary payload.
    return {
        "scenario_id": qa_report["scenario_id"],
        "model": qa_report["model"],
        "anomalies_count": qa_report["total_erreurs"],
        "alerts": qa_report["anomalies"],
        "qa_summary": {
            "total_lignes": qa_report["total_lignes"],
            "total_erreurs": qa_report["total_erreurs"],
            "total_critiques": qa_report["total_critiques"],
            "total_avertissements": qa_report["total_avertissements"],
            "statut_global": qa_report["statut_global"],
            "message": qa_report["message"],
        },
    }


@router.get("/qa/export/critique")
def export_qa_critical_errors_csv(
    scenario_id: int,
    model: str = Query("swat", enum=["swat", "wasp"]),
    db: Session = Depends(get_climate_db),
    _: SecurityUser = Depends(get_current_user),
):
    try:
        csv_text, file_name = build_qa_critical_csv_export(
            db=db,
            scenario_id=scenario_id,
            model=model,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return StreamingResponse(
        iter([csv_text.encode("utf-8-sig")]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{file_name}"'},
    )


@router.get("/qa/thresholds")
def get_qa_thresholds(
    model: str | None = Query(None),
    scenario_id: int | None = Query(None),
    limit: int = Query(500, ge=1, le=2000),
    db: Session = Depends(get_climate_db),
    _: SecurityUser = Depends(get_current_user),
):
    rows = list_thresholds(db=db, model=model, scenario_id=scenario_id, limit=limit)
    return {"rows": rows, "count": len(rows)}


@router.post("/qa/thresholds/upsert")
def upsert_qa_threshold(
    payload: dict = Body(...),
    db: Session = Depends(get_climate_db),
    _: SecurityUser = Depends(get_current_user),
):
    model = str(payload.get("model", "")).strip().lower()
    variable_name = str(payload.get("variable_name", "")).strip()
    if model not in {"swat", "wasp"}:
        raise HTTPException(status_code=422, detail="model must be swat or wasp")
    if not variable_name:
        raise HTTPException(status_code=422, detail="variable_name is required")
    upsert_threshold(
        db=db,
        model=model,
        variable_name=variable_name,
        scenario_id=payload.get("scenario_id"),
        min_value=payload.get("min_value"),
        max_value=payload.get("max_value"),
        warn_z_info=float(payload.get("warn_z_info", 2.0)),
        warn_z_avertissement=float(payload.get("warn_z_avertissement", 3.0)),
        is_active=bool(payload.get("is_active", True)),
    )
    return {"ok": True}


@router.get("/audit/history")
def get_ingestion_audit_history(
    limit: int = Query(200, ge=1, le=1000),
    db: Session = Depends(get_climate_db),
    _: SecurityUser = Depends(get_current_user),
):
    rows = list_ingestion_audit_logs(db=db, limit=limit)
    return {"rows": rows, "count": len(rows)}


@router.post("/audit/action")
def log_manual_ingestion_action(
    request: Request,
    payload: dict = Body(...),
    db: Session = Depends(get_climate_db),
    current_user: SecurityUser = Depends(get_current_user),
):
    action = str(payload.get("action", "")).upper().strip()
    if action not in {"PUBLICATION", "REJET"}:
        raise HTTPException(status_code=422, detail="action must be PUBLICATION or REJET")
    scenario_id = payload.get("scenario_id")
    message = payload.get("message_lisible") or f"Action {action} enregistree."
    result_payload = payload.get("resultat") or {}

    log_ingestion_action(
        db=db,
        action=action,
        request=request,
        user_identifier=current_user.email,
        scenario_id=int(scenario_id) if scenario_id is not None else None,
        file_info=None,
        result=AuditResultInfo(
            statut=str(result_payload.get("statut", action)),
            nb_erreurs=int(result_payload.get("nb_erreurs", 0)),
            nb_lignes=int(result_payload.get("nb_lignes", 0)),
            duree_ms=int(result_payload.get("duree_ms", 0)),
        ),
        message_lisible=str(message),
        metadata={"payload": payload},
    )
    return {"ok": True}
