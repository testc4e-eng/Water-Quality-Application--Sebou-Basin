# Analyse de source_row_id

## Constat E0

Dans `qa_dry_run.e0_mesures_preparees` :

- `raw_mesures_precipitations_jr`
  - volume : `507 930`
  - `source_row_id` distincts : `507 930`
  - `source_row_id` au format `ctid` : `507 930`
- `raw_mesures_precipitations_jr_traitees`
  - volume : `1 591 627`
  - `source_row_id` distincts : `546 007`
  - `source_row_id` au format `ctid` : `0`

## Interprétation

### Source brute

`raw_mesures_precipitations_jr` dépend de `ctid` dans `E0`.

### Source traitée

`raw_mesures_precipitations_jr_traitees` utilise un identifiant stable `id`, mais `E0` a éclaté chaque ligne en plusieurs lignes préparées à cause des colonnes :

- `val_observees`
- `val_power_nasa`
- `val_remplies`

## Conclusion

Le blocage `E1.1` venait en partie de `ctid` côté source brute, mais surtout du fait que `E0` a transformé un modèle “1 ligne = 3 valeurs météo” en un pseudo flux ligne-à-ligne inadapté à la table cible.
