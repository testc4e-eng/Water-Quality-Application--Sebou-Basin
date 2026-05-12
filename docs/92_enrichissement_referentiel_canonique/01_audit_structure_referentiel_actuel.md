# Audit structure referentiel actuel

## Colonnes existantes

| Colonne | Type | Nullable | Role |
|---|---|---|---|
| `parametre_ref_id` | uuid | non | PK technique stable |
| `code_parametre` | text | non | code canonique unique |
| `nom_parametre` | text | non | nom metier |
| `type_metier` | text | non | type general |
| `aliases` | jsonb | non | variantes, actuellement peu alimentees |
| `domaine` | text | non | domaine principal |
| `sous_domaine` | text | oui | sous-domaine |
| `famille` | text | oui | famille analytique |
| `unite_reference` | text | oui | unite canonique |
| `type_geo_supporte` | text | non | support GEO |
| `table_cible` | text | oui | table cible principale |
| `source_origine` | text | non | origine |
| `type_source` | text | non | origine technique/metier |
| `categorie_dashboard` | text | oui | categorie dashboard |
| `seuil_min` | numeric | oui | seuil bas |
| `seuil_max` | numeric | oui | seuil haut |
| `norme` | text | oui | norme |
| `scenario_compatible` | boolean | non | compatibilite scenario |
| `description_metier` | text | oui | description |
| `statut` | text | non | statut actif/inactif |
| `date_creation` | timestamptz | non | date creation |

## Contraintes et index

| Objet | Type | Definition |
|---|---|---|
| `referentiel_parametre_canonique_pkey` | PK | `parametre_ref_id` |
| `referentiel_parametre_canonique_code_parametre_key` | UNIQUE | `code_parametre` |
| `chk_ref_param_canonique_aliases_array` | CHECK | `aliases` doit etre un tableau JSON |
| `idx_ref_param_canonique_domaine` | INDEX | `(domaine, sous_domaine)` |
| `idx_ref_param_canonique_geo` | INDEX | `type_geo_supporte` |
| `idx_ref_param_canonique_type_metier` | INDEX | `type_metier` |

## Volumetrie et completude

| Indicateur | Volume |
|---|---:|
| total parametres | 92 |
| actifs | 92 |
| code manquant | 0 |
| nom manquant | 0 |
| unite manquante | 59 |
| domaine manquant | 0 |
| sous-domaine manquant | 87 |
| famille manquante | 87 |
| support GEO manquant | 0 |
| table cible manquante | 87 |
| aliases vides | 87 |
| description manquante | 0 |

## Par domaine

| Domaine | Parametres | Unite manquante | Alias vides |
|---|---:|---:|---:|
| `qualite` | 81 | 59 | 81 |
| `hydro` | 6 | 0 | 1 |
| `meteo` | 5 | 0 | 5 |

## Forces

- PK stable UUID.
- Unicite du code canonique.
- Champ `aliases` JSONB deja present.
- Support multi-domaine deja initie.
- Champs utiles pour dashboards et scenarios deja prevus.

## Limites

- Alias qualite quasiment absents.
- Taxonomie qualite trop plate.
- Sous-domaines et familles non renseignes.
- Unites qualite incompletes.
- Table cible absente pour la majorite des parametres.
- Pas de table secondaire d'alias historisee.
- Pas de niveau de confiance ni statut d'arbitrage.

