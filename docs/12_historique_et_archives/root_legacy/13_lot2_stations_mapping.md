# LOT 2 : Plan de Mappage et Définition de Rapprochement — Stations

## 1. Contexte opérationnel
- **Table Source (Sandbox)** : `abh_sebou_070426.public.infra_stations_abhs`
- **Table Cible (Prod)** : `abh_sad.infra.stations_mesure`

## 2. Clé de Rapprochement (Pipeline Décisionnel)
Face à l'hétérogénéité des référentiels (doublons intra-noms reportés au registre, champs codes absents), la validation d'intégration (`UPDATE` ou `IGNORE`) est assurée par un pipeline dégradatif sécurisé en deux étapes.

### Étape 1 (Clé Primaire) : Rapprochement Algorithmique par CODE
- **Colonne évaluée Source** : `ire_station` (ou `ire_precipitation` si `ire_station` est NULL).
- **Colonne évaluée Cible** : `code_station`.
- **Règle** : Si les codes coïncident strictement, le rapprochement est entériné. C'est l'identifiant le plus robuste contre les homonymes.

### Étape 2 (Fallback Heuristique) : Rapprochement Géo-Nominal
- Si le code de la station est nul dans la source (`ire_station == NULL`) ou absent de la prod :
- **Clé de fallback** : Normalisation typographique de `nom_station` ET confirmation de sa géolocalisation spatiale réelle.
- **Règle** : Un nom source identique au nom cible n'est MATCHÉ explicitement **QUE SI** la distance Haversine avec le point `geom` cible est strictement `< 1000m`.

## 3. Stratégie Sectorielle sur Anomalies (Registre *15_registre_anomalies_metier.md*)

| Anomalie du Registre | Comportement UPSERT imposé (Dry-Run & Run) | Motif Régulatoire |
|---|---|---|
| `ANO-LOT2-002` (Nom NULL) | 🟩 **WOULD_SKIP** (Ignorer) | Évite polluer la prod de points mystères inaffichables. |
| `ANO-LOT2-001` (Doublons nominaux) | 🟥 **WOULD_CONFLICT** (Bloquer) | La multiplicité sans clef fiable (2 noms identiques non isolables par code) annule toute écriture auto. |

## 4. Colonnes et Structuration

Le mapping Source -> Cible est dégradé. Les attributs bruts non réductibles dans la Cible ne seront pas conservés.

- `ire_station` ➔ `code_station` (String)
- `nom_station` ➔ `nom` (String)
- `type_station` ➔ `type_station` (String)
- `coord_x`, `coord_y` / `geom` ➔ `geom` (PostGIS ST_Point)
- *Autres colonnes sources (ex: `etat`, `observation`, `types_mesures`) -> ignorées ou mappées vers des tables jointes métadonnées si justifié plus tard.*

## 5. Critères exacts des seaux de Dry-Run

- 🟦 **WOULD_INSERT** (Nouveau) : La station (Code exclusif) ET son nom normalisé sont introuvables côté Cible.
- 🟨 **WOULD_UPDATE** (Enrichissement) : Match via Pipeline (Clé 1 ou 2) avec constations d'un attribut différent sur la prod (ex: coordonnée plus précise, `type_station` différent). Sauf code/nom qui régissent l'identité.
- 🟩 **WOULD_SKIP** (Synchrone parfait ou Élection d'esquive) : Statut donné si la source lève l'exception "Nom Null" ou si un record correspond au point par point aux identités et features sur ABH_SAD.
- 🟥 **WOULD_CONFLICT** (Dépassement de sécurité) : Toute non-résolution flagrante: Une source pour >= 2 entités cibles, un match nom où la distance est explosive `> 1000m`, ou un doublon source nom+code inévaluable.
