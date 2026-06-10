# Recommandation Finale

Suite à cet audit (Phase 1 / Read-Only), voici les décisions d'architecture recommandées pour la fusion des 4 sources Qualité de l'eau.

| Décision | Recommandation | Détail |
| -------- | -------------- | ------ |
| **Fusion physique immédiate** | **NON** | Les risques de doublonnage et de perte de données historiques sont trop élevés. La base contient de nombreux paramètres non mappés et des incohérences de noms de stations. |
| **Vue unifiée progressive** | **OUI** | Phase D du plan : créer une vue unifiée qui empile (UNION ALL) les données nettoyées, en priorisant `sebou` sur `riviere`. |
| **Suppression directe redondances** | **NON** | Les redondances métier fortes doivent transiter par le `staging` pour audit visuel par le métier avant toute purge physique. |
| **Staging/quarantine** | **OUI** | Obligatoire pour intercepter les anomalies (paramètres inconnus, stations orphelines, valeurs négatives). |
| **Maintien anciennes tables temporairement** | **OUI** | Maintenir les 4 tables sources pendant 3 mois après la mise en production de la table `qualite.mesure_qualite_unifiee` pour assurer le fallback. |
| **Bascule API progressive** | **OUI** | Modifier les routeurs (`backend/app/routers/quality.py`) un par un pour taper sur la vue unifiée et observer le rendu sur le Dashboard Qualité. |
