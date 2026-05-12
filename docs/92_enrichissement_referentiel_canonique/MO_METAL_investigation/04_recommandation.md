# Recommandation MO_METAL

## Decision cible

`CLIENT_REQUIRED`

## Justification

`MO_METAL` n'est pas resolu par le tableau metier C4E, n'est present que sur 11 lignes, et son contexte ne permet pas un rattachement fiable a un parametre canonique existant.

## Action recommandee

| Action | Statut |
|---|---|
| ne pas mapper automatiquement | obligatoire |
| exclure dashboards consolides | recommande |
| conserver en backlog client | obligatoire |
| demander definition analytique | obligatoire |
| garder les lignes source intactes | obligatoire |

## Option si le client ne repond pas

Classer `MO_METAL` en `QUARANTAINE` pour ingestion et IA :

- non expose dashboard ;
- non utilise dans les agregations qualite ;
- conserve dans les exports detail si besoin de tracabilite ;
- reouvert uniquement avec decision metier.

