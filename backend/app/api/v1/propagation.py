from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.services.propagation import propagation_pollution_service


router = APIRouter(prefix="/propagation", tags=["Propagation pollution"])


def _validate_single_source_input(
    *,
    site_id: str | None,
    prelevement_id: str | None,
    lng: float | None,
    lat: float | None,
) -> None:
    input_modes = 0
    if site_id:
        input_modes += 1
    if prelevement_id:
        input_modes += 1
    if lng is not None or lat is not None:
        if lng is None or lat is None:
            raise HTTPException(
                status_code=400,
                detail="Le mode coordinates exige les deux paramètres lng et lat.",
            )
        input_modes += 1

    if input_modes == 0:
        raise HTTPException(
            status_code=400,
            detail="Fournir exactement un mode d'entrée: site_id, prelevement_id, ou lng+lat.",
        )
    if input_modes > 1:
        raise HTTPException(
            status_code=400,
            detail="Un seul mode d'entrée est autorisé: site_id, prelevement_id, ou lng+lat.",
        )


def _handle_domain_errors(func, **kwargs):
    try:
        return func(**kwargs)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/snap-diagnostic")
def get_snap_diagnostic(
    site_id: str | None = Query(None),
    prelevement_id: str | None = Query(None),
    lng: float | None = Query(None),
    lat: float | None = Query(None),
):
    _validate_single_source_input(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    return _handle_domain_errors(
        propagation_pollution_service.snap_diagnostic,
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )


@router.get("/source-to-garde")
def get_source_to_garde(
    site_id: str | None = Query(None),
    prelevement_id: str | None = Query(None),
    lng: float | None = Query(None),
    lat: float | None = Query(None),
    vitesse_reference_kmh: float = Query(10.0, gt=0),
):
    _validate_single_source_input(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    return _handle_domain_errors(
        propagation_pollution_service.propagate_source_to_garde,
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
        vitesse_reference_kmh=vitesse_reference_kmh,
    )


@router.get("/source-to-stations")
def get_source_to_stations(
    site_id: str | None = Query(None),
    prelevement_id: str | None = Query(None),
    lng: float | None = Query(None),
    lat: float | None = Query(None),
    vitesse_reference_kmh: float = Query(10.0, gt=0),
    station_type: str | None = Query(None),
    max_target_snap_distance_m: float = Query(1000.0, ge=0),
    only_reachable: bool = Query(True),
    limit: int = Query(50, ge=1, le=500),
):
    _validate_single_source_input(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    return _handle_domain_errors(
        propagation_pollution_service.propagate_to_stations,
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
        vitesse_reference_kmh=vitesse_reference_kmh,
        station_type=station_type,
        max_target_snap_distance_m=max_target_snap_distance_m,
        only_reachable=only_reachable,
        limit=limit,
    )


@router.get("/source-to-barrages")
def get_source_to_barrages(
    site_id: str | None = Query(None),
    prelevement_id: str | None = Query(None),
    lng: float | None = Query(None),
    lat: float | None = Query(None),
    vitesse_reference_kmh: float = Query(10.0, gt=0),
    max_target_snap_distance_m: float = Query(1000.0, ge=0),
    only_reachable: bool = Query(True),
    limit: int = Query(50, ge=1, le=500),
):
    _validate_single_source_input(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    return _handle_domain_errors(
        propagation_pollution_service.propagate_to_barrages,
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
        vitesse_reference_kmh=vitesse_reference_kmh,
        max_target_snap_distance_m=max_target_snap_distance_m,
        only_reachable=only_reachable,
        limit=limit,
    )


@router.get("/source-to-exutoires")
def get_source_to_exutoires(
    site_id: str | None = Query(None),
    prelevement_id: str | None = Query(None),
    lng: float | None = Query(None),
    lat: float | None = Query(None),
    vitesse_reference_kmh: float = Query(10.0, gt=0),
    only_reachable: bool = Query(True),
    limit: int = Query(50, ge=1, le=500),
):
    _validate_single_source_input(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    return _handle_domain_errors(
        propagation_pollution_service.propagate_to_exutoires,
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
        vitesse_reference_kmh=vitesse_reference_kmh,
        only_reachable=only_reachable,
        limit=limit,
    )
