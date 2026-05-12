# Rapport decision

## Synthese

| Decision | Nombre parametres-table | Volume lignes | Action |
|---|---:|---:|---|
| corriger automatiquement apres validation | 27 | 50619 | executer script mapping sûr apres backup et validation explicite |
| valider C4E | 9 | 3087 | confirmer nomenclature puis ajouter au script |
| demander client | 11 | 8493 | arbitrer NTK, PT, F, MO_METAL, SIO2 |
| creer nouveau referentiel / demander client | 17 | 174 | creer parametres manquants ou classer legacy |
| laisser en backlog | 0 | 0 | non recommande pour les mappings sûrs |

## Recommandation finale

| Categorie | Decision |
|---|---|
| mappings sûrs | `GO` apres validation explicite |
| mappings probables | `HOLD` validation C4E |
| mappings ambigus | `CLIENT_REQUIRED` |
| non trouves | `CLIENT_REQUIRED` ou creation referentiel |

## Mise a jour apres validation C4E

| Decision | Volume estime | Action |
|---|---:|---|
| mapping sur apres enrichissement referentiel | 62361 | executer `12_sql_mapping_parametres_FINAL_VALIDATION_REQUISE.sql` apres validation explicite |
| `MO_METAL` client required | 11 | ne pas mapper, transmettre contexte au client/C4E |
| `NUMEROTATION` legacy ignore | 1 | ne pas exposer dashboard, laisser hors mapping qualite |

Les cas `NTK`, `PT`, `F`, `SIO2`, `DBO5_DEC2H`, `CR`, les microbiologiques, organoleptiques et `UNREC_BORE_MG_L` sont reclasses en mappings surs apres enrichissement du referentiel.

## Limites

- Le referentiel canonique contient tres peu d'alias qualite actifs.
- Aucun matching approximatif ne doit etre execute en correction reelle.
- `MO_METAL` reste non resolu et ne doit pas etre mappe automatiquement.
- Les parametres microbiologiques et organoleptiques non trouves demandent creation referentielle ou exclusion dashboard.

## Decision operationnelle

Prochaine etape recommandee : valider d'abord l'enrichissement referentiel, puis executer le script final `12_sql_mapping_parametres_FINAL_VALIDATION_REQUISE.sql`.
