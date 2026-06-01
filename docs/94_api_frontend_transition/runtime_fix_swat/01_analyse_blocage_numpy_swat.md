# Analyse blocage numpy / SWAT

| Élément | Valeur |
|---|---|
| Module fautif initial | `app.api.v1.swat_analysis` |
| Import fautif initial | `import numpy as np` au top-level |
| Erreur runtime | `Windows fatal exception: code 0xc06d007f` dans `numpy.__init__.py`, fonction `blas_fpe_check` |
| Impact initial | Import `app.main` impossible ; `/docs` et `/openapi.json` indisponibles |
| Cause probable | Incompatibilité runtime scientifique Windows / BLAS / numpy dans l'environnement Python courant |
| Solution retenue | Supprimer `numpy` du top-level SWAT analysis et rendre le router SWAT analysis optionnel |

## Découverte complémentaire

Après retrait de l'import top-level `numpy` de `swat_analysis`, le même crash natif est apparu via :

| Élément | Valeur |
|---|---|
| Module fautif complémentaire | `app.routers.ingestion` |
| Import fautif complémentaire | services ingestion important `pandas`, qui importe `numpy` |
| Impact | Import `app.main` encore impossible si ingestion est importé eager |
| Décision | Rendre l'API ingestion optionnelle et désactivée par défaut, car ingestion V1 est un chantier futur |

## Pourquoi `try/except` seul ne suffit pas

Le crash observé est natif et termine le processus Python. Il ne s'agit pas d'une exception Python récupérable dans tous les cas. La stabilisation doit donc éviter l'import des modules scientifiques au démarrage global.
