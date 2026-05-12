# Pipeline SWAT/WASP

## Decision

Les donnees SWAT/WASP actuelles sont `LEGACY_MODELING_TO_REPLACE`.

## Pipeline cible

1. enregistrer modele, version, scenario, source fichier ;
2. charger resultats bruts ;
3. valider dimensions temps/segment/subbasin/variable ;
4. controler doublons par cle metier ;
5. publier en tables versionnees ;
6. conserver ancien jeu jusqu'a validation du nouveau ;
7. activer rollback par scenario/run.

## Cle metier minimale

| Modele | Cle |
|---|---|
| SWAT | modele, version, scenario, subbasin/reach, date, variable |
| WASP | modele, version, scenario, segment, date, variable |

## Interdits

- ne pas dedoublonner les jeux legacy actuels ;
- ne pas supprimer avant remplacement valide ;
- ne pas ecraser un scenario sans backup.
