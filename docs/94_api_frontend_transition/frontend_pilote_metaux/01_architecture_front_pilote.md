# Architecture frontend pilote

## Principe

Le pilote ajoute une verticale React isolée pour les métaux. La page `Métaux` est accessible via `/qualite/metaux` et repose sur une chaîne dédiée :

| Couche | Fichier | Rôle |
|---|---|---|
| Types | `frontend/src/types/qualite.ts` | Contrat TypeScript du format standard API. |
| Client API | `frontend/src/api/qualite.ts` | Appel typé vers `/qualite/metaux` via le client Axios existant. |
| Hook | `frontend/src/hooks/useQualiteMetaux.ts` | Cache React Query, pagination et refetch. |
| Page | `frontend/src/pages/qualite/MetauxPage.tsx` | Filtres, synthèse, graphique, table et contrôles métier. |
| Table | `frontend/src/components/qualite/MetauxTable.tsx` | Affichage paginé et tri local de la page courante. |
| Chart | `frontend/src/charts/MetauxChart.tsx` | Evolution temporelle simple par paramètre. |

## Coexistence legacy

Aucun composant legacy n'est supprimé. La route `/qualite/metaux` est ajoutée aux routeurs existants sans modifier les dashboards historiques.
