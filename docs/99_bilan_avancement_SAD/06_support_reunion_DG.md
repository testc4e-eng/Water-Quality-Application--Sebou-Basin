# Support réunion DG - SAD Sebou

## 1. Message d'ouverture

Le projet SAD Sebou est **reellement avance**. Le socle technique et data existe, la migration et les controles ont ete realises, et les sujets restants relevent principalement **d'arbitrages metier, de validations scientifiques et de stabilisation preproduction**.

## 2. Avancement global

- **68% d'avancement global estimé**
- **Socle data et applicatif : avancé**
- **Mise en production métier complète : non atteinte**

## 3. Comparaison avec le CPS initial

### Couvert

- architecture full web ;
- base centralisée ;
- sécurité, rôles, logs ;
- dashboards et cartographie ;
- intégration d'un volume important de données métier.

### Partiellement couvert

- intégration des modèles ;
- aide à la décision pleinement stabilisée ;
- reporting/extractions homogènes ;
- préproduction qualifiée ;
- responsive/mobile démontré.

### Non encore couvert de manière officielle

- usage décisionnel SWAT/WASP ;
- pollution IDP en préprod stabilisée ;
- industrialisation complète ingestion V1.

## 4. Chantiers clôturés

- migration historique ;
- socle sécurité / administration ;
- ingestion température ;
- APIs spécialisées qualité P0.

## 5. Chantiers en cours

- dashboard cartographique métier ;
- dashboard qualité réglementaire ;
- référentiel paramètres ;
- référentiel réglementaire ;
- validation hydraulique ;
- pollution IDP ;
- stabilisation backend/frontend hors legacy.

## 6. Chantiers non démarrés ou non officialisés

- SWAT officiel ;
- WASP officiel ;
- feature store officiel ;
- reporting final homogène ;
- exploitation mobile qualifiée.

## 7. Décisions métier attendues

1. Arbitrage spatial IDP.
2. Gel du dictionnaire paramètres.
3. Validation réglementaire officielle.
4. Statut de préproduction des modules P0.
5. Statut officiel ou non de SWAT/WASP.

## 8. Risques majeurs

1. Confusion entre démo DEV et module officiellement exploitable.
2. Lecture incorrecte d'arbitrages métier en attente comme si le projet etait techniquement en retard.
3. Dette backend legacy `public.*`.
4. Usage trop précoce de SWAT/WASP.
5. Validation hydraulique incomplète.

## 9. Dépendances SWAT

- validation Reda ;
- scénarios ;
- calibration ;
- unités ;
- mappings métier.

## 10. Dépendances WASP

- validation Anas ;
- segments ;
- unités ;
- outputs ;
- scénarios.

## 11. Plan d'action 30 jours

- arbitrer IDP ;
- figer les paramètres ;
- valider le réglementaire ;
- choisir le périmètre préprod ;
- lancer la purge legacy critique.

## 12. Plan d'action 60 jours

- stabiliser API et dashboards P0 ;
- faire les tests navigateur/backend réel ;
- finaliser les warnings/statuts réglementaires ;
- poursuivre la validation hydraulique ;
- qualifier ingestion V1.

## 13. Plan d'action 90 jours

- décider le go/no-go de préproduction ;
- formaliser le statut SWAT/WASP ;
- publier la matrice de modules exploitables ;
- préparer le dossier de bascule ou le lot complémentaire.

## 14. Avancement ML / prédiction pollution

### Message clé

Le projet a franchi une étape scientifique importante : les tests **ML tabulaires** ont montré qu’un signal existe, mais qu’un modèle fiable nécessite l’intégration de la **topologie hydrologique** via **Graph Snapshot**.

### Faits vérifiés

- benchmark **ML tabulaire** documenté ;
- limites du **modèle temporel** identifiées ;
- transition **Graph Snapshot** justifiée ;
- phase E1.5 recommandée.

### Décision documentaire

Statut actuel : **expérimental**, `SANDBOX`, `RECHERCHE_APPLIQUEE`, `NON_PREPROD`.

### Prochaine étape

Engager **Graph Snapshot V0** avant tout nouveau modèle avancé de **prédiction pollution**.

## 15. Décision recommandée à la DG

**Décider que les 90 prochains jours servent à qualifier l'existant, fermer les arbitrages metier prioritaires et consolider la preproduction, sans elargir le perimetre fonctionnel.**
