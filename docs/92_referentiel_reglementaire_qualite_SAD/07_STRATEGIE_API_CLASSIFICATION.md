# Stratégie API classification

## `GET /api/v1/quality/thresholds`

Retourne les seuils actifs par type d'eau, paramètre, classe et version réglementaire.

Filtres : `type_eau`, `parameter_code`, `canonical_code`, `version_reglementaire`, `actif`.

## `POST /api/v1/quality/classify`

Payload minimal :

```json
{
  "type_eau": "surface_generale",
  "parameter_code": "DBO5",
  "value": 12.5,
  "unit": "mgO2/l",
  "measurement_date": "2026-05-19"
}
```

Réponse : classe, couleur, score, seuil utilisé, statut, source réglementaire, version, motif non classable si applicable.

Règles intégrées :

- métaux : retourner unité source `µg/l`, unité moteur `mg/L` et facteur `0.001` si conversion appliquée ;
- microbiologie : accepter `/100ml` et `UFC/100 mL` comme équivalents opérationnels ;
- `DBO5`/`DCO` : accepter `mgO2/l` et `mg/L` comme équivalents opérationnels ;
- nitrates : exposer `NO3-` comme canonique et `NO3` comme alias réglementaire ;
- oxygène dissous : exposer `O2_DISS` comme canonique et `O2_DISSOUS` comme alias réglementaire ;
- `Hg` : appliquer la règle spécifique validée.

## `POST /api/v1/quality/global-index`

Payload : liste de mesures d'un point/campagne. Réponse : classe globale par paramètre le plus pénalisant, détails par paramètre, paramètres exclus et motifs.

## `GET /api/v1/quality/regulatory-status`

Retourne la couverture réglementaire : paramètres classifiables, mappings validés, seuils actifs, conflits unités, paramètres observationnels.

## `POST /api/v1/pollution/predict-impact`

Entrée : scénario pollution, station/site/barrage cible, horizon temporel, concentrations prédites. Sortie : classification future, risque, alertes et recommandations.

## Gestion erreurs

- `422` : payload invalide ou unité absente.
- `404` : paramètre ou type d'eau inconnu.
- `409` : mapping ambigu ou règle non validée.
- `200` avec statut `NON_CLASSABLE_*` : donnée stockable mais non classifiable.
- `200` avec statut `PARAMETRE_ABSENT_CANONIQUE` : paramètre vrai absent du canonique, visualisable seulement.

## Frontend SAD

Les réponses doivent exposer `class_code`, `class_label`, `color`, `severity_order`, `regulatory_trace`, `non_classifiable_reason` pour dashboards, popups MapLibre et alertes.
