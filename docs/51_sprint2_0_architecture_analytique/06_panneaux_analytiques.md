# 6. Panneaux Analytiques (V1 du Sprint 2)

Les panneaux ne seront pas des composants "flottants libres" (déplaçables/redimensionnables) dès le premier jour, pour limiter la complexité initiale. (Reporté au Sprint 2.5 si trop lourd).

Cependant, l'architecture du `AnalysisWorkspace` est conçue pour supporter cette configuration (tableau `panels`).

Pour le Sprint 2, nous implémenterons 3 types de panneaux ancrés / superposables :

1. **MultiSeriesChartPanel**
   - Composant central qui rend le graphique Recharts.
   - Fonctions : masquer/afficher une série, changer le type de courbe (Ligne, Barres), assignation automatique des axes.
2. **SeriesTablePanel**
   - Tableau synchronisé des données brutes.
   - Fonctions : export CSV simple.
3. **WorkspaceSummaryPanel**
   - Vue de gestion : liste des séries actuellement chargées.
   - Fonctions : Ajouter une série (déclenche sélection carte), Retirer une série, Afficher les avertissements.
