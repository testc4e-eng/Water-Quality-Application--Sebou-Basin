# Modèle cible PostgreSQL/PostGIS

## Principes

- `staging` conserve strictement les couches brutes, sans perte de champ source.
- `pollution` porte les sites et sources de pollution normalisés.
- `qualite` porte les campagnes, points de mesure et résultats analytiques en format long.
- `metadata` porte les référentiels de types, catégories, paramètres et unités.
- `qa` porte les anomalies, doublons candidats et arbitrages.
- `api` et `analytics` exposent uniquement des vues contrôlées.

## Tables cibles

### `staging.raw_idp_src_pollution_globale`
Copie brute importée de la couche. Tous les champs DBF sont conservés. Ajouts : `source_layer`, `source_file`, `import_batch_id`, `imported_at`, `geom_original`, `geom_4326`.

### `staging.raw_idp_src_pollution_marche_cadre`
Même principe pour le périmètre marche cadre.

### `staging.raw_idp_mesures_qualite_marche_cadre_2024`
Mesures brutes marche cadre 2024, format source conservé.

### `staging.raw_idp_mesures_qualite_globale_2024`
Mesures brutes globale 2024, format source conservé.

### `pollution.site_pollution`
Site consolidé de pression polluante. PK `site_id`. FK `site_type_id`, `pollution_category_id`. Index GiST `geom`, B-tree `commune`, `site_type_id`. Contrainte unique `(source_layer, source_feature_id)`.

### `pollution.site_pollution_source`
Traçabilité multi-source vers chaque ligne brute. PK `source_id`. FK `site_id`. Champs `raw_layer`, `raw_id`, `confidence_score`, `comments`.

### `qualite.campagne_mesure`
Campagne de prélèvement. PK `campagne_id`. Champs `campaign_type`, `start_date`, `end_date`, `source_document`.

### `qualite.point_mesure`
Point mesuré, éventuellement lié à `pollution.site_pollution`. PK `point_mesure_id`. FK nullable `site_id`, FK `campagne_id`. Index GiST `geom`.

### `qualite.resultat_mesure`
Résultat analytique atomique en format long. PK `resultat_id`. FK `point_mesure_id`, `parameter_id`, `unit_id`. Index `(parameter_id, sample_date)`.

### `metadata.*`
Référentiels : `ref_type_source_pollution`, `ref_categorie_pollution`, `ref_parametre_qualite`, `ref_unite`.

### `qa.qa_anomalie_pollution`
Registre des anomalies et arbitrages. Aucun doublon n'est supprimé automatiquement.
