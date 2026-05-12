# Anomalies detectees

- `run_id` : `f0f2a858-1c90-4b15-a6af-cc172bece071`

| Motif | Nombre |
|---|---:|
| MISSING_VALUE | 383756 |
| NON_PARSEABLE | 15971 |

## Note de perimetre

- `2824` lignes du scope GEO valide ne sont pas entrees dans `e0_mesures_preparees` ou `e0_mesures_quarantaine` car elles correspondent a des tables de support geo sans mapping mesure actif : `raw_stations_abhs` (`390`), `raw_sources_abhs` (`135`), `raw_huileries_abhs` (`319`), `raw_profils_stations` (`1980`).
- Cet ecart n'affecte pas le `delta global`, calcule sur le volume candidat mesure uniquement.
