# Matrice de priorite spatiale

## Regle generale

La geometrie officielle d'un site maitre est choisie selon la priorite source, la validite geometrique, la precision attendue et la validation metier. Une source de priorite basse ne remplace jamais une source de priorite haute sans decision d'arbitrage.

| Priorite | Source | Confiance | Precision attendue | Role | Usage autorise | Usage interdit | Fusion |
|---:|---|---|---|---|---|---|---|
| 1 | infrastructures officielles validees `infra.step`, `infra.stm`, `infra.mine`, `infra.huilerie`, `infra.decharge`, `infra.rejet_*`, `infra.fosses_septiques_abhs` | haute si geom valide | variable, a normaliser SRID | reference | geometrie officielle apres controle | ecraser IDP sans trace | autorisee avec arbitrage si conflit |
| 2 | stations/points qualite valides | haute | point mesure | reference qualite | rattachement mesure/site | devenir source pollution sans typologie | autorisee |
| 3 | `infra.*_inventaire_pollution` | moyenne-haute | point 26191 | esclave/reference contexte | rattachement source pollution | remplacer infra officielle seule | autorisee sous score |
| 4 | `qualite.source_pollution_prelevement` | moyenne | point 26191 | observatoire | relier mesures et pollution | creer site maitre sans controle si proche conflit | autorisee sous score |
| 5 | IDP mesures `staging.raw_idp_mesures_*` | moyenne | point 26191/4326 | esclave mesure | rattacher point mesure | dedoublonner automatiquement | proposition uniquement |
| 6 | IDP inventaire `staging.raw_idp_src_*` | moyenne | point 26191/4326 | esclave inventaire | enrichir typologie/source | remplacer source officielle | proposition uniquement |
| 7 | vues `api.*` | derivee | depend source | exposition | API et dashboard | source de verite | non |
| 8 | couches temporaires/profiling | faible | variable | audit | controle QA | production | non |
| 9 | geometries reconstruites | faible | estimee | secours | affichage temporaire marque | calcul officiel | arbitrage obligatoire |

## Conditions d'utilisation

- Une geometrie SRID 0 doit etre transformee en 26191 seulement apres confirmation du CRS source.
- Une geometrie nulle ne peut pas creer un site maitre actif.
- Un doublon exact n'est pas supprime : il est relie et arbitre.
- Une distance <= 5 m peut etre `AUTO_MATCH_CANDIDATE` si nom/commune/type ne divergent pas.
- Une distance <= 25 m avec divergence de nom, type ou commune est `MANUAL_REVIEW_REQUIRED`.
