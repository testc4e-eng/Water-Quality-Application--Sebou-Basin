# 2. Popup et Panneau d'Analyse

## Popup MapLibre
Le comportement de clic a été mis à jour.
Au lieu d'ouvrir directement le panneau de droite, un clic sur une entité MapLibre ouvre désormais un `Popup` compact au-dessus du point.

Le Popup affiche :
- Le Nom de l'objet (ou son ID)
- Le Code de l'entité
- Le Type de support
- Le Bassin (si applicable)
- Un bouton principal "Analyser"

**Note technique** : La "dernière valeur" n'est pas affichée dans le Popup par souci de performance (éviter d'injecter cette donnée dans le GeoJSON massif). Elle est calculée et affichée dans le panneau de droite lors du clic sur "Analyser".

## Panneau Droit (BusinessRightPanelV1)

### KPIs Dynamiques
Une section KPI a été ajoutée. Elle se calcule dynamiquement côté frontend en parcourant `seriesQuery.data.values` :
- **Dernière** (valeur + date de mesure)
- **Minimum**
- **Maximum**
- **Moyenne**
- **Nombre de mesures** (count)

### Gestion des Erreurs et Cas Vides
- Si une erreur API survient, un bloc rouge clair et explicatif s'affiche.
- Si le paramètre ne retourne aucune donnée temporelle (array vide), un message de fallback explicite informe l'utilisateur : *"Aucune donnée retournée pour ce support / paramètre / période."* (sans planter le graphique Recharts).
