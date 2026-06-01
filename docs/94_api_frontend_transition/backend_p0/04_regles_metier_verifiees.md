# Regles metier verifiees

| Regle | Statut | Preuve |
|---|---|---|
| Ne jamais exposer `FM` | `OK` | Count filtre `FM` = 0 sur les 4 endpoints P0 |
| Ne jamais exposer `F_M_MES` | `OK` | Test automatise ajoute |
| Ne jamais exposer `MO_METAL` | `OK` | Test automatise ajoute |
| `MO` = matieres organiques | `OK` | `MO` expose uniquement dans pollution organique |
| `Mo` = molybdene | `OK` | `Mo` expose dans metaux avec 11 lignes |
| `MO != Mo` | `OK` | `MO` absent de metaux ; `Mo` absent de pollution organique |
| `COULEUR` hors P0 | `OK` | Non whiteliste dans les endpoints P0 |
| `LARGEUR` / `PROFONDEUR` hors P0 | `OK` | Non whitelistes dans les endpoints P0 |
| `T_AIR` / `T_EAU` hors P0 | `OK` | Non whitelistes dans les endpoints P0 |

## Metadata retournee

Chaque endpoint retourne :

- `source_view`
- `source_version`
- `total_count`
- `returned_count`
- `limit`
- `offset`
- `has_more`
- `excluded_parameters`
- `business_rules`
- `elapsed_ms`

## Statut metier

`REGLES_METIER_BACKEND_P0_OK`
