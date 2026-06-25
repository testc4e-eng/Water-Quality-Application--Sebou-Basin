from fastapi import APIRouter, Query
from app.services.hydrology.routing_service import route_to_garde

router = APIRouter()


@router.get("/downstream")
def get_downstream_path_legacy(
    lng: float = Query(..., description="Longitude de l'incident (WGS84)"),
    lat: float = Query(..., description="Latitude de l'incident (WGS84)")
):
    """
    Routage topologique vers le barrage de garde Sebou.
    (Ancien endpoint - redirige vers le moteur NetworkX)
    """
    return route_to_garde(lng, lat)


@router.get("/downstream-to-garde")
def get_downstream_to_garde(
    lng: float = Query(..., description="Longitude de l'incident (WGS84)"),
    lat: float = Query(..., description="Latitude de l'incident (WGS84)")
):
    """
    Routage réel sur la topologie (NetworkX) jusqu'au barrage de garde.
    Mode démonstration – ETA fictif.
    """
    return route_to_garde(lng, lat)


@router.get("/topology-qa")
def get_topology_qa():
    """
    Récupère les données de topologie pour le mode QA (nœuds, arêtes, connectivité).
    """
    from app.services.hydrology.topology_qa import get_topology_qa_geojson
    return get_topology_qa_geojson()
