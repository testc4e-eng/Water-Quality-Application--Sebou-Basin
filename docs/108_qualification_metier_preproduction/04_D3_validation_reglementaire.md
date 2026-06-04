# D3 - Validation réglementaire

## 1. Objet

Présenter le référentiel réglementaire qualité actuellement structuré et isoler uniquement les points nécessitant validation officielle.

## 2. Référentiel utilisé

### Faits vérifiés

- source réglementaire opérationnelle : Tableau n°1 - Grille générale d’évaluation de la qualité des eaux de surface ;
- schéma cible : `metadata` ;
- paramètres réglementaires retenus : `41` ;
- seuils opérationnels Tableau n°1 : `205` ;
- les arbitrages métier structurants du 2026-05-19 sont documentés comme clôturés dans `docs/92_referentiel_reglementaire_qualite_SAD/10_VALIDATIONS_METIER_RESTANTES.md`.

## 3. Seuils intégrés

### Faits vérifiés

- les décisions métier sur unités métaux, microbiologie, DBO5/DCO, alias `NO3` / `NO3-`, alias `O2_DISSOUS` / `O2_DISS`, `Hg` et palette qualité sont documentées ;
- le périmètre réglementaire final est : Tableau n°1 seul ;
- les grilles simplifiées sont documentaires et non opérationnelles.

## 4. Paramètres classifiables

Les paramètres classifiables sont ceux intégrés dans le référentiel réglementaire retenu et alignés avec le canonique.

## 5. Paramètres hors périmètre

### Faits vérifiés

Les paramètres hors périmètre moteur restent :

- stockables ;
- visualisables si présents ;
- non contributifs à la classification automatique.

## 6. Points nécessitant validation officielle

| Sujet | Fait vérifié | Validation attendue |
|---|---|---|
| Référentiel source officiel | Tableau n°1 seul | confirmation client/métier |
| Paramètres classifiables | liste structurée et alignée au canonique | confirmation officielle |
| Paramètres hors périmètre | stockables mais non classifiables | confirmation officielle |
| Usage des grilles simplifiées | documentaires uniquement | confirmation officielle |
| Déploiement préproduction | chargement et usage contrôlé avant préprod | validation client |

## 7. Recommandation C4E

- confirmer officiellement le périmètre Tableau n°1 ;
- confirmer la doctrine “hors périmètre = non classifiable automatiquement” ;
- ne pas ouvrir d’autre grille réglementaire avant clôture de cette validation ;
- considérer ce dossier comme une validation de gouvernance métier, non comme une correction technique.
