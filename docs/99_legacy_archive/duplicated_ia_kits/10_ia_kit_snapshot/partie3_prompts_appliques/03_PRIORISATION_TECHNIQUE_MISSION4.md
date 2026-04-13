# Priorisation Technique - SAD Sebou 2026

PRIORITE 1 - Elements critiques

Modules concernes :
- fondations data et gouvernance
- backend API coeur
- referentiel SIG et cartographie

Justification :
ces elements debloquent tout le reste. Sans couches SIG fiables, ids coherents et endpoints stables, ni les dashboards ni SWAT ne seront credibles.

Taches prioritaires :
- formaliser les tables, vues et couches critiques mission 4
- verifier geometries, SRID, ids et attributs des couches principales
- stabiliser `stations`, `barrages`, `layers`, `names`
- harmoniser les sorties JSON / GeoJSON


PRIORITE 2 - Composants necessaires au MVP

Modules concernes :
- dashboards climat, hydro et qualite
- integration SWAT

Justification :
ces modules portent la valeur metier visible du SAD. Ils doivent reposer sur le socle SIG/data deja fiabilise.

Taches :
- verifier les vues `api.v_measurements_*` et `api.v_quality_*`
- consolider les parcours dashboard les plus utilises
- stabiliser les endpoints SWAT reellement consommes
- valider la coherence territoire / scenario / variable


PRIORITE 3 - Securisation et gouvernance

Modules concernes :
- administration, reporting et tracabilite

Justification :
ces elements ne debloquent pas le coeur fonctionnel, mais ils reduisent fortement les risques de maintenance, d'erreur et de mauvaise exploitation.

Taches :
- encadrer le module `raw`
- clarifier les droits admin et les operations decriture
- definir les sorties de reporting prioritaires
- ajouter une tracabilite minimale


PRIORITE 4 - Qualite technique et industrialisation

Modules concernes :
- qualite technique

Justification :
important pour la robustesse, mais a lancer une fois le coeur mission 4 stabilise.

Taches :
- ajouter des tests de fumee API/frontend
- verifier build et run standardises
- preparer une industrialisation legere
- documenter le runbook minimum
