# Rapport decision final `table_cible`

## Synthese decisionnelle

| Classe | Volume | Decision |
|---|---:|---|
| meteo | 5 | Affecter aux vues meteo specialisees |
| hydrologie | 1 | Affecter au modele barrage parametrique |
| qualite physico-chimie | 2 | Affecter a `api.v_qualite_physicochimie` |
| qualite chimie minerale | 14 | Affecter a `api.v_qualite_chimie_minerale` |
| qualite metaux | 23 | Affecter a `api.v_qualite_metaux` |
| qualite pollution organique | 5 | Affecter a `api.v_qualite_pollution_organique` |
| qualite microbiologie | 3 | Affecter a `api.v_qualite_microbiologie` |
| qualite biologique | 4 | Affecter a `api.v_qualite_biologique` |
| qualite organoleptique | 1 | Affecter a `api.v_qualite_organoleptique`, consultation only |
| qualite terrain | 2 | Affecter a `api.v_qualite_terrain` |
| hydromorphologie / contexte station | 2 | Affecter a `api.v_qualite_contexte_station`, consultation only |
| barrage qualite | 1 | Affecter a `api.v_barrage_qualite` |
| client required / hors restitution | 2 | Laisser sans `table_cible` |

## Decisions structurantes

- `api.v_qualite_dashboard_global` reste un agregateur, pas une cible primaire.
- `T_AIR` garde une cible principale qualite terrain pour l'existant ; le futur pipeline meteo portera sa propre exposition temperature.
- `DISQUE_SECCHI` garde une cible principale barrage qualite selon l'usage majoritaire actuel ; les vues devront filtrer par support.
- `FM` et `F_M_MES` ne doivent pas etre exposes.
- `COULEUR`, `LARGEUR` et `PROFONDEUR` sont consultation only / hors analytics.

## Recommandation

| Action | Decision |
|---|---|
| Figer la matrice documentaire | `GO` |
| Preparer revue technique des vues | `DONE` |
| Creer les vues physiques | `DONE` |
| Executer le SQL update `table_cible` | `DONE_2026_05_13` |
| Modifier API/frontend | `HOLD` |

## Execution controlee du 2026-05-13

| Controle | Resultat |
|---|---:|
| Backup logique cree | `audit.bkp_ref_table_cible_final_metier_20260513` |
| Lignes backup | 65 |
| Parametres mis a jour | 63 |
| Parametres actifs restants sans `table_cible` | 2 |
| Parametres vers vue inexistante | 0 |
| Cibles primaires vers `api.v_qualite_dashboard_global` | 0 |
| Unites modifiees | 0 |
| Alias modifies | 0 |
| Autres champs modifies | 0 |

Parametres restes volontairement sans `table_cible` :

- `FM`
- `F_M_MES`

Statut final : `TABLE_CIBLE_REFERENTIEL_SPECIALISEES_APPLIQUEES`.

## Statut post-execution

| Chantier | Statut |
|---|---|
| Vues SQL specialisees | `CREEES` |
| `metadata.referentiel_parametre_canonique.table_cible` | `APPLIQUE_63_PARAMETRES` |
| API FastAPI | `HOLD` |
| Frontend | `HOLD` |
| Ingestion V1 | `GO_CONCEPTION` |
