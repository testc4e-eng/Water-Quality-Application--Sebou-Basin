# Paramètres IDP problématiques

## Paramètres ambigus, non mappés, unités et valeurs suspectes

| Paramètre | Table | Problème | Volume | Unité observée | Exemple valeur | Décision attendue |
|---|---|---|---:|---|---|---|
| `Huiles Graisses (H G T)` | `mesures_idp_2024_qualite_marche_cadre` | `PARAM_AMBIGUOUS` ; rapprochement probable avec `H_G` | 27 | unité absente | à confirmer | valider le sens exact |
| `NO3-` | `mesures_idp_2024_qualite_globale` | libellé historique ; non couvert directement par le mapping cible IDP consolidé | 189 | unité absente | à confirmer | confirmer le libellé officiel |
| `NO3-_Spectro` + `NO3-_Réduction Cd` | `mesures_idp_2024_qualite_marche_cadre` | plusieurs variantes pour nitrates | 131 | unité intégrée au libellé ou absente | à confirmer | fusionner ou distinguer après validation |
| `Cond 25°C *0,9*0,01` | `mesures_idp_2024_qualite_marche_cadre` | unité / facteur dans le nom | 13 | intégrée au libellé | à confirmer | normaliser |
| `Cond 25°C *1,1*0,01` | `mesures_idp_2024_qualite_marche_cadre` | unité / facteur dans le nom | 13 | intégrée au libellé | à confirmer | normaliser |
| `Cond 25°C` / `25°C` | `mesures_idp_2024_qualite_marche_cadre` | libellé non standardisé | 13 + 13 | intégrée au libellé | à confirmer | harmoniser |
| `PT DECANTE` | `mesures_idp_2024_qualite_marche_cadre` | libellé métier à confirmer ; valeurs nulles | 4 | absente | `[null]` | valider le statut métier |
| `DCO  D  2h` / `DCO 2h décant.` | globale / marché cadre | variante analytique spécifique | 2 + 4 | intégrée au libellé | à confirmer | valider ou exclure |
| `NH4+ Spect`, `NH4+ Titri`, `NH4+ 2` | `mesures_idp_2024_qualite_marche_cadre` | variantes multiples pour ammonium | 127 + 21 + 17 + 2 | absente | à confirmer | harmoniser |
| `NTK Spectr`, `NTK Titri` | `mesures_idp_2024_qualite_marche_cadre` | variantes multiples | 39 + 21 | absente | à confirmer | harmoniser |
| `Phénol` / `indice de phénol M:A` | globale / marché cadre | variantes probables d’un même concept | 72 + 27 | absente | à confirmer | harmoniser ou distinguer |
| `MEST Filtr` | `mesures_idp_2024_qualite_marche_cadre` | paramètre non standardisé | 77 | absente | à confirmer | confirmer le libellé métier |

## Paramètres ambigus

Les paramètres ambigus ou à forte ambiguïté métier confirmés dans les tables IDP 2024 sont :

| Paramètre | Table | Problème | Volume | Décision attendue |
|---|---|---|---:|---|
| `Huiles Graisses (H G T)` | marché cadre | rapprochement probable avec `H_G` | 27 | valider le rattachement officiel |
| `PT DECANTE` | marché cadre | interprétation métier à confirmer | 4 | valider le sens métier |
| `DCO 2h décant.` / `DCO D 2h` | globale / marché cadre | variante analytique spécialisée | 6 | dire si à conserver comme variante ou comme paramètre distinct |
| `25°C` / `Cond 25°C...` | marché cadre | paramètre et unité mélangés | 39 | reconstruire un libellé propre |

## Paramètres non mappés

Comparaison entre les paramètres qualité IDP 2024 et `metadata.mapping_parametre_source` dans `abh_sad` :

- volume total de lignes qualité IDP non couvertes par le mapping actuel : `4 755`

Principaux paramètres non couverts détectés :

| Paramètre | Volume cumulé | Action recommandée |
|---|---:|---|
| `NH4+` et variantes | 354 | normaliser puis mapper |
| `NO3-_Spectro` et variantes | 131 | normaliser puis mapper |
| `SO4--` / `SO42-_IC` | 316 | harmoniser le libellé |
| `Ca++` | 278 | harmoniser le libellé |
| `Mg++` | 278 | harmoniser le libellé |
| `Cl-` / `Cl-_IC` | 316 | harmoniser le libellé |
| `K+`, `Na+` et variantes | 439 | harmoniser le libellé |
| `PO43-` | 240 | harmoniser le libellé |
| `Bilan_Ionique` | 117 | décider si ce calcul doit être conservé |
| `TA_*`, `TAC_*`, `TA/Tas_*`, `TAC/TACs_*` | 631 | décider si ces notations sont conservées ou regroupées |
| `MEST Filtr` | 77 | confirmer le libellé métier |
| `Chl a` | 38 | valider le code cible |
| `Mercure` / `Arsenic` / `Cadmium` / `Chrome` / `Cobalt` / `Cuivre` / `Fer` / `Nickel` / `Plomb` / `Sélénium` / `Zinc` | 88 | harmoniser les noms avec le référentiel |

## Paramètres avec unité absente

Les tables qualité IDP n’ont pas de colonne unité dédiée. Plusieurs unités semblent :

- absentes ;
- intégrées dans le nom du paramètre ;
- ou mélangées à une notation de méthode.

| Paramètre | Table | Problème unité | Exemple |
|---|---|---|---|
| `Cond 25°C *0,9*0,01` | marché cadre | unité dans le libellé | `Cond 25°C *0,9*0,01` |
| `Cond 25°C *1,1*0,01` | marché cadre | unité / facteur dans le libellé | `Cond 25°C *1,1*0,01` |
| `TA_°F`, `TAC_°F`, `TA/Tas_°F`, `TAC/TACs_°F` | globale / marché cadre | unité intégrée dans le nom | à normaliser |
| `TA_meq/l`, `TAC_meq/l`, `TA/Tas_meq/l`, `TAC/TACs_meq/l` | globale / marché cadre | unité intégrée dans le nom | à normaliser |

## Paramètres avec valeurs suspectes

### Valeurs nulles

- `11` lignes dans `mesures_idp_2024_qualite_marche_cadre` avec `val_qual` vide

Exemples :

- `PT DECANTE` à `AMONT STEP MECHRAA BEL KSIRI` le `2025-10-08`
- `pH au laboratoire` à `PONT KHENICHET` le `2025-10-08`
- `Bilan_Ionique` à `PUITS DOUAR BEL KOURA` le `2025-10-21`

### Valeurs non numériques

- `1 361` lignes dans `qualite_globale`
- `674` lignes dans `qualite_marche_cadre`

Exemples confirmés :

- `Ag = <0,010`
- `Ag = <0,0067`
- `Arsenic = <0,005`
- `Cadmium = <0,0005`
- `CF = 1,0.102`

Ces valeurs ne doivent pas être supprimées automatiquement. Elles relèvent plutôt de :

- seuil de détection ;
- codification labo ;
- notation mixte à normaliser.

## Recommandation de traitement

- quarantaine obligatoire :
  - paramètres non mappés
  - paramètres ambigus
  - valeurs non numériques
  - valeurs nulles sur paramètres métier importants
- aucune suppression directe recommandée à ce stade
