# Decoupage en Taches - SAD Sebou 2026

MODULE : Fondations data et gouvernance

Taches :
- [Data] formaliser la liste des tables, vues et couches critiques de mission 4
- [Data] documenter les identifiants, unites et relations metier minimales
- [Data] verifier les geometries, SRID et attributs des couches SIG de reference
- [Transversal] definir le perimetre autorise du module `raw`


MODULE : Backend API coeur

Taches :
- [Backend] unifier la lecture des routeurs actifs et des contrats API critiques
- [Backend] stabiliser les endpoints `stations`, `barrages`, `layers`, `names`
- [Backend] securiser et encadrer les endpoints `raw`
- [Backend] harmoniser les conventions de reponse JSON / GeoJSON


MODULE : Dashboards climat, hydro et qualite

Taches :
- [Backend] verifier les vues `api.v_measurements_*` et `api.v_quality_*` utilisees
- [Frontend] confirmer les parcours UI reels des dashboards mission 4
- [Frontend] corriger les points de couplage fragile entre composants et API
- [Transversal] valider les indicateurs et filtres prioritaires avec l'equipe


MODULE : Referentiel SIG et cartographie

Taches :
- [SIG] verifier les couches `bassin`, `sous-bassins`, `stations`, `barrages`, `adm_*`
- [SIG] controler la coherence objets spatiaux <-> entites metier
- [Frontend] stabiliser l'affichage carte, filtres et chargement des couches
- [Backend] garantir des sorties GeoJSON homogenes et reutilisables


MODULE : Integration SWAT

Taches :
- [Data] identifier les sources exactes et variables exposees pour SWAT
- [Backend] stabiliser les endpoints SWAT utilises par le frontend
- [Frontend] verifier les ecrans et selections scenario/variable
- [Transversal] documenter les correspondances entre resultats SWAT et objets territoriaux


MODULE : Administration, reporting et tracabilite

Taches :
- [Backend] clarifier les droits admin et les operations decriture autorisees
- [Frontend] consolider le Data Viewer pour les usages reellement necessaires
- [Transversal] definir les sorties de reporting prioritaires mission 4
- [Backend] ajouter une tracabilite minimale des actions sensibles


MODULE : Qualite technique

Taches :
- [Transversal] ajouter des tests de fumee sur les endpoints critiques
- [Frontend] verifier les flux login, dashboard et carte
- [Backend] centraliser la configuration et verifier CORS / secrets / healthcheck
- [Transversal] preparer la base pour roadmap et priorisation



