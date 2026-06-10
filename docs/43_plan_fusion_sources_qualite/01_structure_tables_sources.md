# Structure des Tables Sources

## Comparaison des schémas logiques

| Colonne logique | mesure_qualite_sebou | mesure_qualite_riviere | suivi_garde | mesure_qualite_barrage | Compatible ? |
| --------------- | -------------------- | ---------------------- | ----------- | ---------------------- | ------------ |
| **Identifiant station** | `ire_station`, `station_id` | `ire_station`, `station_id` | `code_station` | `ire_station`, `station_id` | OUI (Besoin de standardiser la FK vers `api.v_station_dimension`) |
| **Date de mesure** | `temps` (timestamp/date) | `temps` (timestamp/date) | `date_prelevement` | `temps` (timestamp/date) | OUI (Renommage nécessaire pour `suivi_garde`) |
| **Paramètre** | `parametre_qualite` | `parametre_qualite` | `parametre_qualite` | `parametre_qualite` | OUI |
| **Valeur** | `valeur` (numeric/float) | `valeur` (numeric/float) | `valeur` (numeric/float) | `valeur` (numeric/float) | OUI |
| **Unité** | `unite` | `unite` | `unite` | `unite` | OUI |
| **Validité** | `est_valide` (bool) | `est_valide` (bool) | Non présent ou différent | `est_valide` | OUI (Mettre à jour `suivi_garde` pour s'aligner) |
| **QA Flags** | `qa_flag_*` | `qa_flag_*` | Absent | Absent | OUI (Généraliser au modèle cible) |
| **Clé primaire** | `id` (uuid/serial) | `id` (uuid/serial) | `id` | `id` | OUI |

## Relations
Toutes ces tables, à l'exception potentielle de `suivi_qualite_barrage_garde_hebdo` (qui utilise un `code_station` arbitraire), ont une relation logique forte avec `infra.stations_mesure` et `api.v_station_dimension`. L'unification structurelle est donc très favorable.
