# Roadmap Technique - SAD Sebou 2026

PHASE 1 : Stabilisation du socle mission 4

Modules concernes :
- fondations data et gouvernance
- backend API coeur
- referentiel SIG et cartographie

Dependances majeures :
- acces stable a la base metier
- liste des couches et flux critiques confirmee

Taches :
- formaliser les sources critiques mission 4
- verifier couches SIG, geometries, ids et referentiels
- stabiliser les endpoints coeur `stations`, `barrages`, `layers`, `names`
- harmoniser les sorties JSON / GeoJSON


PHASE 2 : Consolidation des dashboards metier

Modules concernes :
- dashboards climat, hydro et qualite
- backend API coeur

Dependances majeures :
- phase 1 stabilisee
- vues `api.*` qualifiees

Taches :
- verifier les vues climat/hydro/qualite
- consolider les flux frontend -> API -> vues metier
- valider les KPI, filtres et parcours prioritaires
- corriger les points de couplage fragile


PHASE 3 : Integration SWAT et coherence territoriale

Modules concernes :
- integration SWAT
- referentiel SIG et cartographie

Dependances majeures :
- couches territoriales stabilisees
- parcours dashboards deja fiables

Taches :
- identifier et documenter les sources SWAT reellement utilisees
- stabiliser les endpoints SWAT
- verifier la coherence scenario / variable / territoire
- consolider les vues frontend de comparaison et analyse


PHASE 4 : Administration, reporting et securisation

Modules concernes :
- administration, reporting et tracabilite
- qualite technique

Dependances majeures :
- flux coeur mission 4 deja stables
- droits admin clarifies

Taches :
- encadrer le module `raw`
- definir les sorties de reporting prioritaires
- ajouter une tracabilite minimale
- mettre en place les tests de fumee critiques


PHASE 5 : Industrialisation legere

Modules concernes :
- qualite technique
- transversal

Dependances majeures :
- MVP mission 4 fonctionnel

Taches :
- renforcer tests et controles de non-regression
- clarifier la structure backend cible
- preparer CI/CD ou au minimum build/verification standardisee
- documenter le runbook minimum d'exploitation
