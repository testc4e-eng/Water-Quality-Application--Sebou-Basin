# SAD Dashboard Implementation

## Objet

Ce dossier prépare l'implémentation convergente de la nouvelle génération de dashboards SAD.

Le principe est :

- réutiliser l'existant validé
- fusionner les écrans redondants
- créer uniquement ce qui manque pour servir la décision

## Règles

- ne pas rouvrir les chantiers hydrauliques clôturés
- ne pas réimplémenter les endpoints propagation MVP V1
- conserver les dashboards utiles déjà actifs
- séparer strictement `AIR_TEMPERATURE` et `WATER_TEMPERATURE`

## Livrables

- [01_phase_1_accueil_sad.md](./01_phase_1_accueil_sad.md)
- [02_phase_2_carte_metier.md](./02_phase_2_carte_metier.md)
- [03_phase_3_qualite_des_eaux.md](./03_phase_3_qualite_des_eaux.md)
- [04_phase_4_pollution.md](./04_phase_4_pollution.md)
- [05_phase_5_analyses.md](./05_phase_5_analyses.md)
- [06_phase_6_expert.md](./06_phase_6_expert.md)
- [07_phase_7_administration.md](./07_phase_7_administration.md)
- [08_backlog_p0_p1_p2.md](./08_backlog_p0_p1_p2.md)
- [09_risques_et_dependances.md](./09_risques_et_dependances.md)
- [10_decision_architecture_finale.md](./10_decision_architecture_finale.md)

## Point de départ

- stratégie validée : `GO_DECISION_FIRST_SAD`
- réseau hydrologique : `HYDRO_NETWORK_VALIDATED`
- backend propagation : `BACKEND_MVP_V1_READY`
- écrans à faire converger en priorité :
  - `/dashboard-carto-metier`
  - `/dashboard-qualite-reglementaire`
  - `/dashboard-pollution`
