# Workflow ingestion WASP

## Entrees

- fichiers output WASP
- metadata run
- scenario
- version modele
- mapping segment/reseau
- mapping parametre

## Etapes

1. creer `batch_id`
2. creer ou verifier `run_id`
3. verifier scenario
4. charger staging long
5. convertir date/heure et bucket jour
6. rattacher segment au reseau
7. verifier parametres
8. detecter doublons `(run_id, reseau_id, bucket_day, code_parametre)`
9. charger table finale
10. publier vues/MV si validation OK

## Regle doublons

Les doublons actuels ne doivent pas etre corriges silencieusement. Le futur ingest doit choisir explicitement :

- rejet
- aggregation
- priorite source
- conservation multi-run

