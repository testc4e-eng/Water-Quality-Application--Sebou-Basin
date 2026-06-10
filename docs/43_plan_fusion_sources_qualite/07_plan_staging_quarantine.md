# Stratégie de Staging & Quarantine

Afin de sécuriser la fusion, les données conflictuelles ou douteuses ne seront pas injectées directement dans la table unifiée. Elles transiteront par les tables de staging suivantes :

- `staging.qualite_mesures_a_fusionner` : Réceptacle brut temporaire avant la routine de nettoyage.
- `staging.qualite_mesures_redondantes` : Reçoit les doublons métiers forts (Même IRE, Param, Date, Valeur) détectés entre `riviere` et `sebou`.
- `staging.qualite_mesures_conflits` : Reçoit les valeurs divergentes (Même IRE, Param, Date mais valeurs/unités divergentes).
- `staging.qualite_mesures_non_mappees` : Reçoit les lignes avec `ire_station` introuvable ou `parametre_qualite` absurde.
- `staging.qualite_mesures_a_valider_metier` : Fourre-tout pour les cas extrêmes (valeurs aberrantes, négatives).

## Règles de Routage

**À envoyer en staging** :
- Doublons probables.
- Valeurs divergentes.
- Paramètres non mappés.
- Unités incohérentes.
- Stations sans mapping (vieux historiques de `mesure_qualite_riviere`).
- Support ambigu.

**Supprimable seulement après validation** :
- Doublons exacts (hash identique).
- Lignes totalement vides (NULL sur la valeur).
- Erreurs techniques confirmées (ex: timestamp 1970 par défaut).

**À conserver en base unifiée** :
- Données historiques (Même vieilles, si IRE et paramètre sont valides).
- Mesures divergentes mais plausibles (Arbitrées au préalable).
- Données barrage.
- Données garde.
- Données sentinelles.
