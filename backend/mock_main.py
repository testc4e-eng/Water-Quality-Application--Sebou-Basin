from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.pollution import router as pollution_router
from app.api.v1.propagation import router as propagation_router
from app.routers.business_map import router as business_map_router

app = FastAPI(title="WQDSS Mock API", version="mock")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pollution_router, prefix="/api/v1")
app.include_router(propagation_router, prefix="/api/v1")
app.include_router(business_map_router, prefix="/api/v1/business-map")


@app.get("/api/v1/recommendations")
def mock_recommendations(domain: str = "pollution", site_id: str | None = None, limit: int = 5):
    return []


_MOCK_QUALITY_PARAMETERS = [
    {"parametre_qualite": "pH", "measure_count": 49654, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "DBO5", "measure_count": 48210, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "DCO", "measure_count": 48180, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "NO3", "measure_count": 47950, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "NH4", "measure_count": 47820, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "MES", "measure_count": 47600, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "O2 dissous", "measure_count": 47510, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "Conductivite", "measure_count": 47380, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "Temperature", "measure_count": 47200, "station_count": 6, "date_min": "2023-12-06T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "Orthophosphates", "measure_count": 46850, "station_count": 5, "date_min": "2023-12-07T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "Coliformes", "measure_count": 42100, "station_count": 5, "date_min": "2023-12-07T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "Nitrites", "measure_count": 41500, "station_count": 5, "date_min": "2023-12-08T23:00:00", "date_max": "2026-01-05T23:00:00"},
    {"parametre_qualite": "Chlorures", "measure_count": 40900, "station_count": 4, "date_min": "2023-12-08T23:00:00", "date_max": "2026-01-05T23:00:00"},
]


@app.get("/api/v1/quality/unified/stations")
def mock_quality_stations(support_type: str | None = None, ire_station: str | None = None, station_id: str | None = None):
    stations = [
        {
            "ire_station": "1355/8",
            "station_id": "01f1a32a-f424-4f5b-ab26-6cb57a601d81",
            "station_nom": "P29 a allal tazi",
            "code_station": "1355/8",
            "bassin_nom": None,
            "sous_bassin_nom": "Bas Sebou",
            "latitude": 34.518629489594126,
            "longitude": -6.326761863500497,
            "support_type": "SENTINELLE",
            "measure_count": 8292,
            "parameter_count": 13,
            "date_min": "2023-12-06T23:00:00",
            "date_max": "2026-01-05T23:00:00",
        },
        {
            "ire_station": "3695/8",
            "station_id": "710cbf59-4303-4d7c-8173-1083560eef5a",
            "station_nom": "aval bel ksiri",
            "code_station": "3695/8",
            "bassin_nom": None,
            "sous_bassin_nom": "Bas Sebou",
            "latitude": 34.56937502455539,
            "longitude": -5.982566340969747,
            "support_type": "SENTINELLE",
            "measure_count": 8496,
            "parameter_count": 13,
            "date_min": "2023-12-06T23:00:00",
            "date_max": "2026-01-05T23:00:00",
        },
        {
            "ire_station": "1541/15",
            "station_id": "d098a56d-7e97-453f-b1c0-32305b595087",
            "station_nom": "pont rp 26",
            "code_station": "1541/15",
            "bassin_nom": None,
            "sous_bassin_nom": "Moyen Sebou",
            "latitude": 34.309017946633176,
            "longitude": -5.146177541797031,
            "support_type": "SENTINELLE",
            "measure_count": 8274,
            "parameter_count": 13,
            "date_min": "2023-12-08T23:00:00",
            "date_max": "2026-01-05T23:00:00",
        },
        {
            "ire_station": "2263/15",
            "station_id": "706fc2fe-3cee-4ec2-8e85-dbde9b672f89",
            "station_nom": "dar el arsa",
            "code_station": "2263/15",
            "bassin_nom": None,
            "sous_bassin_nom": "Moyen Sebou Amont",
            "latitude": 34.19565290018216,
            "longitude": -4.9285031210990065,
            "support_type": "SENTINELLE",
            "measure_count": 8274,
            "parameter_count": 13,
            "date_min": "2023-12-08T23:00:00",
            "date_max": "2026-01-05T23:00:00",
        },
        {
            "ire_station": "1540/15",
            "station_id": "b647955a-e26d-4564-8509-25cb40ef1404",
            "station_nom": "azib soltane",
            "code_station": "1540/15",
            "bassin_nom": None,
            "sous_bassin_nom": "Moyen Sebou",
            "latitude": 34.32455013367434,
            "longitude": -5.485333294244439,
            "support_type": "SENTINELLE",
            "measure_count": 8268,
            "parameter_count": 13,
            "date_min": "2023-12-07T23:00:00",
            "date_max": "2026-01-05T23:00:00",
        },
        {
            "ire_station": "3738/8",
            "station_id": "c1299320-3bdb-4bb3-8bbf-0f9dc3ca71ef",
            "station_nom": "amont barrage de garde",
            "code_station": "3738/8",
            "bassin_nom": None,
            "sous_bassin_nom": "Bas Sebou",
            "latitude": 34.48822256266676,
            "longitude": -6.4128407680116295,
            "support_type": "SENTINELLE",
            "measure_count": 8350,
            "parameter_count": 13,
            "date_min": "2023-12-20T23:00:00",
            "date_max": "2026-01-05T23:00:00",
        },
    ]
    if support_type:
        stations = [s for s in stations if s["support_type"] == support_type]
    if ire_station:
        stations = [s for s in stations if s["ire_station"] == ire_station]
    if station_id:
        stations = [s for s in stations if s["station_id"] == station_id]
    return stations


@app.get("/api/v1/quality/unified/parameters")
def mock_quality_parameters(
    support_type: str | None = None,
    ire_station: str | None = None,
    station_id: str | None = None,
):
    """Mock aligné sur GET /quality/unified/parameters (backend complet)."""
    parameters = list(_MOCK_QUALITY_PARAMETERS)
    if support_type and support_type != "SENTINELLE":
        return []
    if ire_station or station_id:
        parameters = [{**p, "station_count": min(p["station_count"], 1)} for p in parameters]
    return parameters


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8011)
