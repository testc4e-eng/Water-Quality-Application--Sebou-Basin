from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class CampagneSummary(BaseModel):
    """Synthèse d'une campagne de prélèvement pollution."""

    campagne_id: str = Field(..., description="Identifiant métier de la campagne, déduit de la date (à valider).")
    date_min: date
    date_max: date
    nb_prelevements: int
    nb_points: int = Field(..., description="Nombre de points de prélèvement distincts.")
    nb_parametres: int = Field(..., description="Nombre de paramètres mesurés dans la campagne.")


class PrelevementListItem(BaseModel):
    """Prélèvement affiché dans la liste / sur la carte."""

    id_prelevement: str
    date_prelevement: date
    point_prelevement: Optional[str] = None
    campagne_id: str
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    nb_mesures: int
    nb_alertes: int


class PrelevementDetail(BaseModel):
    """Métadonnées d'un prélèvement."""

    id_prelevement: str
    date_prelevement: date
    point_prelevement: Optional[str] = None
    campagne_id: str
    commune: Optional[str] = None
    province: Optional[str] = None
    nature: Optional[str] = None
    observation: Optional[str] = None
    debit_raw: Optional[str] = None
    coord_x: Optional[float] = None
    coord_y: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None


class MesureItem(BaseModel):
    """Mesure paramétrée d'un prélèvement."""

    parametre: str = Field(..., alias="param_code_legacy")
    valeur: Optional[float] = Field(None, alias="valeur_num")
    valeur_raw: Optional[str] = None
    unite: Optional[str] = None
    lq: Optional[float] = Field(None, description="Limite de quantification déduite de valeur_raw si '< LQ'.")
    qualifieur: Optional[str] = Field(None, alias="valeur_qualifier")
    alert_level: Optional[str] = Field(None, description="WARNING ou CRITICAL si dépassement.")
    is_prioritaire: bool = Field(False, description="Fait partie de la liste des paramètres prioritaires.")

    model_config = {"populate_by_name": True}


class PrelevementMesuresResponse(BaseModel):
    """Fiche détail : prélèvement + ses 51 mesures."""

    prelevement: PrelevementDetail
    mesures: List[MesureItem]


class PrelevementLien(BaseModel):
    """Lien vers une entité d'inventaire pollution."""

    entite_type: str
    entite_id: str
    mapping_method: Optional[str] = None
    is_primary: bool


class PrelevementLiensResponse(BaseModel):
    entites: List[PrelevementLien]


class PollutionAlert(BaseModel):
    """Dépassement de seuil provisoire."""

    parametre: str
    valeur: float
    seuil: float
    unite: Optional[str] = None
    station_nom: Optional[str] = Field(None, description="Nom du point de prélèvement.")
    date_prelevement: date
    alert_level: str = Field(..., pattern="^(WARNING|CRITICAL)$")
    prelevement_id: str
    campagne_id: str
