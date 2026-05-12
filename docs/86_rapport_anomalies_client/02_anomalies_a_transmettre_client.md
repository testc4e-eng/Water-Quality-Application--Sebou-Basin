# Anomalies a transmettre client

## IDP / GEO / donnees source

| Anomalie | Volume | Classe | Attendu client |
|---|---:|---|---|
| nappes non resolues | 292 | CLIENT_REQUIRED | fournir correspondance officielle nappe / code / libelle |
| points eau nappe non resolus | 22 | CLIENT_REQUIRED | confirmer identifiants et rattachement |
| points eau station non resolus | 46 | CLIENT_REQUIRED | fournir mapping station ou coordonnees |
| profils nappe non resolus | 1204 | CLIENT_REQUIRED | fournir table de correspondance profil/nappe |
| station suivi qualite barrage null I non resolue | 1 | CLIENT_REQUIRED | arbitrer identifiant station |
| points sans XY ou geom source manquante | selon fichier source client | CLIENT_REQUIRED | fournir coordonnees ou autoriser exclusion |

## Donnees absentes ou incompletes

| Anomalie | Volume | Classe | Attendu client |
|---|---:|---|---|
| temperature vide | 0 ligne cible | CLIENT_REQUIRED | confirmer absence de donnees ou transmettre fichiers |
| valeurs evaporation nulles | 10308 | CLIENT_REQUIRED si source existe | transmettre valeurs manquantes ou valider lacune |
| pollution non numerique | 3447 | CLIENT_REQUIRED si valeur attendue numerique | confirmer signification des qualifiers |

## Message client

Ces anomalies ne bloquent pas la cloture migration. Elles conditionnent uniquement la qualite d'exploitation avancee, les analyses IA/LLM et certains croisements geographiques.

