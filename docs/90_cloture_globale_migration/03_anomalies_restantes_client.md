# Anomalies restantes client

## Synthese

| ID | Bloc | Volume | Cause | Impact | Decision | Action | Responsable |
|---|---|---:|---|---|---|---|---|
| GEO-001 | nappes non resolues | 292 | correspondance nappe absente | analyses nappe incompletes | `CLIENT_REQUIRED` | fournir mapping officiel station/nappe | Client |
| GEO-002 | points eau nappe non resolus | 22 | rattachement point/nappe absent | cartes nappes incompletes | `CLIENT_REQUIRED` | fournir rattachement officiel | Client |
| GEO-003 | points eau station non resolus | 46 | mapping station/point absent | croisements station-point limites | `CLIENT_REQUIRED` | fournir mapping ou coordonnees | Client |
| GEO-004 | profils nappe non resolus | 1204 | profil/nappe non arbitre | analytics nappe limites | `CLIENT_REQUIRED` | fournir table profil/nappe | Client |
| GEO-005 | station suivi qualite barrage null I | 1 | identifiant station ambigu | ponctuel | `CLIENT_REQUIRED` | arbitrer station | Client |
| MET-001 | temperature | 0 | source brute vide | dashboard temperature indisponible | `DONNEE_NON_FOURNIE` | fournir fichier ou confirmer absence | Client |
| MET-002 | evaporation nulles | 10308 | lacunes source | analytics meteo avec trous | `CLIENT_REQUIRED_SI_COMPLEMENT` | fournir valeurs ou valider lacune | Client |

## Demandes minimales client

1. Mapping officiel stations/points/profils vers nappes.
2. Arbitrage station `null I`.
3. Confirmation d'absence ou transmission des donnees temperature.
4. Confirmation du statut des valeurs evaporation manquantes.
5. Confirmation que les nouveaux jeux SWAT/WASP remplaceront les jeux temporaires.

## Impact

Ces anomalies ne bloquent pas la cloture migration. Elles limitent les analyses avancees, certains croisements geographiques et la couverture meteo.
