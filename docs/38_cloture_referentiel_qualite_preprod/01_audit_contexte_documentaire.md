# Audit contexte documentaire

## Documents lus
| Document | Statut |
|---|---|
| docs/00_source_of_truth/00_documents_prioritaires.md | Lu |
| docs/04_etat_avancement/00_project_global_status.md | Lu |
| docs/01_contexte_projet/01_mvp_scope.md | Lu |
| docs/05_blocages_et_risques/00_problemes_racines.md | Lu |
| docs/02_gouvernance_et_decisions/00_registre_decisions.md | Lu |
| docs/07_donnees_et_referentiels/00_data_landscape.md | Lu |
| docs/00_SOURCE_OF_TRUTH_MASTER.md | Lu |
| docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md | Lu |
| docs/03_ai_knowledge_base/api_for_agents.md | Lu |


## Contraintes retenues
- La base réelle `abh_sad` prime sur les anciennes documentations.
- Le référentiel réglementaire qualité était documenté comme `DEV_PARTIAL` avant contrôle réel.
- Les endpoints DEV `/api/v1/quality/thresholds`, `/api/v1/quality/classify` et `/api/v1/quality/regulatory-status` existent.
- Les grilles simplifiées restent `DOCUMENTAIRE_NON_OPERATIONNEL` et ne doivent pas alimenter le moteur SAD.
- Le Tableau n°1 officiel eaux de surface est le seul périmètre opérationnel.
- `MO` et `Mo` doivent rester distincts ; aucune normalisation globale de casse n'est acceptable.
- Les paramètres sans seuil réglementaire explicite restent stockables/visualisables mais non classifiables.

## Ecart documentaire principal
Les documents mentionnaient un risque de tables réglementaires vides. Le contrôle réel de `abh_sad` montre que le référentiel DEV est chargé : 41 paramètres, 205 seuils, 1 version active. Le statut doit donc évoluer de `DEV_PARTIAL` vers `GO_PREPROD_CONDITIONNEL`, sous réserve de validation du périmètre actif.
