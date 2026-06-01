# Architecture SQL réglementaire

## Schéma cible

Toutes les structures réglementaires sont proposées dans `metadata` afin de rester proches du référentiel canonique et des règles de gouvernance.

## Tables proposées

| Table | Rôle |
|---|---|
| `metadata.qualite_source_reglementaire` | Documents sources, versions, périmètre officiel |
| `metadata.qualite_type_eau` | Types d'eau réglementaires et statut opérationnel |
| `metadata.qualite_classe_reglementaire` | Classes qualité, couleurs, score et ordre de gravité |
| `metadata.qualite_parametre_reglementaire` | Paramètres réglementaires issus du Tableau n°1 |
| `metadata.qualite_seuil_reglementaire` | Seuils par paramètre, classe et version réglementaire |
| `metadata.qualite_mapping_canonique_reglementaire` | Mapping vers `metadata.referentiel_parametre_canonique` |
| `metadata.qualite_regle_classification` | Règles versionnées du moteur de classification |

## Ajustements validés le 2026-05-19

Le DDL final intègre les arbitrages métier :

- colonnes `unite_reglementaire_source`, `unite_moteur`, `facteur_conversion_vers_unite_moteur` pour tracer les conversions ;
- colonnes `borne_min_source`, `borne_max_source`, `borne_min_moteur`, `borne_max_moteur` pour éviter toute ambiguïté entre seuil réglementaire et seuil moteur ;
- colonne `code_canonique_cible` pour piloter les APIs et le moteur à partir du canonique ;
- colonne `regle_specifique` pour le cas `Hg` ;
- `couleur_sad` dans les classes pour la palette normalisée bleu/vert/jaune-orange/rouge/violet ;
- FK vers `metadata.referentiel_parametre_canonique(parametre_ref_id)`, conformément à la structure réelle vérifiée.

## Index clés

- Index unique sur code/version pour classes, types d'eau, paramètres.
- Index métier sur paramètre + type d'eau + version + actif.
- Index FK vers référentiel canonique quand disponible.
- Index sur validation métier pour filtrer ce qui est opérationnel.
- Index unique d'expression sur `COALESCE(code_canonique, '')` placé en `CREATE UNIQUE INDEX`, pas en contrainte table.

## Compatibilité

DDL compatible PostgreSQL 17. Aucune dépendance PostGIS obligatoire pour ces tables, mais le modèle est compatible avec les vues `api` et moteurs géospatiaux existants.
