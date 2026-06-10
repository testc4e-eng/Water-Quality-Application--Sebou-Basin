# Limites restantes

## Limites backend / environnement

- le backend local accessible sur `127.0.0.1:8000` ne correspond pas à l’API SAD attendue ;
- les endpoints dashboards n’ont donc pas pu être validés en exécution réelle contre la bonne instance.

## Limites fonctionnelles assumées

- `SWAT` et `WASP` restent en construction ;
- la `Prédiction pollution` reste hors périmètre ;
- les `Recommandations autonomes` ne sont pas exposées comme module ;
- le `Reporting autonome` reste hors périmètre.

## Limites data / métier

- le référentiel réglementaire reste à confirmer côté métier pour un usage PREPROD complet ;
- le module pollution reste en statut `DEV / TOPOLOGIQUE / NON HYDRAULIQUE SCIENTIFIQUE` ;
- les indicateurs DG sur `paramètres non mappés`, `nulls`, `extrêmes`, `entités ambiguës` ne sont pas tous exposés par des compteurs runtime dédiés.

## Limites UX

- certaines routes legacy existent encore mais sont déclassées plutôt que supprimées ;
- `Stations` et `Barrages` restent intégrés comme sous-vues et non comme modules lourds séparés.
