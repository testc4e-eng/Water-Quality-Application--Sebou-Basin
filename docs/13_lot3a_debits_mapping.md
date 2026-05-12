# LOT 3A : Mapping Technique (Chroniques Hydrologiques - Débits)

## 1. Contexte Dimensionnel
Ce document d'Architecture et d'Ingestion encadre le transfert volumineux des quantités hydrauliques du réseau (rivières, écoulements), réparti en deux granulométries (journalière et mensuelle). 

## 2. Table de Mappage Structurelle (Source vers Prod)

### Flux 1 : Métrique Journalière / Infrajournalière
- **Table Source (Sandbox)** : `abh_sebou_070426.public.mesures_debit_jr`
- **Table Cible (Prod)** : `abh_sad.hydro.mesure_debit`

**Mappage des Colonnes :**
* `date_jr` ➔ `temps` (Timestamp clé temporel)
* *(Jointure sur `infra.stations_mesure` pour conversion)* `ire_station` ➔ `station_id` (Integer Clé Étrangère)
* `debit_jr` ➔ `valeur` (Double Métrique)

### Flux 2 : Métrique Mensuelle (Agrégée)
- **Table Source (Sandbox)** : `abh_sebou_070426.public.mesures_debit_m`
- **Table Cible (Prod)** : `abh_sad.hydro.mesure_debit_mensuel`

**Mappage des Colonnes :**
* Dérivation de `annee` et `mois` ➔ `bucket_month` (Type Date : `YYYY-MM-01`)
* `ire_station` ➔ `station_id` (Integer Clé Étrangère par rapport à la liaison géospatiale)
* `debit_m` ➔ `valeur_moy_m3s` (Double Métrique)

## 3. Clé Temporelle Unifiée et Comportement (Idempotence)
Le modèle est strictement idempotent.
**Clé composite de déduplication :** L'unicité absolue n'est conférée que par le pôle : `[station_id, temps]`. 
- Tout enregistrement d'une date X sur une station Y n'apparaîtra qu'une seule fois dans la table de production.

## 4. Politique Gouvernementale sur les Carences (Orphelins & Négatifs)

Dans un arbitrage strict de la conception de la base de production, le système imposera les dogmes suivants :

- **Règle sur les Valeurs Négatives (`ANO-LOT3A-001`)** : Les relevés de débits inhérents en deça de `0` NE DOIVENT PAS corrompre un refus (`CONFLICT`). Ils transiteront parfaitement.
   ⚡ **L'Action :** Lors de l'écriture en production, le signal booléen `qa_flag_negative` sur ces rows passera explicitement à `TRUE`. Cet identifiant technique garantira au Front-End de les éclipser systématiquement des requêtes analytiques (Somme Volumétrique Annuelle API) mais informera l'hydrologue d'une avarie au capteur.

- **Règle Nominative de Liaison Station (Lot 2 Dependency)** : Aucun UPSERT hydrologique s'il n'est pas lié à une station infra vérifiée. La résolution se fera en croisant le code brut à l'ID formel.

## 5. Critères de Ventilation du Dry-Run

* 🟦 **WOULD_INSERT** : Évidente nouveauté temporelle. Le capteur (station) a poussé un timestamp inéistant d'office pour lui dans la BDD prod. Injection saine de la volumétrie sur la Cible et levé des Flags le cas échéant.
* 🟨 **WOULD_UPDATE** : Ligne temporelle existante MAIS la grandeur volumétrique diverge entre la Prod et la Sandbox. On proposera l'écrasement en faveur de la Sandbox.
* 🟩 **WOULD_SKIP** : La ligne (`station_id`, `temps`) existe et la quantité d'eau en cube (`valeur`) est stricto-sensuelle la même. Inutile d'exécuter une translation I/O PostgreSQL. 
* 🟥 **WOULD_CONFLICT** : Si le Code Station `ire_station` porté par la mesure refuse de matcher avec le dictionnaire matriciel mis en place lors de lot 2, elle sera un déchet insoluble.
