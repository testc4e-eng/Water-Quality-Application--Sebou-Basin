# Limites et points à valider

## Paramètres sans source bibliographique fiable
- DBO5, DCO, NTK, PTD, PTP, H_G, PT décanté, DCO 2h décant., MEST Filtr, HCT, FM : aucune référence externe fiable et directement exploitable n’a été confirmée dans cette phase.

## Unités manquantes ou incertaines
- plusieurs paramètres de qualité n’ont qu’une unité implicite ou absente dans l’inventaire source
- `CT` apparaît avec `mg/L` dans `types_mesures`, alors que le mapping métier le traite comme un paramètre bactérien en `UFC/100 mL`
- `Debit_m` et `Debit_jr` semblent inversés dans la feuille `parametres_normalises`

## Paramètres ambigus
- `PT`, `PTD`, `PTP`, `DCO_dec2h`, `DBO5_dec2h`, `HG`, `FM`, `MD` nécessitent arbitrage métier
- les variantes IDP 2024 contenant des facteurs ou unités dans le libellé doivent être figées avant migration

## Valeurs suspectes non confirmées
- les min/max de certaines lignes IDP sont partiels car les chaînes `<x`, `x10n` et textes labo ne sont pas directement intégrées aux stats numériques
- aucune valeur n’est qualifiée d’“aberrante” sans unité claire et plage de référence exploitable

## Limites du fichier métier
- la feuille `parametres_normalises` contient au moins une incohérence interne probable sur `Debit_m` / `Debit_jr`
- certains standards sont marqués implicitement à exclure (`FM`, `MD`) mais sans décision de migration formelle

## Décisions ABH nécessaires
- validation des règles de conversion `<x`, `>x`, virgule décimale et notation scientifique `x10n`
- validation des unités de référence pour `NH4+`, `PT`, `PO4³-`, `DCO`, `DBO5`, `CT`, `CF`, `Conductivité`
- validation de l’exclusion ou non des indicateurs hors périmètre mesures (`Montant_MD`, `Superficie_*`, etc.)

## Points qui empêchent la migration globale
- paramètres non mappés ou ambigus
- unités non stabilisées
- valeurs non numériques sans règle métier validée
- références bibliographiques non confirmées pour plusieurs paramètres analytiques spécialisés

## Références documentaires internes mobilisées
- `docs\36_nettoyage_idp_2024_securise\03_parametres_idp_problematiques.md`
- `docs\39_inventaire_parametres_metier_REGEN\00_index.md`
- `docs\40_enrichissement_normes_seuils_ABH\00_index.md`
- `docs\41_inventaire_parametres_abh_sebou_ismail\00_resume.md`