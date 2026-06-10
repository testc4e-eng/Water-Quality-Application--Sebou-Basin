# Plan dashboards modules en construction

## Objectif

Préparer des écrans honnêtes pour les modules non finalisés, sans tromper l'utilisateur sur leur niveau de maturité.

| Module | Statut | Ce qu’on peut afficher maintenant | Ce qu’on ne doit pas afficher | Prochaine étape |
| ------ | ------ | --------------------------------- | ----------------------------- | --------------- |
| SWAT | en construction | objectif du modèle ; dépendances métier ; scénarios détectés ; statut API ; derniers runs si disponibles ; message `validation Reda requise` | résultats présentés comme validés ; KPI décisionnels ; cartes interprétées comme officielles | définir contrat d'intégration et écran de statut |
| WASP | en construction | objectif du modèle ; segments/scénarios attendus ; disponibilité data ; statut `sandbox legacy` ; validations Anas requises | résultats décisionnels ; carte de qualité finale ; comparaison officielle réel vs modèle | définir contrat d'intégration et écran de statut |
| Moteur prédiction pollution | modèle à venir | objectif du moteur ; données nécessaires ; dépendances qualité/pollution ; readiness actuelle ; limites | score de prédiction fictif ; carte prédictive ; recommandations pseudo-scientifiques | cadrer périmètre et prérequis data |
| Recommandations pollution | en construction | logique prévue ; dépendances SWAT/WASP ; dépendances qualité données ; recommandations backend déjà disponibles en mode assisté | présenter un moteur de recommandations comme autonome et complet | exposer les recommandations comme bloc transversal avant d'en faire un module |

## SWAT

Statut : `EN_CONSTRUCTION`

Afficher :

- état du pipeline
- statut du routeur `/api/v1/swat/*`
- disponibilité ou non de `/api/v1/swat/analysis/*`
- scénarios détectés
- message clair `module en construction`

## WASP

Statut : `EN_CONSTRUCTION`

Afficher :

- scénarios disponibles
- segments/résultats attendus
- statut sandbox legacy
- validation métier requise
- message clair `module en construction`

## Moteur prédiction pollution

Statut : `MODELE_A_VENIR`

Afficher :

- objectif du modèle
- données nécessaires
- niveau de préparation
- limites actuelles
- prochaines étapes

## Recommandations pollution

Statut : `EN_CONSTRUCTION`

Afficher :

- module à venir
- logique prévue
- dépendances SWAT/WASP
- dépendances qualité données
- recommandations déjà calculées côté backend en mode assisté

## Règles UX

- Toujours afficher un badge `EN CONSTRUCTION` ou `MODELE A VENIR`
- Toujours expliquer la dépendance métier ou scientifique bloquante
- Ne jamais réutiliser un écran opérationnel existant comme faux écran SWAT/WASP
