# BUG 3 — Liste des stations manquante

## Symptôme
La sidebar latérale manquait d'un bloc en bas de page listant les features (stations) visibles et filtrées sur la carte courante.

## Fichier modifié
`frontend/src/components/DashboardMetier/V1/BusinessSidebarV1.tsx`

## Correctif Appliqué
- Ajout de l'import pour le hook `useBusinessMapFeatures`.
- Récupération dynamique des features filtrées avec les paramètres actifs.
- Ajout du bloc final dans le retour de la sidebar (Accordion "Stations affichées ({count})") au format liste scrollable (max-h-250px).
- Chaque station affiche son nom, code, ainsi qu'une puce avec sa valeur associée (selon la sélection en Domaine ou Thématique).

## Résultat
**Bug corrigé (OUI)** : Une liste claire permet maintenant de visualiser et de scroller dans les entités affichées, ce qui manquait à l'UX analytique.
