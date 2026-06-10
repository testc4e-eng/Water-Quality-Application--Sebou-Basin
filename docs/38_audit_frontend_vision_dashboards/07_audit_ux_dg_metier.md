# Audit UX DG / métier

## Contexte

La vision finale attend une lecture immédiate du bassin, des risques et des décisions. Le frontend actuel contient des écrans aboutis, mais la hiérarchie n'est pas encore totalement stabilisée pour un usage DG/métier.

## Analyse

- Clarté des menus : la navigation institutionnelle est meilleure que le legacy, mais des modules hétérogènes coexistent encore.
- Hiérarchie des modules : `Accueil`, `Carte Métier`, `Qualité`, `Pollution` sont cohérents ; `Analyses`, `Expert`, `Scénarios`, `Administration` restent mélangés entre finalisé, pilote et legacy.
- Vocabulaire : plusieurs labels sont clairs, mais `Expert`, `Scénarios SWAT/WASP`, `Ingestion modèles` et certains écrans legacy restent ambigus pour la DG.
- KPI trop techniques : `IFD`, `ICD`, `ICH`, `IPP`, `ISR` sont présents sans toujours suffire à eux seuls pour une lecture métier immédiate.
- Modules visibles mais non prêts : `Scénarios SWAT / WASP`, `Pollution` dans sa version actuelle, `Ingestion modèles`.
- Messages pédagogiques : présents dans certains écrans, mais pas uniformes.
- Statut projet : absent de l'accueil DG.

## Diagnostic

| Sujet | Constat | Impact DG / métier | Recommandation |
| ----- | ------- | ------------------ | -------------- |
| Menu principal | mélange finalisé / test / legacy | confusion de périmètre | ajouter badges de statut et réordonner la navigation |
| Accueil DG | bon niveau visuel, mais pas de statut projet | vision partielle de l'avancement réel | ajouter `avancement`, `décisions attendues`, `modules prêts` |
| Analyses | trop générique | faible lisibilité non experte | réserver l'écran aux analystes |
| Scénarios | faux sentiment de disponibilité | risque de mauvaise interprétation | écran `en construction` |
| Administration | mélange module 114 et legacy | confusion de gouvernance | recentrer sur `data-admin` |
| Reporting | pas de parcours dédié | restitution DG moins fluide | créer un support ou mode de restitution intégré |

## Solution

Proposer explicitement :

- une page `Accueil DG`
- une page `Avancement métier`
- une page `Modules finalisés`
- une page `Modules en construction`
- une page `Décisions restantes`

## Recommandation de structure UX

1. `Accueil DG`
2. `Qualité des Eaux`
3. `Carte Métier`
4. `Pollution`
5. `Analyses`
6. `Administration`
7. `Avancement & décisions`

## Messages pédagogiques à systématiser

- `Module opérationnel`
- `Module partiel`
- `Module en construction`
- `Données en validation`
- `Résultats non validés scientifiquement`

## Améliorations optionnelles

- Ajouter un `Project status ribbon` global.
- Ajouter un panneau `Ce qui est prêt / Ce qui ne l'est pas`.
