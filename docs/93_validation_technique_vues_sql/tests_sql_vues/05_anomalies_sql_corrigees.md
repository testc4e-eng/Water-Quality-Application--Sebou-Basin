# Anomalies SQL corrigees

| Vue | Probleme | Correction appliquee dans SQL propose |
|---|---|---|
| `api.v_qualite_base_multi_support` | Le code expose etait `parametre_qualite`, ce qui ne respecte pas les corrections FK legacy comme `MO_METAL -> Mo` | Remplacement par `COALESCE(c.code_parametre, q.parametre_qualite)` |
| `api.v_qualite_base_multi_support` | La jointure referentiel ne fonctionnait que par code source | Jointure corrigee : `c.parametre_ref_id = q.parametre_ref_id OR (q.parametre_ref_id IS NULL AND c.code_parametre = q.parametre_qualite)` |
| `api.v_qualite_metaux` | `Mo` apparaissait a 0 ligne avant correction | Correction via code canonique expose depuis FK ; `Mo` = 11 lignes |
| `api.v_qualite_pollution_organique` | Risque d'exposer `MO_METAL` ou de confondre `MO`/`Mo` | `MO_METAL` n'est plus expose ; `MO` reste organique, `Mo` reste metal |

## Controle apres correction

| Test | Resultat |
|---|---|
| `Mo` dans `api.v_qualite_metaux` | 11 |
| `MO` dans `api.v_qualite_metaux` | 0 |
| `MO_METAL` expose | 0 |
| `FM` expose | 0 |
| `F_M_MES` expose | 0 |
