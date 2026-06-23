# Thématiques Implémentées (Sprint 2E Light)

Le Sprint 2E Light apporte une visualisation thématique simple (pastilles vectorielles non lissées) reposant sur les données extraites via l'API. Les sous-thématiques suivantes ont été intégrées à l'interface `MapV1.tsx` :

## 1. Qualité
- **pH** : Indicateur coloré selon les normes (Vert pour [6.5, 8.5], Jaune aux limites, Rouge pour <6.0 ou >9.0).
- **Cadmium (Cd)** : Seuil d'alerte. Rouge si > 5, sinon Vert.
- **DBO5** : Vert (<=3), Jaune (<=10), Rouge (>10).

## 2. Hydrologie
- **Débit** : Pastille de couleur unie (bleu) dont le **rayon** (`circle-radius`) varie proportionnellement à la valeur du débit, grâce à la fonction `interpolate` de MapLibre (de 6px à 20px).

## 3. Météo
- **Pluie (Cumul)** : Pastille bleue dont la taille varie linéairement avec le cumul de pluie retourné par les données.

## 4. Pollution
- **Sources** : Pastille rouge si l'état est `active`, grise si `inactive`.

## 5. Barrages
- **Volume** : Rouge si < 30%, Jaune entre 30% et 70%, Vert si > 70%.
