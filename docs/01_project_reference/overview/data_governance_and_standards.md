# 🛡️ Gouvernance des Données et Standards

## 1. Dictionnaire de gouvernance

| Objet | Data Owner | Sensibilité | RGPD | Rétention | Provenance |
|---|---|---|---|---|---|
| `infra.station_mesure` | Responsable infrastructure | Interne | Non | permanente | référentiel métier |
| `hydro.mesure_debit` | Responsable hydrologie | Interne | Non | 10 ans+ | capteurs / télémesure |
| `meteo.mesure_precipitation` | Responsable climat | Interne | Non | 10 ans+ | capteurs / import |
| `meteo.mesure_temperature` | Responsable climat | Interne | Non | 10 ans+ | capteurs / import |
| `qualite.campagne_mesure` | Responsable qualité eau | Interne | Non | 10 ans+ | saisie / import labo |
| `qualite.resultat_analyse` | Responsable qualité eau | Interne | Non | 10 ans+ | laboratoire |
| `security.audit_log` | RSSI / DBA | Confidentiel | Potentiel | selon politique sécurité | triggers BD |
| `api.mv_station_latest_status` | Product owner dashboard | Interne | Non | dérivée | consolidation |

## 2. Règles de qualité des données

```sql
-- Débit non négatif
ALTER TABLE hydro.mesure_debit
ADD CONSTRAINT chk_mesure_debit_valeur_positive
CHECK (valeur >= 0);

-- Coordonnées dans l'emprise du Maroc
ALTER TABLE infra.station_mesure
ADD CONSTRAINT chk_station_maroc_bbox
CHECK (
  ST_X(geom) BETWEEN -13 AND -1
  AND ST_Y(geom) BETWEEN 27 AND 36
);

-- Cohérence dates qualité
ALTER TABLE qualite.resultat_analyse
ADD CONSTRAINT chk_date_analyse_coherente
CHECK (date_analyse IS NULL OR date_analyse >= NOW() - INTERVAL '20 years');
```

## 3. SLA cible

| Métrique | Cible | Mesure |
|---|---|---|
| Disponibilité API | `99.5%` | uptime mensuel |
| Temps réponse p95 | `< 500 ms` | APM |
| Fraîcheur des agrégats | `< 15 min` | delta dernier refresh |
| Taux d'erreur | `< 0.1%` | logs / requêtes |

## 4. Standards de nommage

| Objet | Convention | Exemple |
|---|---|---|
| table | `snake_case` singulier | `station_mesure` |
| vue simple | `v_` | `v_station_dimension` |
| continuous aggregate | `ca_` | `ca_hydro_debit_day` |
| vue matérialisée | `mv_` | `mv_qualite_month` |
| index | `idx_<objet>_<col>` | `idx_mv_station_latest_status_geom` |

## 5. Glossaire métier

| Terme | Acronyme | Définition | Exemple |
|---|---|---|---|
| Courbe de Débit Classé | FDC | Flow Duration Curve, distribution fréquentielle des débits | mode FDC |
| Directive Cadre Eau | DCE | cadre réglementaire de gestion de l'eau | indicateur conformité |
| Bassin Versant | BV | territoire drainé par un cours d'eau | bassin du Sebou |
| Sous-bassin | SB | subdivision d'un bassin versant | Inaouene |
| Station de mesure | - | point instrumenté de collecte | station hydrologique |
| Continuous Aggregate | CA | agrégat maintenu par TimescaleDB | `api.ca_hydro_debit_day` |

## 6. FAQ

| Question | Réponse |
|---|---|
| Pourquoi un endpoint retourne peu de résultats ? | vérifier période, station, agrégation et disponibilité réelle des données |
| Comment optimiser une requête lente ? | privilégier `api.ca_*` et `api.mv_*`, réduire la période, ajouter index |
| Comment ajouter un paramètre qualité ? | créer le paramètre dans `admin.catalogue_parametre`, alimenter les données, mettre à jour docs et API |
