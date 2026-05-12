# Phase 5 - Controles API dashboard

## Controles SQL

| Controle | Resultat |
|---|---:|
| `hydro.mesure_barrage_param` | 272652 |
| `hydro.mesure_barrage` legacy | 84831 |
| `api.v_hydro_barrage_param_journalier` | 272652 |
| `api.v_hydro_barrage_param_compat_wide` | 84831 |
| `analytics.mv_dashboard_hydrologie_menu` | 816081 |
| lignes barrage dans MV hydrologie | 272652 |
| `m3/s` sur `LACHER` / `APPORTS_HM3` / `TRANSFERT` | 0 |
| unites incoherentes barrage | 0 |

## Distribution API

| Parametre | Metric | Unite | Volume |
|---|---|---|---:|
| `APPORTS_HM3` | `apports_hm3` | `Mm3/j` | 84820 |
| `LACHER` | `lacher_barrage` | `Mm3/j` | 84830 |
| `NIVEAU_EAU` | `niveau_barrage` | `m` | 84831 |
| `TRANSFERT` | `transfert` | `Mm3/j` | 8035 |
| `VOLUME` | `volume_barrage` | `Mm3` | 10136 |

## Distribution dashboard

| Variable | Unite | Volume |
|---|---|---:|
| `apports_hm3` | `Mm3/j` | 84820 |
| `lacher_barrage` | `Mm3/j` | 84830 |
| `niveau_barrage` | `m` | 84831 |
| `transfert` | `Mm3/j` | 8035 |
| `volume_barrage` | `Mm3` | 10136 |

## Controles applicatifs

| Controle | Resultat |
|---|---|
| Compilation routeurs Python | OK |
| Build frontend | OK |
| Table legacy barrage modifiee | non |
| Tables metier autres modifiees | non |
| `lacher_m3s` expose comme flux metier | non |
