# 7. Seuils Réglementaires et Cartographie

L'intégration des seuils réglementaires (Palettes marocaines) sur la carte s'appuiera sur les données du schéma `metadata`.

## Existant 
* **177 seuils actifs** configurés dans `metadata.qualite_seuil_reglementaire`.
* **5 classes réglementaires** définies dans `metadata.qualite_classe_reglementaire` (Bleu, Vert, Jaune, Orange, Rouge).
* L'API qualité existante (`/quality/thresholds`) expose déjà ces informations.

## Intégration Cartographique Future (V2)
* Lors du choix du paramètre "pH" dans le domaine "Qualité", l'endpoint `/availability` signalera `has_thresholds: true`.
* La carte pourra alors requêter `/api/v1/quality/classify` (ou une vue matérialisée SIG) pour colorer dynamiquement les stations selon leur dernière mesure.
* **Risque actuel** : La classification "à la volée" sur 117k mesures est très coûteuse. Il faudra créer une vue matérialisée `api.mv_qualite_derniere_classe_station`.
