# Phase 5 - Backend refactor

## Perimetre

La bascule backend a ete realisee sans modification des tables metier.

Objets applicatifs ajustes :

| Fichier | Changement |
|---|---|
| `backend/app/routers/observatory.py` | Les endpoints barrage consomment `hydro.mesure_barrage_param` via `parametre_code`. |
| `backend/app/routers/entities.py` | Les donnees d'entite barrage exposent les cinq parametres depuis la table parametrique. |
| `backend/app/routers/analytics.py` | Ordre dashboard ajoute pour `apports_hm3` et `transfert`. |

## Regles metier appliquees

| Metric API | Parametre canonique | Unite |
|---|---|---|
| `niveau_barrage` | `NIVEAU_EAU` | `m` |
| `volume_barrage` | `VOLUME` | `Mm3` |
| `lacher_barrage` | `LACHER` | `Mm3/j` |
| `apports_hm3` | `APPORTS_HM3` | `Mm3/j` |
| `transfert` | `TRANSFERT` | `Mm3/j` |

`lacher_m3s` reste uniquement un nom legacy rejete : il n'est pas expose comme verite metier.

## Controle

`python -m py_compile backend/app/routers/observatory.py backend/app/routers/entities.py backend/app/routers/analytics.py` : OK.
