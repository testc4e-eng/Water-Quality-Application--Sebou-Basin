# Impact dashboards et IA

## Dashboards qualite

L'enrichissement du referentiel permet de stabiliser les libelles, les unites et les regroupements metier.

Impacts attendus :

- reduction des parametres orphelins dans les vues qualite ;
- regroupement fiable des variantes historiques sous un code canonique ;
- labels dashboard coherents pour les parametres microbiologiques et organoleptiques ;
- distinction explicite entre physicochimie, microbiologie, pollution et hydrologie ;
- meilleure detection des series non comparables a cause d'unite ou methode differente.

Point de vigilance : les parametres ambigus doivent rester exclus des indicateurs consolides tant qu'ils ne sont pas arbitres.

## Analytics

Le referentiel v2 devient une couche de semantique pour les analyses.

Apports :

- filtrage par domaine, sous-domaine, famille et type ;
- controle unite avant agregation ;
- separation des parametres mesures, calcules et QA ;
- preparation des indicateurs multi-stations et multi-periodes ;
- meilleure tracabilite des anciens codes.

## QA

Le referentiel enrichi devient le point d'entree des controles automatiques.

Controles facilites :

- parametre actif sans unite ;
- alias collisionnel ;
- unite incompatible avec parametre ;
- parametre utilise en table finale mais absent du referentiel ;
- parametre actif non rattache a une table cible ;
- valeurs numeriques attendues mais non numeriques en source.

## IA / LLM

Le referentiel enrichi augmente la fiabilite des usages IA.

Usages cibles :

- recherche semantique de parametres ;
- explication des indicateurs qualite ;
- aide au mapping ingestion ;
- detection des synonymes ;
- generation de rapports metier ;
- reponses contextualisees avec unites et limites.

Risque a maitriser : sans statut de validation et alias historises, l'IA peut fusionner des parametres distincts. Le dictionnaire C4E resout `NTK`, `PT`, `F`, `SIO2`, `SIO3`, `DBO5_dec2h`, `PT decante`, `CR/CrT` et les principaux microbiologiques. Les seuls cas qui doivent rester marques comme ambigus sont `MO_METAL`, `FM/F_M_mes` et `MD`.

## Ingestion

Le dictionnaire alias permet un workflow robuste :

1. normaliser le libelle source ;
2. chercher alias exact ;
3. verifier unite ;
4. appliquer conversion explicite si elle existe ;
5. rejeter en quarantaine si ambigu ou inconnu ;
6. journaliser la decision.

## Comparaisons historiques

Les anciens codes ne doivent pas etre supprimes. Ils doivent etre conserves comme alias legacy pour maintenir la lecture des donnees historiques et eviter les ruptures dans les series longues.

## SWAT / WASP futurs

Les sorties SWAT/WASP futures devront s'appuyer sur le meme referentiel pour :

- eviter la duplication de parametres ;
- harmoniser les unites ;
- differencier mesure terrain et sortie modele ;
- gerer les scenarios ;
- documenter les conversions.

## Decision

L'enrichissement est compatible avec les dashboards et l'IA a condition de traiter en deux niveaux :

- mappings surs utilisables immediatement apres validation ;
- mappings probables/ambigus maintenus hors consolidation jusqu'a arbitrage.
