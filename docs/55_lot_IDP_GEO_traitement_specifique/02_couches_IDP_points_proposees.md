# Couches IDP points proposees

### idp_qualite_globale_points

- table source : `staging.raw_idp_2024_mesures_qualite_globale`
- geometrie proposee : `POINT`
- SRID source probable : `26191` (coordonnees metriques coherentes avec les couches inventaire pollution et le reseau hydrographique)
- attributs bruts conserves : oui
- lignes sans X/Y : `275` a exclure ou signaler en QA
- decision : couche dediee, sans insertion dans `qualite.*`

### idp_qualite_marche_cadre_points

- table source : `staging.raw_idp_2024_mesures_qualite_marche_cadre`
- geometrie proposee : `POINT`
- SRID source probable : `26191` (coordonnees metriques coherentes avec les couches inventaire pollution et le reseau hydrographique)
- attributs bruts conserves : oui
- lignes sans X/Y : `0` a exclure ou signaler en QA
- decision : couche dediee, sans insertion dans `qualite.*`

### idp_src_pollution_globale_points

- table source : `staging.raw_idp_2024_src_pollution_globale`
- geometrie proposee : `POINT`
- SRID source probable : `26191` (coordonnees metriques coherentes avec les couches inventaire pollution et le reseau hydrographique)
- attributs bruts conserves : oui
- lignes sans X/Y : `36` a exclure ou signaler en QA
- decision : couche dediee, sans insertion dans `qualite.*`

### idp_src_pollution_marche_cadre_points

- table source : `staging.raw_idp_2024_src_pollution_marche_cadre`
- geometrie proposee : `POINT`
- SRID source probable : `26191` (coordonnees metriques coherentes avec les couches inventaire pollution et le reseau hydrographique)
- attributs bruts conserves : oui
- lignes sans X/Y : `0` a exclure ou signaler en QA
- decision : couche dediee, sans insertion dans `qualite.*`
