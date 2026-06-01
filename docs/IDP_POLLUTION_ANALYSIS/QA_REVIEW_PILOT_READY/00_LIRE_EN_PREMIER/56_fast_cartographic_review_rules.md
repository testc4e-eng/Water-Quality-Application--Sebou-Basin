# Regles rapides de revue cartographique

## Objectif

Reduire la revue metier aux cas visuels rapides, sans analyse attributaire lourde et sans fusion automatique.

## Buckets P0

| Bucket | Condition | Interpretation | Suggestion systeme | Decision reviewer autorisee |
|---|---|---|---|---|
| `EXACT_0M` | distance = 0 m et meme famille metier | meme objet tres probable | `ACCEPT_MATCH` | `ACCEPT_MATCH`, `SAME_SITE_DIFFERENT_OBJECT` |
| `VERY_CLOSE_2M` | 0 < distance <= 2 m | meme objet possible | `NEED_REVIEW` | `ACCEPT_MATCH`, `KEEP_SEPARATE`, `NEED_FIELD_VALIDATION` |
| `DIFFERENT_OBJECT` | distance = 0 m et familles metier differentes | meme emplacement, objets distincts | `SAME_SITE_DIFFERENT_OBJECT` | `SAME_SITE_DIFFERENT_OBJECT`, `KEEP_SEPARATE` |
| `ORPHAN` | pas de master candidat exploitable | source a corriger ou geometrie invalide | `WAIT_SOURCE_FIX` ou `INVALID_GEOMETRY` | `WAIT_SOURCE_FIX`, `INVALID_GEOMETRY` |

## Regles de decision

### `EXACT_0M`

- Si la source et le candidat representent le meme objet metier : `ACCEPT_MATCH`.
- Si la superposition correspond a deux objets metier distincts : `SAME_SITE_DIFFERENT_OBJECT`.
- Aucune fusion immediate : la decision autorise seulement une fusion future tracee.

### `VERY_CLOSE_2M`

- Si le decalage est explicable et l'objet est le meme : `ACCEPT_MATCH`.
- Si deux objets proches doivent rester distincts : `KEEP_SEPARATE`.
- Si la carte ne suffit pas : `NEED_FIELD_VALIDATION`.

### `DIFFERENT_OBJECT`

- Cas typiques : STEP + rejet, point de mesure + source pollution, inventaire + mesure.
- Decision par defaut : `SAME_SITE_DIFFERENT_OBJECT`.
- Ces objets doivent etre lies spatialement plus tard, pas fusionnes.

### `ORPHAN`

- `WAIT_SOURCE_FIX` si la source doit etre completee ou corrigee.
- `INVALID_GEOMETRY` si la geometrie est inexploitable.

## Cas hors workflow principal

Les distances strictement superieures a 2 m sont exclues de la revue P0. Elles restent dans les tables QA completes et sont considerees `KEEP_SEPARATE` par defaut tant qu'aucun besoin metier ne les remonte.

## Champs a renseigner dans QGIS

Le reviewer renseigne seulement :

- `business_decision`
- `comments`

Les autres champs restent des aides de lecture ou des identifiants techniques pour ingestion future.
