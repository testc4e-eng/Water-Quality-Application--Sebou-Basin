# Rapport post-DDL DEV - Référentiel réglementaire qualité

| Champ | Valeur |
|---|---|
| Date exécution | 2026-05-19 |
| Base | `abh_sad` |
| Hôte | `127.0.0.1:5432` |
| Schéma cible | `metadata` |
| Script exécuté | `docs/92_referentiel_reglementaire_qualite_SAD/12_SQL_FINAL_A_VALIDER.sql` |
| Statut exécution | SUCCÈS |
| Chargement des seuils | NON |
| DML exécutée | NON |
| Migration applicative | NON |

## Résumé

Le DDL réglementaire qualité a été appliqué en DEV avec succès. Les structures sont présentes, les index et contraintes sont créés, et toutes les tables réglementaires sont vides.

## Tables créées

| Table | Colonnes | Lignes après DDL |
|---|---:|---:|
| `metadata.qualite_source_reglementaire` | 14 | 0 |
| `metadata.qualite_type_eau` | 12 | 0 |
| `metadata.qualite_classe_reglementaire` | 17 | 0 |
| `metadata.qualite_parametre_reglementaire` | 19 | 0 |
| `metadata.qualite_mapping_canonique_reglementaire` | 16 | 0 |
| `metadata.qualite_seuil_reglementaire` | 29 | 0 |
| `metadata.qualite_regle_classification` | 14 | 0 |

## Index

26 index sont présents sur les 7 tables, incluant :

- clés primaires ;
- contraintes uniques ;
- index métier sur codes, statuts, validation et lookup seuils ;
- index FK vers le référentiel canonique ;
- index unique d'expression `uq_qualite_mapping_canonique_reg`.

## Clés étrangères

| Table | Référence |
|---|---|
| `metadata.qualite_mapping_canonique_reglementaire` | `metadata.qualite_parametre_reglementaire` |
| `metadata.qualite_mapping_canonique_reglementaire` | `metadata.referentiel_parametre_canonique(parametre_ref_id)` |
| `metadata.qualite_seuil_reglementaire` | `metadata.qualite_classe_reglementaire` |
| `metadata.qualite_seuil_reglementaire` | `metadata.qualite_parametre_reglementaire` |
| `metadata.qualite_seuil_reglementaire` | `metadata.qualite_type_eau` |

## Contrôles post-DDL

| Contrôle | Résultat |
|---|---|
| Schéma `metadata` disponible | OK |
| Extension `pgcrypto` disponible | OK |
| Tables réglementaires présentes | OK |
| Cardinalités à zéro | OK |
| FK vers `referentiel_parametre_canonique(parametre_ref_id)` | OK |
| Index métier présents | OK |
| Chargement seuils absent | OK |

## Ce qui n'a pas été fait

- Aucun seuil réglementaire chargé.
- Aucune classe qualité chargée.
- Aucun type d'eau chargé.
- Aucun mapping canonique/réglementaire chargé.
- Aucun endpoint API modifié.
- Aucun moteur de classification exécuté.

## Prochaine étape

Préparer un script de chargement DEV versionné et idempotent, séparé du DDL, pour charger dans cet ordre :

1. source réglementaire ;
2. type d'eau `surface_generale` et grilles documentaires non opérationnelles si nécessaire ;
3. classes qualité avec palette SAD ;
4. paramètres réglementaires ;
5. mappings canonique/réglementaire ;
6. seuils Tableau n°1 uniquement ;
7. règles de classification, dont règle spécifique `HG`.

Le chargement devra rester transactionnel, audité et réversible par version réglementaire.
