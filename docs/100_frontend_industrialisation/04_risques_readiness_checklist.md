# Risques, readiness et checklist

## Risques

| Risque | Impact | Gravité | Réponse |
|---|---|---|---|
| refactor brutal Dashboard2 | régression cartographique | élevée | extraction progressive |
| duplication routeur | divergence comportement | moyenne | consolider sans suppression brutale |
| gros bundle | temps de chargement | élevée | lazy loading et découpage |
| tables non virtualisées | UI lente | moyenne | virtualisation ciblée |

## Readiness

- industrialisation frontend : `GO_CONCEPTION_DETAILLEE`
- réduction bundle : `READY_FOR_BACKLOG`
- refactor progressif : `READY_WITH_GUARDRAILS`

## Checklist validation

| Question | Oui/Non | Commentaire |
|---|---|---|
| Les gros écrans sont-ils identifiés ? | | |
| La stratégie lazy loading est-elle validée ? | | |
| La pagination serveur est-elle homogène ? | | |
| Les tableaux à virtualiser sont-ils priorisés ? | | |
| Les routes legacy restent-elles intactes ? | | |
