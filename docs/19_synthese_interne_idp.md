# Ingénierie - Synthèse Interne (Lot 4A-4 IDP)

## 1. Topologie de l'Ingestion IDP Future (Pas de Dry-Run lancé)
Contrairement au Lot 4A-2 qui jouait sur de l'O(1) vers `mesure_qualite_riviere`, l'IDP est un monstre multicéphale.

### A. La Gestion Topographique Orpheline
Nos scripts cibleront : `qualite.source_pollution_mesure_param`.
Chaque enregistrement doit se greffer à ID dans `source_pollution_prelevement`. Si l'ABH n'a pas migré cette hiérarchie, nous subirons 100% de `WOULD_CONFLICT` d'identité spatiale.

### B. Flags QA d'Action
- `qa_flag_param_unmapped` : Toujours pertinent à utiliser si l'IDP emploie des noms de labo douteux.
- `WOULD_SKIP` : Par défaut sur tout paramètre NULL.
- *Nouvelle Alerte* : `qa_flag_missing_source` pour les rejets introuvables en production.

