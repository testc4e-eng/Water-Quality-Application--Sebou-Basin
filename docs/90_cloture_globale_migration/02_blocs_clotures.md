# Blocs clotures

## Tableau final

| ID | Bloc | Volume | Cause | Impact | Decision | Action | Responsable |
|---|---|---:|---|---|---|---|---|
| REF-001 | qualite riviere `parametre_ref_id` | 0 restant | mappings absents initialement | dashboard/IA qualite | `CLOTURE_C4E_COMPLETE` | 17287 lignes corrigees | C4E |
| REF-002 | qualite nappe `parametre_ref_id` | 1 restant | `NUMEROTATION` legacy | aucun si filtre | `CLOTURE_C4E_COMPLETE` + `LEGACY_IGNORE` | 13269 lignes corrigees | C4E |
| REF-003 | qualite Sebou `parametre_ref_id` | 0 restant | mappings absents initialement | dashboard/IA qualite | `CLOTURE_C4E_COMPLETE` | 31277 lignes corrigees | C4E |
| REF-004 | garde hebdo `parametre_ref_id` | 0 restant | mappings absents + `MO_METAL` legacy | dashboard/IA qualite | `CLOTURE_C4E_COMPLETE` | 539 lignes corrigees dont 11 vers `Mo` | C4E |
| HYD-001 | barrage parametrique | 272652 | legacy multi-colonnes | API/dashboard | `CLOTURE_C4E` | modele `hydro.mesure_barrage_param` | C4E |
| HYD-002 | APPORT | 84820 | `APPORTS_HM3` legacy | unite barrage | `CLOTURE_C4E` | harmonise vers `APPORT` | C4E |

## REF-001 a REF-004

Etat final :

| Controle | Resultat |
|---|---:|
| `parametre_ref_id` null riviere | 0 |
| `parametre_ref_id` null nappe | 1 |
| `parametre_ref_id` null Sebou | 0 |
| `parametre_ref_id` null garde hebdo | 0 |
| reste autorise | `NUMEROTATION` |
| FK orphelines | 0 |

## Barrage

Le barrage utilise le modele parametrique et les unites metier :

| Parametre | Unite |
|---|---|
| `NIVEAU_EAU` | m |
| `VOLUME` | Mm3 |
| `LACHER` | Mm3/j |
| `APPORT` | Mm3/j |
| `TRANSFERT` | Mm3/j |

`hydro.mesure_barrage` reste `LEGACY_READ_ONLY`.
