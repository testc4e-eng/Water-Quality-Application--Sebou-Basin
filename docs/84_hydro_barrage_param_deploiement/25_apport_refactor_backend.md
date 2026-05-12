# Harmonisation APPORT - Backend

## Changements

| Composant | Changement |
|---|---|
| `metadata.referentiel_parametre_canonique` | `code_parametre` harmonise en `APPORT`, alias `APPORTS_HM3` conserve. |
| `hydro.mesure_barrage_param` | 84820 lignes renommees en `APPORT`, valeurs conservees. |
| `target_business_key_hash` | regenere avec le code `APPORT`. |
| `api.v_hydro_barrage_param_journalier` | expose `metric = apport`. |
| `api.v_hydro_barrage_param_compat_wide` | expose `apport` et conserve `apports_hm3` comme alias de compatibilite. |
| `analytics.mv_dashboard_hydrologie_menu` | variable dashboard `apport`. |
| `backend/app/routers/observatory.py` | accepte `apport` et `apports_hm3`, mappe les deux vers `APPORT`. |
| `backend/app/routers/analytics.py` | ordre dashboard ajoute pour `apport`. |

## Compatibilite API

Les anciens appels `metric=apports_hm3` restent acceptes et sont resolus vers `APPORT`.

## Controle

Compilation Python :

```powershell
python -m py_compile backend\app\routers\observatory.py backend\app\routers\entities.py backend\app\routers\analytics.py
```

Resultat : OK.
