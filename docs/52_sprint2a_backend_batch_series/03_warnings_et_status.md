# 3. Warnings et Status

La réponse API contient deux blocs cruciaux pour la transparence frontend.

## Warnings
Des alertes JSON sont ajoutées à chaque incident non critique.
Types de warnings supportés :
- `aggregation_changed` : La fenêtre temporelle demandée a forcé une agrégation mensuelle ou annuelle au lieu de brute.
- `empty_series` : Requête valide, mais aucune ligne SQL correspondante sur la période pour cet objet/paramètre.
- `too_many_points` : La requête retourne plus de 5000 points malgré le downsampling.
- `internal_error` : Une exception est survenue lors de l'interrogation du provider.
- `unsupported_series` : La combinaison (support, parameter) n'est pas répertoriée dans le registry.

## Status Object
```json
"status": {
  "requested": 2, // Nombre de séries passées dans le payload
  "returned": 1,  // Séries remplies de valeurs 
  "empty": 1,     // Séries avec 0 valeur
  "failed": 0     // Séries ayant craché 
}
```
