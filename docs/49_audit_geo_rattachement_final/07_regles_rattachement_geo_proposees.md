# Regles de rattachement geographique proposees

## Priorites de rattachement

1. Code/IRE stable de reference quand il existe (`ire_station`, `ire_precipitation`, `ire`, `ire_source`, `code_pt_eau`, `code_rejet`, `code_step`, `code_stm`, `code_decharge`, `code_mine`, `code_huilerie`, `code_abattoir`, `code_nappe`).
2. ID interne deja consolide dans `infra` ou `geo` si un mapping stable existe.
3. Nom normalise uniquement en fallback, jamais en premiere intention.
4. Coordonnees uniquement en fallback si le code est absent et si la distance est inferieure a un seuil documente.

## Fallbacks proposes

- Station sans code mais avec nom et geom : rattachement par nom normalise + distance <= 100 m, sinon quarantaine.
- Barrage sans IRE mais avec nom : rattachement par nom normalise si homonymie absente, sinon blocage.
- Point pollution non localise : ne pas migrer en final sans entite support valide.
- IDP 2024 avec colonne `ire` : rattacher seulement si l'IRE correspond a une seule classe (`station`, `barrage` ou `source`).

## Seuils de distance recommandes

- < 20 m : quasi-doublon probable.
- 20 a 50 m : doublon metier probable a arbitrer.
- 50 a 100 m : rapprochement faible, validation humaine necessaire.
- > 100 m : ne pas forcer le rattachement par distance.

## Regles de blocage

- Homonyme avec plusieurs codes actifs : blocage.
- Code absent + nom absent + coordonnees absentes : orphelin certain.
- Geometrie invalide ou hors bassin sans justification : a corriger avant migration finale.
