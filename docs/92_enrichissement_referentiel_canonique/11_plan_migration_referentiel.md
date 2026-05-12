# Plan migration referentiel canonique

## Principe

La migration du referentiel doit etre separee des corrections de donnees. Le referentiel est enrichi en premier, puis les tables qualite sont rattachees uniquement par mappings surs ou valides.

## Phase 1 - Enrichissement referentiel

Objectif : completer `metadata.referentiel_parametre_canonique` sans modifier les mesures.

Actions proposees :

- ajouter les nouveaux parametres absents identifies dans le dictionnaire C4E ;
- enrichir les unites manquantes connues ;
- ajouter les alias historiques et laboratoire ;
- categoriser microbiologie, organoleptique, physicochimie, pollution, hydrologie et meteo ;
- conserver les anciens codes comme alias, jamais comme suppressions.

Statut requis avant execution : validation C4E du fichier `09_sql_enrichissement_referentiel_NON_EXECUTE.sql`.

## Phase 2 - Mappings surs

Objectif : rattacher les lignes qualite dont le mapping est unique et non ambigu.

Criteres :

- correspondance exacte avec `code_parametre` ;
- ou alias unique confirme ;
- une seule cible `parametre_ref_id` active ;
- unite compatible ou non bloquante.

Exemples : `COND`, `O2_DISSOUS`, `NO3`, `NO2`, `PO4`, `HCO3`, `SATURATION_OXYGENE`, `HG_MERCURE`, `Ammonium`, `Turbidite`, `H_G`.

## Phase 3 - Mappings probables

Objectif : traiter les anciens libelles ou abreviations connus mais non suffisamment surs pour correction automatique.

Cas resolus par le dictionnaire C4E :

- `RESIDUS_SECS` vers `RS105` ;
- `CR` vers `CRT` ;
- `DBO5_DEC2H` vers `DBO5` avec methode `DECANTE_2H` conservee ;
- `N_TOT` vers `AZOTE_TOTAL` ;
- `N_ORG` vers `AZOTE_ORG`.

## Phase 4 - Traitement ambigu

Objectif : bloquer les fusions hasardeuses.

Cas resolus par le dictionnaire C4E et a sortir des ambiguites :

- `NTK` -> `AZOTE_TOT_KJELD` ;
- `PT` -> `PHOSPHORE_TOTAL` ;
- `F` -> `F-` ;
- `SIO2` -> nouveau parametre `SIO2` ;
- `SIO3` -> enrichissement du parametre existant `SIO3`.

Cas a arbitrer encore :

- `MO_METAL` sans definition analytique stable ;
- `FM` / `F_M_mes` a ecarter ou valider cote client ;
- `MD` matieres decantables, unite et exposition a confirmer.

Sortie attendue : decision metier documentee avant tout update.

## Phase 5 - Ingestion future

Objectif : utiliser le referentiel comme moteur d'ingestion.

Regles :

- tout fichier entrant doit passer par normalisation alias ;
- tout parametre inconnu va en quarantaine ;
- toute unite divergente doit avoir une regle de conversion explicite ;
- aucun parametre ambigu ne doit etre insere comme actif sans decision.

## Phase 6 - Gouvernance continue

Objectif : maintenir un referentiel stable dans le temps.

Actions :

- versionner les decisions de mapping ;
- journaliser les ajouts d'alias ;
- auditer les parametres non utilises ;
- revoir periodiquement les categories dashboard et IA ;
- faire valider les extensions par C4E ou par le client selon le niveau metier.

## Decision

La sequence recommandee est :

1. enrichissement referentiel v2 ;
2. correction des mappings surs ;
3. validation C4E des mappings probables ;
4. arbitrage client des ambiguites ;
5. integration dans le futur module d'ingestion.
