# Optimisation Performance - SAD Sebou 2026 Mission 4

RESUME GLOBAL
- niveau de performance estime : moyen
- probleme principal observe : plusieurs endpoints manipulent potentiellement trop de donnees ou construisent des payloads lourds a la volee
- impact probable : lenteurs sur carte, dashboards et administration data

POINTS DE RALENTISSEMENT IDENTIFIES
- generation GeoJSON complete en base avec `jsonb_agg` sur des couches potentiellement volumineuses
- endpoint `raw/tables` inspectant toutes les tables puis testant leur geometrie individuellement
- lectures `SELECT *` sur `raw` et certaines routes backend
- agregations hydrologiques et qualite calculees a la demande sur vues non documentees

CAUSES TECHNIQUES PROBABLES
- charges SQL et GeoJSON construites en une seule reponse
- absence visible de cache ou pagination adaptee pour certaines routes
- absence visible de strategie d'indexation documentee cote couches et vues
- client frontend volumineux qui centralise beaucoup de flux et peut compliquer l'optimisation fine

OPTIMISATIONS RECOMMANDEES
- [Priorite haute] paginer ou filtrer davantage les couches et endpoints `raw` les plus lourds
- [Priorite haute] profiler les requetes SIG critiques et verifier index spatiaux / attributaires
- [Priorite haute] limiter les colonnes retournees par `raw` et eviter `SELECT *` quand possible
- [Priorite moyenne] separer les reponses "liste d'objets" et "details / series temporelles"
- [Priorite moyenne] mettre en cache certaines nomenclatures et couches peu changeantes
- [Priorite basse] decouper le client frontend API par domaine pour mieux cibler les optimisations

POINTS DE VIGILANCE
- le diagnostic de performance reste partiellement theorique sans `EXPLAIN ANALYZE` ni mesures reelles
- attention a ne pas casser les contrats frontend actuels en optimisant trop vite
- toute optimisation GeoJSON doit conserver la coherence SRID et la structure des proprietes

RECOMMANDATION FINALE
- action immediate : profiler les endpoints `layers`, `raw/tables`, `raw/.../rows`, `hydro/timeseries`, `quality/chart`
- action secondaire : verifier indexation, volumetrie et taille des payloads renvoyes
- action optionnelle : introduire un cache leger pour les routes de reference stables
