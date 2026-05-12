# Recommandation d’architecture

## Options évaluées

### Option A — `hydro.mesure_barrage` polymorphe

Structure cible logique :

```text
temps, barrage_id, parametre, valeur, unite, time_step, type_mesure, attributs
```

#### Avantages

- une seule table de faits
- extensible si de nouveaux paramètres barrage apparaissent
- cohérente pour ingestion multi-paramètres

#### Inconvénients

- dashboards plus complexes
- agrégations moins directes
- validation métier plus lourde
- attributs hétérogènes à porter dans une couche générique

### Option B — tables spécialisées

Tables proposées :

- `hydro.mesure_niveau_barrage`
- `hydro.mesure_volume_barrage`
- `hydro.mesure_apports_barrage`
- `hydro.mesure_restitution_barrage`
- `hydro.mesure_transfert_barrage`

#### Avantages

- meilleure cohérence métier
- unités explicites et stables
- meilleures garanties de qualité par table
- analytics et dashboards plus lisibles
- plus simple d’ajouter les attributs métier spécifiques :
  - `reference_altitude = NGM`
  - type de transfert

#### Inconvénients

- plus de tables
- plus de vues de consolidation à maintenir

## Évaluation synthétique

| Critère | Option A polymorphe | Option B spécialisée | Recommandation |
|---|---|---|---|
| Simplicité de stockage | bonne | moyenne | A |
| Performance analytique ciblée | moyenne | bonne | B |
| Cohérence métier | moyenne | très bonne | B |
| Maintenance fonctionnelle | moyenne | bonne | B |
| Lisibilité dashboard | moyenne | très bonne | B |
| Gestion des unités / attributs spécifiques | moyenne | très bonne | B |

## Recommandation

**Option B — tables spécialisées**

### Justification

Le flux barrage n’est pas un simple signal numérique unique. Il agrège au moins 5 concepts différents avec :

- unités distinctes ou sémantiques distinctes
- attributs métier spécifiques
- usages analytiques différents

Forcer ces concepts dans la structure actuelle :

```text
temps, barrage_id, cote_m, volume_mm3, lacher_m3s
```

reproduirait le blocage actuel.

## Proposition de compatibilité

Si l’application a besoin d’un point d’accès unifié, il vaut mieux :

- stocker dans des tables spécialisées
- exposer ensuite une vue de compatibilité, par exemple `api.v_hydro_barrage_consolide`

plutôt que de continuer à surcharger `hydro.mesure_barrage`.
