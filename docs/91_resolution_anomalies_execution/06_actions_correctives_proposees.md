# Actions correctives proposees

## SQL-PROP-REF-001 - Mapping `parametre_ref_id` qualite

### Anomalie concernee

`REF-001` a `REF-004`.

### Justification

Les parametres qualite sans `parametre_ref_id` empechent les analyses normees et les jointures referentielles.

### Requete avant

```sql
SELECT parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_riviere
WHERE parametre_ref_id IS NULL
GROUP BY parametre_qualite
ORDER BY COUNT(*) DESC;
```

### Requete proposee, non executee

```sql
-- Proposition seulement. A valider et adapter par table.
WITH candidates AS (
    SELECT q.source_row_id, r.parametre_ref_id
    FROM qualite.mesure_qualite_riviere q
    JOIN metadata.referentiel_parametre_canonique r
      ON r.statut = 'ACTIF'
     AND (
          upper(r.code_parametre) = upper(q.parametre_qualite)
          OR r.aliases ? q.parametre_qualite
     )
    WHERE q.parametre_ref_id IS NULL
)
UPDATE qualite.mesure_qualite_riviere q
SET parametre_ref_id = c.parametre_ref_id
FROM candidates c
WHERE q.source_row_id = c.source_row_id;
```

### Validation apres

```sql
SELECT COUNT(*) FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NULL;
```

### Risque

Alias ambigus si plusieurs referentiels matchent un meme code.

### Rollback possible

Backup prealable des lignes modifiees par `source_row_id`; rollback par `source_row_id`, jamais par `ctid`.

### Statut cible

`A_PROPOSER_CORRECTION_C4E`.

## SQL-PROP-REF-002 - Enrichissement unites referentiel

### Anomalie concernee

`REF-005`.

### Requete proposee, non executee

```sql
-- Exemple de structure, a alimenter par dictionnaire valide.
WITH unit_map(code_parametre, unite_reference) AS (
    VALUES
        ('CONDUCTIVITE', 'µS/cm'),
        ('DBO5', 'mg/L'),
        ('DCO', 'mg/L')
)
UPDATE metadata.referentiel_parametre_canonique r
SET unite_reference = u.unite_reference
FROM unit_map u
WHERE r.code_parametre = u.code_parametre
  AND r.statut = 'ACTIF'
  AND NULLIF(TRIM(r.unite_reference), '') IS NULL;
```

### Validation apres

```sql
SELECT COUNT(*)
FROM metadata.referentiel_parametre_canonique
WHERE statut='ACTIF' AND NULLIF(TRIM(unite_reference),'') IS NULL;
```

### Statut cible

`A_PROPOSER_CORRECTION_C4E`.

## SQL-PROP-REF-003 - Enrichissement table cible referentiel

### Anomalie concernee

`REF-006`.

### Requete proposee, non executee

```sql
-- Exemple : a valider selon domaine/support.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'qualite.mesure_qualite_riviere'
WHERE statut='ACTIF'
  AND domaine='qualite'
  AND NULLIF(TRIM(table_cible),'') IS NULL;
```

### Risque

Certains parametres qualite peuvent concerner nappe, barrage, Sebou ou pollution. Ne pas appliquer globalement sans segmentation.

### Statut cible

`A_PROPOSER_CORRECTION_C4E`.

## SQL-PROP-QA-001 - Vue evaporation filtrable

### Anomalie concernee

`QA-001`.

### Requete proposee, non executee

```sql
CREATE OR REPLACE VIEW api.v_meteo_evaporation_journalier_qa AS
SELECT
    *,
    (valeur IS NULL) AS qa_flag_null_value
FROM meteo.mesure_evaporation;
```

### Statut cible

`A_PROPOSER_CORRECTION_C4E`.

## SQL-PROP-QA-002 - Classification pollution valeur brute `-`

### Anomalie concernee

`QA-002`.

### Requete proposee, non executee

```sql
-- Seulement si le client confirme que '-' signifie valeur absente.
UPDATE qualite.source_pollution_mesure_param
SET qa_flag_value_missing = TRUE
WHERE valeur_num IS NULL
  AND TRIM(COALESCE(valeur_raw, '')) = '-';
```

### Validation apres

```sql
SELECT COUNT(*)
FROM qualite.source_pollution_mesure_param
WHERE valeur_num IS NULL
  AND TRIM(COALESCE(valeur_raw, '')) = '-'
  AND COALESCE(qa_flag_value_missing, false) = false;
```

### Statut cible

`A_PROPOSER_CORRECTION_C4E`, avec confirmation client si necessaire.

