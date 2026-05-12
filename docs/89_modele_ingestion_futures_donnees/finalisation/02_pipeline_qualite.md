# Pipeline qualite

## Entrees

- fichiers qualite riviere ;
- fichiers qualite nappe ;
- fichiers qualite barrage ;
- suivi Sebou ;
- garde hebdo ;
- pollution/IDP si mesures analytiques.

## Etapes

1. charger brut avec `source_row_hash` ;
2. identifier station/nappe/barrage/segment ;
3. mapper `parametre_qualite` via referentiel canonique et alias ;
4. respecter les codes sensibles a la casse : `MO` != `Mo` ;
5. parser valeur numerique et qualifier ;
6. affecter `parametre_ref_id` FK ;
7. controler unite ;
8. publier ou mettre en quarantaine.

## Cas obligatoires

| Cas | Regle |
|---|---|
| `MO` | Matieres organiques |
| `Mo` | Molybdene |
| `MO_METAL` | alias legacy vers `Mo` si source molybdene prouvee |
| `NUMEROTATION` | `LEGACY_IGNORE` |
| valeur `-` | valeur manquante explicite, pas zero |

## Sorties

- tables `qualite.*` ;
- quarantaines ;
- rapport batch ;
- rapport client si mapping GEO absent.
