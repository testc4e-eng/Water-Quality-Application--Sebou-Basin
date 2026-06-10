# Recommandation Sources Dashboard Qualité

| Bloc dashboard | Source recommandée | Pourquoi | Limites | Décision métier |
| -------------- | ------------------ | -------- | ------- | --------------- |
| Stations temps réel / sentinelles | `qualite.mesure_qualite_sebou` + `api.v_station_dimension` | Contient les données des 6 IRE validés par l'équipe métier, avec traçabilité et qualité. | Nombre de stations limité actuellement à 6. | Valider le basculement définitif |
| Historique rivière / source | `qualite.mesure_qualite_riviere` | Volume historique majeur, couvre l'ensemble du réseau hydrographique. | Peut inclure du bruit si les stations ne sont pas filtrées. | Valider |
| Historique barrage garde | `qualite.suivi_qualite_barrage_garde_hebdo` | Les barrages de garde ont un suivi hebdomadaire spécifique. | Données ultra-ciblées sur un seul barrage. | Valider la création d'un onglet séparé |
| Nappes | `qualite.mesure_qualite_nappe` | Données souterraines, dynamiques physico-chimiques distinctes. | Ne pas mélanger avec la surface. | Valider un dashboard dédié |
| Paramètres réglementaires | `metadata.qualite_parametre_reglementaire` | Référentiel de vérité pour savoir si un paramètre est classifiable (Bon/Moyen). | Aucun | Approuvé |
| Pollution (IDP, Rejets) | `qualite.source_pollution_*` | Mêle les eaux usées/rejets, fausserait l'état écologique du milieu naturel. | N/A | Exclure fermement |
