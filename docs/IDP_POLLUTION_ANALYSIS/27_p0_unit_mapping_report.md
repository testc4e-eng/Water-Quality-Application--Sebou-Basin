# Rapport mapping unites P0 - Phase 6

Date execution : 2026-05-18

## Source de decision

Les imports IDP DEV ne portent pas de colonne unite exploitable dans le pivot long courant. Les unites ont donc ete reprises depuis le referentiel canonique existant `metadata.referentiel_parametre_canonique`, sans creer de referentiel parallele.

## SQL genere et execute

Script : `database/idp_pollution/18_fix_p0_unit_mappings.sql`

Resultat execution : `UPDATE 5`.

## Unites appliquees

| Code canonique | Unite appliquee | Statut |
|---|---|---|
| `DBO5` | `mg/L` | `VALIDATED_DEV` |
| `DCO` | `mg/L` | `VALIDATED_DEV` |
| `MES` | `mg/L` | `VALIDATED_DEV` |
| `NH4` | `mg/L` | `VALIDATED_DEV` |
| `NO3-` | `mg/L` | `VALIDATED_DEV` |

## Garde-fous

- Le script met a jour uniquement les lignes `metadata.referentiel_parametre` actives et sans unite existante.
- Aucune unite existante n'est ecrasee.
- Les unites restent a confirmer metier avant pre-production, car la source SHP ne fournit pas d'unite brute explicite dans le flux DEV.
