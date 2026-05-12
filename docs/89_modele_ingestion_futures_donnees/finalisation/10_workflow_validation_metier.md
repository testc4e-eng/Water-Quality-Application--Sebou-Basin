# Workflow validation metier

## Etats

| Etat | Description |
|---|---|
| `DRAFT` | batch charge brut |
| `QA_FAILED` | controles bloquants |
| `QUARANTINE_REVIEW` | arbitrage requis |
| `C4E_VALIDATED` | correction C4E approuvee |
| `CLIENT_REQUIRED` | retour client attendu |
| `READY_TO_PUBLISH` | pret publication |
| `PUBLISHED` | publie |
| `ROLLED_BACK` | annule |

## Matrice decision

| Cas | Responsable |
|---|---|
| alias clair dictionnaire C4E | C4E |
| unite manquante mais evidente | C4E |
| GEO non resolu | Client |
| parametre ambigu | Client/C4E selon contexte |
| SWAT/WASP nouveau scenario | Modelisation + client |

## Preuve requise

Toute decision doit pointer vers :

- dictionnaire metier ;
- SQL de controle ;
- fichier source ;
- ligne source ;
- utilisateur validateur ;
- date validation.
