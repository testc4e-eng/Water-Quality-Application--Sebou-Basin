# ML readiness

## Statut
`IN_PROGRESS__TEMPERATURE_READY__HYDRAULIC_BLOCKED`

## Prêt pour features
- Température journalière : 437889 lignes commitée, QA propre, lineage batch, période 1983-2026.
- Référentiel qualité : labels réglementaires possibles seulement sur 36 paramètres / 177 seuils actifs.
- Pollution IDP : DEV utile, mais préprod encore dépendante des arbitrages spatiaux et QA.

## Non prêt comme label ou contrainte physique
- Direction hydraulique : NOGO tant que MNT/DEM et validation réseau non réalisés.
- Paramètres observationnels non classifiables : utilisables comme features, jamais comme labels réglementaires.
- Types documentaires : exclus du scoring réglementaire.

## Prochaine architecture ML
1. Feature store météo/qualité/pollution avec `import_batch_id` et version réglementaire.
2. Labels qualité uniquement depuis version réglementaire active et seuils actifs.
3. Masques QA pour données `MANUAL_VALIDATED` et alias.
4. Pas de GNN hydraulique directionnel tant que `FLOW_VALIDATED_MNT` absent.
