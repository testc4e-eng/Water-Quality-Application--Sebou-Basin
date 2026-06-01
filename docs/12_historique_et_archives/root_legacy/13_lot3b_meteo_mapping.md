# LOT 3B : Plan de Mappage Climatologique (Météo)

## 1. Topologie des Faisceaux d'Ingestion
Le système météorologique a été centralisé en abandonnant les tables brutes au profit exclusif de la chaîne de valeur complétée (données stations couplées par assimilation NASA/simulations). Le lot 3B unifie trois sources vers trois schémas de production.

### Flux A : Précipitation Chronologique (`__ANO_LOT3B-001__`)
- **Source** : `public.mesures_precipitations_jr_traitees`
- **Cible** : `meteo.mesure_precipitation`
- **Clé Idempotente** : `[station_id, temps]`
- **Mapped metrics** : `val_observees`, `val_power_nasa`, `val_remplies`
- **Règle NULL Absolu** : Si la triangulation des relevés (`val_observees` AND `val_power_nasa` AND `val_remplies`) pointe vers du strict `NULL`, on relègue aux `WOULD_SKIP`. La conservation de dates fantômes coûte >10k lignes en BDD inutiles.

### Flux B : Maximales Annuelles Précipitations
- **Source** : `public.mesures_precipitations_jr_max`
- **Cible** : `meteo.mesure_precipitation_annuelle_max`
- **Clé Idempotente** : `[station_id, annee]`
- **Mapped metrics** : `p_max`, `p_annuelle`

### Flux C : Évaporation Mesurée
- **Source** : `public.mesures_evaporation_jr`
- **Cible** : `meteo.mesure_evaporation`
- **Clé Idempotente** : `[station_id, temps]`
- **Mapped metrics** : `val_evaporation` (transcrit en `valeur`)
- **Règle Négatifs** : Si `val_evaporation < 0` (erreur instrumentale), un tag QA peut être généré à l'instar du log hydrologique si stipulé.

## 2. Dépendances et Pivot Fonctionnel
1. **Identité GéoSpatiale** : Aucun tuple météo ne passe à défaut d'une traduction fonctionnelle prouvée `ire_station` -> `infra.stations_mesure.id`. C'est l'étage souverain du matching (`WOULD_CONFLICT`).
2. **Aucune Logique Externe Neige/Givre** : Si le MCD originel n'embarque aucune ségrégation cristalline, aucune supposition n'altérera des tags arbitraires. La météorologie brute est préservée.

## 3. Logique d'Arbitrage Automate (Dry-Run Checkers)
- 🟦 **WOULD_INSERT** : La combinaison `[station_id, temps]` (ou `annee`) n'existe originellement pas sur le pôle Prod.
- 🟨 **WOULD_UPDATE** : La date a été reconnue mais les mesures (volumes météorologiques, lissages, p_annuelle) différent de la source (> 0.0001). C'est la trace d'un rejeu de calcul NASAPower sur la table historisée ou d'une correction métier. La source primant.
- 🟩 **WOULD_SKIP** : La ligne est mathématiquement identique, ou les relevés sont stricts `NULL` (Filtre anti-ghosting).
- 🟥 **WOULD_CONFLICT** : Collision avec la référence ID d'infrastructure.
