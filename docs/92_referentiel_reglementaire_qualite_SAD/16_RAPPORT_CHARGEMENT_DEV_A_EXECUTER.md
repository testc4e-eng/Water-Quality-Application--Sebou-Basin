# Rapport de chargement DEV à exécuter

| Champ | Valeur |
|---|---|
| Statut | PRET_EXECUTION_DEV_NON_EXECUTE |
| Script | `docs/92_referentiel_reglementaire_qualite_SAD/15_SQL_LOAD_REGLEMENTAIRE_DEV.sql` |
| Version réglementaire | `REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19` |
| Source | Tableau n°1 officiel eaux de surface |
| Base cible | `abh_sad` DEV |
| Schéma cible | `metadata` |
| DDL requis | déjà appliqué |
| Exécution chargement | NON |

## Tables ciblées

- `metadata.qualite_source_reglementaire`
- `metadata.qualite_type_eau`
- `metadata.qualite_classe_reglementaire`
- `metadata.qualite_parametre_reglementaire`
- `metadata.qualite_mapping_canonique_reglementaire`
- `metadata.qualite_seuil_reglementaire`
- `metadata.qualite_regle_classification`

Le script ne modifie jamais `metadata.referentiel_parametre_canonique`; il le lit seulement pour résoudre les FK de mapping.

## Volumes attendus

| Objet | Volume attendu |
|---|---:|
| Sources réglementaires | 1 |
| Types d'eau | 4, dont 1 opérationnel et 3 documentaires non opérationnels |
| Classes qualité | 5 |
| Paramètres réglementaires Tableau n°1 | 41 |
| Mappings réglementaire/canonique | 41 |
| Seuils chargés | 205 |
| Seuils actifs moteur attendus | 177 |
| Seuils inactifs/non utilisables moteur | 28 |
| Règles de classification | 5 |

Les 205 seuils du Tableau n°1 sont conservés en base DEV. Les seuils rattachés aux vrais absents du canonique ou aux classes Hg non retenues sont chargés mais inactifs moteur.

## Décisions intégrées

- Métaux : source `µg/l`, moteur `mg/L`, facteur 0.001.
- Microbiologie : `/100ml` équivalent à `UFC/100 mL`.
- DBO5/DCO : `mgO2/l` équivalent opérationnel à `mg/L`.
- `NO3` alias réglementaire vers canonique `NO3-`.
- `O2_DISSOUS` alias réglementaire vers canonique `O2_DISS`.
- `Hg` : `< 1 µg/l` = moyenne ; `>= 1 µg/l` = mauvaise ; autres classes inactives.
- Vrais absents canonique : stockables/visibles mais non classifiables moteur.
- Grilles simplifiées : `DOCUMENTAIRE_NON_OPERATIONNEL`.

## Risques

| Risque | Niveau | Mitigation |
|---|---|---|
| Mapping canonique absent au moment du chargement | Moyen | SELECT de contrôle `paramètres sans mapping` en fin de script |
| Seuil inactif interprété comme opérationnel | Haut | Filtrer `actif=true` et `classifiable=true` côté moteur/API |
| Confusion `MO`/`Mo` | Haut | Aucun upper/lower global ; mapping explicite uniquement |
| Réexécution du script | Faible | `ON CONFLICT DO UPDATE`, version réglementaire stable |
| Besoin rollback | Faible | Rollback logique par désactivation de version, pas suppression |

## Commande d'exécution DEV

```powershell
$env:PGPASSWORD='c4e@test@2025'
psql -h 127.0.0.1 -p 5432 -U postgres -d abh_sad -v ON_ERROR_STOP=1 -f 'C:/dev/WQDSS/repo_git/docs/92_referentiel_reglementaire_qualite_SAD/15_SQL_LOAD_REGLEMENTAIRE_DEV.sql'
```
## Commandes de vérification

```sql
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT count(*) FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
SELECT count(*) FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND actif IS true;
SELECT code_reglementaire, parametre_pdf FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND classifiable IS false;
```

## Rollback logique

Ne pas supprimer les lignes. Désactiver la version réglementaire :

```sql
BEGIN;
UPDATE metadata.qualite_source_reglementaire SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
UPDATE metadata.qualite_type_eau SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
UPDATE metadata.qualite_classe_reglementaire SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
UPDATE metadata.qualite_parametre_reglementaire SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
UPDATE metadata.qualite_mapping_canonique_reglementaire SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
UPDATE metadata.qualite_seuil_reglementaire SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
UPDATE metadata.qualite_regle_classification SET actif=false, validation_metier='ARCHIVED', updated_at=now() WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';
COMMIT;
```

Cette procédure est un rollback logique par version. Elle ne supprime aucune donnée.

