# Diagnostic final — `hydro.mesure_barrage`

## Contexte

- mode : lecture seule stricte
- source officielle : `staging.raw_mesures_niv_eau_barrages`
- préparé `E0` : `qa_dry_run.e0_mesures_preparees`
- cible : `hydro.mesure_barrage`

## Constats clés

- paramètres détectés : `NIVEAU_EAU`, `VOLUME`, `RESTITUTION`, `APPORTS_HM3`, `TRANSFERT`
- volume brut source : `85 166` lignes
- volume préparé `E0` après explosion paramétrique : `264 723` lignes
- volume cible actuel : `84 831` lignes
- clé cible réelle : `(temps, barrage_id)`
- mapping barrage : `100 %` couvert via `metadata.mapping_barrage`
- dépendance à `ctid` : `non`
- dépendance à `source_row_id` instable : `non` pour ce flux (`source_row_id = r.id::text`)

## Conclusion synthétique

Le blocage ne vient ni du mapping barrage ni du temps.
Il vient du **modèle métier cible** :

- la source porte 5 concepts métier distincts ;
- la cible n’en absorbe réellement que 2.5 :
  - `cote_m`
  - `volume_mm3`
  - `lacher_m3s` prévu en `m3/s`, alors que la source porte `restitutions_mm3` en `Mm³`
- `apports` et `transfert` n’ont aucun support structurel explicite dans la cible.

## Décision finale

**HYDRO_BARRAGE_A_REMODELER**

## Fichiers liés

- [01_inventaire_parametres_barrage.md](./01_inventaire_parametres_barrage.md)
- [02_analyse_cle_metier.md](./02_analyse_cle_metier.md)
- [03_analyse_temporelle.md](./03_analyse_temporelle.md)
- [04_analyse_unites.md](./04_analyse_unites.md)
- [05_analyse_modele_metier.md](./05_analyse_modele_metier.md)
- [06_comparaison_source_cible.md](./06_comparaison_source_cible.md)
- [07_classification_scope.md](./07_classification_scope.md)
- [08_recommandation_architecture.md](./08_recommandation_architecture.md)
- [09_decision_hydro_barrage.md](./09_decision_hydro_barrage.md)
