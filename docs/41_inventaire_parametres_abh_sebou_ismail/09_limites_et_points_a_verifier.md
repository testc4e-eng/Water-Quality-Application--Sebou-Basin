# Limites et points à vérifier — abh_sebou_ismail

## Limites
- la base ne contient pas de schémas métiers séparés ; tout le périmètre utile est dans `public`
- les vues `view_*` ont été exclues du principal pour éviter de mélanger données sources et objets de reporting
- les colonnes `parametre` des tables `idp_2024_src_pollution_*` contiennent des types de points (`Forage`, `Puits`, `Rejet`, etc.) et non des paramètres physico-chimiques
- plusieurs unités ne sont disponibles que dans `types_mesures` ; quand aucune unité fiable n'est trouvée, la valeur reste `à confirmer`

## Faux paramètres exclus
| table | valeur | motif |
|---|---|---|
| idp_2024_src_pollution_globale | A-B-C-D | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | A-B-C-D-H-E | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | F-G-D | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | Forage | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | Oued | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | Puits | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | Rejet | colonne parametre contenant un type de point ou de source, pas un paramètre métier |
| idp_2024_src_pollution_globale | Source | colonne parametre contenant un type de point ou de source, pas un paramètre métier |

## Candidats faibles non retenus
| table | parametre_observe | motif |
|---|---|---|
| idp_2024_src_pollution_globale | eh_mv | colonne analytique sans valeur non nulle |
| idp_2024_src_pollution_globale | sat_prc | colonne analytique sans valeur non nulle |
| idp_2024_src_pollution_marche_cadre | eh_mv | colonne analytique sans valeur non nulle |
| idp_2024_src_pollution_marche_cadre | sat_prc | colonne analytique sans valeur non nulle |
| mesures_temperatures_jr | temperature_jr | colonne analytique sans valeur non nulle |
| sous_bassin_sebou | superficie_km2 | colonne analytique sans valeur non nulle |
