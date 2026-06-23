# 2. Providers Réutilisés

Le service `/analysis/series/batch` ne recrée pas la logique d'extraction SQL depuis zéro. Il fait appel à la couche de services existante.

## Logique interne
- Pour chaque élément de la requête batch, le routeur appelle la fonction `get_series` depuis `business_map_service.py`.
- Cette dernière invoque le `SeriesProviderRegistry` qui route dynamiquement l'appel vers le bon fournisseur de données en base :
  - `STATION_HYDRO` -> Mesures journalières ou mensuelles de débit/niveau.
  - `BARRAGE` -> Mesures des paramètres (lâcher, apport, volume).
  - `STATION_QUALITE` -> Mesures qualité.
  - `STATION_METEO` -> Précipitations, Évaporation, Températures.

## Apports du Batch Service
1. Il intercepte le retour de l'appel existant.
2. Il reformate les valeurs et ajoute une empreinte cryptographique `id` (SHA-1).
3. Il injecte un bloc `source` détaillant la table SQL d'origine.
4. En cas de défaillance (ex: fournisseur indisponible ou combinaison inexistante), il intercepte l'exception, incrémente le compteur `failed` du batch et continue le traitement des séries suivantes sans crasher la réponse globale.
