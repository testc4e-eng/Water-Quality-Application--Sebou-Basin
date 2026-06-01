# Blocages restants

| Blocage | Niveau | Chantier | Décision/action attendue |
|---|---|---|---|
| MNT/DEM absent | BLOQUANT | hydraulique | fournir raster MNT validé |
| `TYPE_EAU_NON_OPERATIONNEL` non implémenté | WARNING | qualité API | refuser ou signaler les types documentaires |
| `water_type` deprecated sans warning confirmé | WARNING | qualité API | ajouter warning/logs ou refuser en prod |
| Data landscape obsolète sur température | WARNING | documentation | mettre à jour `docs/07_donnees_et_referentiels/00_data_landscape.md` |
| DB schema summary obsolète sur température | WARNING | documentation | mettre à jour cardinalité et colonnes lineage |
| Dashboard préprod non validé navigateur | WARNING | frontend | test complet avec backend HTTP réel |
| Pollution IDP préprod bloquée | WARNING | spatial/data | finaliser arbitrages spatiaux métier |
