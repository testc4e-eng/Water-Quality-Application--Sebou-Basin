# 9. Limites et Endpoints Reportés

Pour limiter l'envergure du Sprint 2 et se concentrer sur l'affichage cartographique interactif "Multi-Series", certains concepts avancés sont explicitement **reportés** aux sprints ultérieurs.

## Endpoints Exclus du Sprint 2
- `POST /api/v1/analysis/compare` : Le calcul mathématique de corrélation (P-value, R²) en base de données ou Pandas n'est pas ciblé. La comparaison reste visuelle.
- `POST /api/v1/analysis/statistics` : Les statistiques croisées avancées (PCA, percentiles complexes) sont reportées. Les KPIs basiques (Min/Max/Avg) sont calculés côté frontend.
- `POST /api/v1/analysis/export` : La génération de rapports PDF ou Excel massifs (côté serveur) est reportée. L'export CSV se fera via le frontend.

## Limitations UX Excluses du Sprint 2
- **Panneaux Déplaçables / Redimensionnables** : Comme ArcGIS Pro ou PowerBI, cela nécessite une surcouche (ex: `react-rnd`) pouvant s'avérer lourde et chronophage. Ce point devient une évolution Sprint 2.5. Les panneaux seront initialement ancrés de manière fluide.
- **Normalisation temporelle** : Le backend `/batch` ne forcera pas l'alignement des timestamps (interpolation). Si la série A a des points le 12, et B le 15, Recharts devra gérer l'absence de valeurs en `null` via le frontend.
