# Referentiel et alias

## Source officielle

`metadata.referentiel_parametre_canonique`

## Regles

- tout parametre publie doit avoir un code canonique ;
- les variantes historiques deviennent aliases ;
- les unites legacy sont conservees comme variantes d'unite ;
- les codes sensibles a la casse sont preserves ;
- les aliases ambigus ne declenchent jamais de mapping automatique.

## Codes sensibles

| Code | Signification |
|---|---|
| `MO` | Matieres organiques |
| `Mo` | Molybdene |

## Gouvernance alias

| Type alias | Usage |
|---|---|
| metier | synonymes valides C4E |
| laboratoire | libelles source labo |
| legacy | anciens codes historiques |
| ingestion | variantes fichiers |
| unite | variantes d'ecriture d'unite |

## Backlog referentiel

| Gap | Volume |
|---|---:|
| actifs sans unite | 39 |
| actifs sans table cible | 65 |

Ces gaps sont non bloquants mais doivent etre resolus avant IA avancee et ingestion automatisee large.
