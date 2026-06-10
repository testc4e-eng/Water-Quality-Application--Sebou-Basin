# Limites et Décisions de Bascule

## Limites Actuelles
- L'Accueil DG dépend historiquement de la table `qualite.mesure_qualite_sebou` avec une logique métier spécifique dans `backend/app/services/dashboard/home_service.py`. Il ne faut **pas** le casser.
- Les performances de l'UNION ALL sur 119 000 lignes avec des jointures sur `api.v_station_dimension` sont correctes, mais devront être surveillées en production si le volume croît de manière exponentielle.
- La colonne `unite` n'étant pas matérialisée dans les tables sources, elle doit être déduite par le frontend via le référentiel métier (paramètres).

## Décision de Bascule (Dashboard Qualité)

**Statut Recommandé** : `GO_BASCULE_DASHBOARD_QUALITE`

**Action** :
Il est recommandé d'entamer les modifications sur le frontend (`frontend/src/pages/DashboardQualiteReglementaire.tsx` et services associés) pour qu'il consomme exclusivement :
- `/api/v1/quality/unified/stations`
- `/api/v1/quality/unified/timeseries`

**Règle d'or** : 
Le Dashboard Accueil DG reste branché sur les anciennes routes pour l'instant. Une fois le Dashboard Qualité stabilisé avec la vue unifiée, nous pourrons envisager de migrer le Dashboard DG et procéder au décommissionnement des anciennes routes obsolètes.
