# Source PDF et méthode d’extraction

## Source

- Nom du fichier : `Système d'evaluation de la Qualité des ressources en eau.pdf`
- Chemin : `C:\dev\WQDSS\data\Système d'evaluation de la Qualité des ressources en eau.pdf`
- Nombre de pages : 16
- Type : PDF scanné / image. Extraction texte native : 0 caractère sur les pages traitées.
- Qualité OCR : OCR externe indisponible ; extraction par rendu image haute résolution et contrôle visuel.

## Pages exploitées

| Page PDF | Contenu | Statut extraction |
|---|---|---|
| 7 | Cadre législatif, règles de fréquence et articles | extrait visuel |
| 8 | Tableau n°1 — grille générale eaux de surface | extrait |
| 9 | Tableaux n°2 et n°3, couleurs | extrait |
| 10 | Tableau n°4 eaux souterraines, remarques problématique | extrait |
| 11 | Nouveau système, indice pondéré | extrait partiel |
| 12 | Tableau n°5 rivières | extrait |
| 13 | Tableau n°6 lacs | extrait |
| 14 | Tableau n°7 eaux souterraines | extrait |

Note : les numéros imprimés dans le PDF sont décalés d’une page par rapport aux pages PDF rendues.

## Méthode

- rendu PNG des pages avec `pdfplumber` ;
- lecture visuelle manuelle des tableaux ;
- réutilisation contrôlée de l’extraction documentaire existante du dossier ;
- normalisation CSV sans modifier la base ;
- comparaison lecture seule avec les référentiels existants.

## Convention

- virgule décimale convertie en point dans les colonnes numériques du CSV ;
- unités conservées telles que lues ;
- valeur originale conservée dans `valeur_intervalle_originale` ;
- signes `<`, `<=`, `>`, `>=` conservés ;
- valeurs incertaines marquées `À vérifier`.
