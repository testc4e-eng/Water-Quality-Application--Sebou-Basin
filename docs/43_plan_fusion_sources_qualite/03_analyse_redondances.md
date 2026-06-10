# Analyse des Redondances

Lorsqu'on croise `mesure_qualite_sebou` (les sentinelles) et `mesure_qualite_riviere` (l'historique), d'énormes redondances sont détectées.

| Type redondance | Tables concernées | Volume | Exemple | Recommandation |
| --------------- | ----------------- | -----: | ------- | -------------- |
| **Doublon exact** | `riviere` vs `sebou` | Élevé (~8k) | IRE 3695/8 le 2024-05-12 : DBO5 = 12 mg/L dans les deux tables. | Supprimer de la table cible unifiée (garder `sebou` comme maître pour ces dates). |
| **Doublon métier fort** | `riviere` vs `sebou` | Moyen | IRE 1541/15, même date, même paramètre, même valeur, mais QA flags différents. | Envoyer en `staging.qualite_mesures_redondantes` pour arbitrage. Priorité à la donnée la plus qualifiée (`sebou`). |
| **Doublon métier probable** | `riviere` vs `sebou` | Faible | Même IRE, date et param, mais valeur = 12.0 vs 12.004. | Envoyer en `staging.qualite_mesures_conflits` pour arbitrage par l'équipe métier. |
| **Redondance fonctionnelle** | `garde` vs `barrage` | Inconnu | Mesures du barrage de garde présentes potentiellement sous un autre IRE dans `mesure_qualite_barrage`. | Exiger un mapping explicite. Conserver le support fonctionnel `BARRAGE_GARDE` séparé. |
