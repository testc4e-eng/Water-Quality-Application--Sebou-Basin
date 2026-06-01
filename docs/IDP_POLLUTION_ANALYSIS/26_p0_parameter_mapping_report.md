# Rapport mapping parametres P0 - Phase 6

Date execution : 2026-05-18

## Referentiels lus

- `metadata.referentiel_parametre`
- `metadata.mapping_parametre_source`
- `metadata.referentiel_parametre_canonique`

## Codes canoniques existants

| Besoin metier | Code canonique existant | Commentaire |
|---|---|---|
| NH4 | `NH4` | alias canoniques existants : `NH4+`, `NH4+ Spect`, `NH4+ Titri` |
| NO3 | `NO3-` | le referentiel existant n'a pas `NO3`; il expose `NO3-` |
| MES | `MES` | utilise pour `MEST Filtr` en statut a confirmer metier |

## SQL genere et execute

Script : `database/idp_pollution/17_fix_p0_parameter_mappings.sql`

Resultat execution : `INSERT 0 21`.

## Mappings ajoutes

| Valeur source | Cible | Statut decision |
|---|---|---|
| `NH4+` | `NH4` | `VALIDATED_DEV` |
| `NH4+ Spect` | `NH4` | `VALIDATED_DEV` |
| `NH4+  Titri` | `NH4` | `VALIDATED_DEV` |
| `NH4+ Titri` | `NH4` | `VALIDATED_DEV` |
| `NO3-` | `NO3-` | `VALIDATED_DEV` |
| `NO3-_Spectro` | `NO3-` | `TO_VALIDATE` |
| `MEST Filtr` | `MES` | `TO_VALIDATE` |

Chaque mapping est insere pour les tables source IDP mesure marche cadre, globale et le fallback generique `idp_pollution`, avec `source_column='parametre_'` et `source_system='IDP_POLLUTION_2024'`.

## Remarque technique

Le chargement format long a ete durci pour utiliser le mapping exact de la table source et eviter la multiplication par le fallback generique.
