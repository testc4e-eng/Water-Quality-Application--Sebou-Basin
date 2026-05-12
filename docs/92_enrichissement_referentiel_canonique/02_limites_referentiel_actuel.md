# Limites referentiel actuel

## Limites principales

| Limite | Impact |
|---|---|
| alias absents | mapping automatique impossible pour les codes historiques |
| unites manquantes | QA et dashboards incomplets |
| sous-domaines/familles manquants | classification IA faible |
| microbiologie absente | parametres comme `GERME_22`, `VIBRIO`, `CLOSTRI` non mappables |
| organoleptique absent | `ODEUR`, `SAVEUR` non representes |
| parametres historiques non structures | variantes type `O2_DISSOUS`, `H_G`, `HG_MERCURE` non conservees |
| absence taxonomie fine | confusion physicochimie / microbiologie / hydrologie / pollution |
| absence gouvernance alias | risque de mapping approximatif non audite |
| absence statut validation | impossible de distinguer sûr/probable/ambigu dans le referentiel |

## Dette technique

- `type_metier = qualite_eau` trop large.
- `type_geo_supporte` stocke plusieurs supports dans un champ texte.
- Pas d'index GIN sur `aliases`.
- Pas de table `referentiel_parametre_alias`.
- Pas de version de referentiel.
- Pas de notion `critique_dashboard`, `critique_ia`, `ingestion_required`.

## Risque actuel

Sans enrichissement, les corrections REF-001 a REF-004 restent fragiles et les futures ingestions devront reconstituer des mappings ad hoc.

