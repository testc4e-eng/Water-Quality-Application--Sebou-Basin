# Limites et points à vérifier

- certaines tables ne portent pas de colonne paramètre explicite et ont été analysées comme tables larges
- les unités détectées dans les libellés sont des propositions automatiques et non des validations métier
- plusieurs variantes ont été regroupées automatiquement avec un niveau de confiance à confirmer
- les paramètres détectés dans les tables metadata et mapping ne valent pas validation officielle
- certaines unités restent absentes et doivent être confirmées via les fichiers sources Excel ou la validation ABH
- les paramètres ambigus listés restent tous à valider
- les schémas demandés non présents dans une base ne produisent pas de table inspectée
- les moyennes sont calculées seulement quand des exemples numériques exploitables ont été trouvés
