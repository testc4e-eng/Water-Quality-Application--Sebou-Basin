# Composants frontend

| Composant | Responsabilité |
|---|---|
| `MetauxPage` | Orchestration page, filtres, synthèse, contrôles métier. |
| `MetauxTable` | Table responsive avec tri local et pagination backend. |
| `MetauxChart` | Graphique temporel minimal sur les paramètres de la page courante. |
| `useQualiteMetaux` | Chargement React Query et cache court. |
| `getQualiteMetaux` | Client API typé et nettoyage des filtres. |

## Règles frontend

- Ne pas interroger directement `qualite.*`, `metadata.*` ou les tables métier.
- Ne pas utiliser les routes legacy pour l'écran pilote.
- Conserver `MO` et `Mo` comme codes distincts.
- Ne pas exposer `FM`, `F_M_MES` ou `MO_METAL`.
