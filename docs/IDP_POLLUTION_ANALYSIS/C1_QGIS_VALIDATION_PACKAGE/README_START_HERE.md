# Package QGIS C1 - Validation et Arbitrage IDP

Ce package sert a faire la validation cartographique finale des cas IDP restants avant preproduction.

Perimetre :

- `TRUE_AMBIGUOUS` : 3 cas de conflit reel.
- `ORPHAN_REVIEW` : 102 cas sans rattachement fiable.

Objectif :

- ouvrir le projet QGIS ;
- examiner les cas ;
- remplir uniquement le fichier `final_review_decision_template.csv` ;
- verifier le fichier avec les outils fournis.

Contenu du package :

- `01_WORKSPACE/`
- `02_GUIDES/`
- `03_TOOLS/`
- `final_review_decision_template.csv`
- `final_review_decision_template_enriched.csv`

Ordre recommande :

1. Lire `02_GUIDES/01_METHODE_VALIDATION.md`
2. Ouvrir `01_WORKSPACE/final_human_review.qgz`
3. Remplir de preference `final_review_decision_template_enriched.csv`
4. Lancer `03_TOOLS/01_compter_cas_restants.ps1`
5. Lancer `03_TOOLS/02_verifier_csv_dry_run.ps1`

Regle absolue :

- ne modifier ni geometrie, ni identifiant, ni nom de couche ;
- ne remplir que `reviewer_decision` et `reviewer_comment`.

Note utile :

- la version `enriched` ajoute `wkt_geom`, `x`, `y`, `fid` et `geometry_status` pour faciliter le zoom et la verification visuelle ;
- certains cas peuvent rester sans geometrie si la source exportee ne la fournit pas.
