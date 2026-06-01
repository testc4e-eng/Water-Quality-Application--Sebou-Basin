# Plan migration controlee identite spatiale

## Strategie DEV

1. Executer `20_create_ref_site_pollution_master.sql` en DEV apres revue.
2. Executer `21_create_spatial_identity_qa.sql` en DEV apres revue.
3. Lancer `build_spatial_identity_resolution.py --dry-run`.
4. Examiner les CSV candidats/conflits/orphelins.
5. Valider un petit lot pilote : STEP, STM, IDP mesures P0.
6. Charger seulement les decisions validees dans les tables QA.
7. Generer vues API cible sans remplacer `/api/v1/pollution/*`.

## Strategie PREPROD

- Restaurer un dump DEV valide.
- Rejouer DDL + moteur dry-run.
- Comparer volumes, conflits, orphelins.
- Verifier dashboards et carte MapLibre.
- Geler une version de matrice de priorite.

## Strategie PROD

- Fenetre d'intervention planifiee.
- Backup schema `geo`, `qa`, `api`.
- Application DDL.
- Chargement decisions validees uniquement.
- Activation vues API cible en parallele des anciennes.
- Bascule frontend progressive.

## Rollback

- Ne jamais supprimer les sources.
- Desactiver une version de resolution par `actif=false`.
- Revenir aux vues API DEV existantes.
- Conserver les decisions dans `qa.spatial_identity_decisions` avec statut `REVERTED`.

## Impacts

| Domaine | Impact |
|---|---|
| API | nouveaux endpoints `/api/v1/map/sites*`, endpoints pollution DEV conserves |
| Frontend | future carte metier multi-entites basee sur master site |
| Analytics | agregations par `master_site_id` |
| Propagation pollution | point de depart stable pour routage |
| Prediction pollution | rattachement des concentrations predites au site maitre |

## Risques

- SRID 0 dans plusieurs tables `infra.*`.
- Doublons exacts nombreux dans `geo.ref_site_pollution`.
- Confusion IDP inventaire/mesures marche cadre.
- Geometries nulles dans couches officielles generales.
- Noms/communes heterogenes.

## Go/No-Go

GO DEV dry-run si DDL revu et backup disponible.  
NOGO PREPROD tant que les conflits `GEOMETRY_CONFLICT` et orphelins prioritaires ne sont pas arbitres.
