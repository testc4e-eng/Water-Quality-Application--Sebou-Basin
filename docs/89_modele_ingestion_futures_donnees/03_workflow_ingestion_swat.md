# Workflow ingestion SWAT

## Entrees

- fichiers output SWAT
- metadata run
- scenario
- version modele
- mapping subbasin
- mapping parametre

## Etapes

1. creer `batch_id`
2. creer ou verifier `run_id`
3. verifier scenario
4. charger staging long
5. convertir dates et valeurs
6. rattacher subbasin GEO
7. verifier parametres
8. detecter doublons `(run_id, subbasin_uid, temps, param_code)`
9. charger table finale
10. publier vues/MV si validation OK

## Regle scenario

Le scenario `normal` seul ne suffit pas pour le module futur. Les nouveaux imports doivent expliciter :

- code scenario
- libelle
- type scenario
- description
- hypothese modele

