# Hiérarchie d’information des dashboards

## Principe

Chaque dashboard doit suivre la hiérarchie :

1. message métier principal
2. KPI / carte / tendance
3. filtres utiles
4. informations complémentaires
5. détails expert
6. détails techniques admin

## Dashboard qualité

### Niveau 1

- classe qualité actuelle.
- stations surveillées.
- tendances par paramètre classifiable.

### Niveau 2

- paramètre sélectionné.
- dernière valeur.
- historique.
- version réglementaire active.

### Niveau 3

- section `Informations complémentaires` :
  - paramètres observationnels
  - exclusions réglementaires résumées

### Niveau 4 expert

- seuils exclus.
- périmètre actif.
- couverture stations/mesures.

## Dashboard température

### Niveau 1

- tendance climatique.
- `T_MIN`, `T_MAX`, `T_MOY`.
- comparaison temporelle.

### Niveau 2

- station, période, sous-bassin.

### Niveau 3 expert

- couverture temporelle.
- trous de données majeurs.
- statut de validation station.

### Niveau 4 admin

- batch, lineage, import QA.

## Dashboard pollution

### Niveau 1

- sites pollution.
- derniers résultats.
- tendance simple.

### Niveau 2

- carte et popup.
- message discret :
  `Routage basé sur le réseau actuel – validation hydraulique scientifique en cours.`

### Niveau 3 expert

- contrat runtime.
- confiance de routage.
- limites topologiques.

### Niveau 4 admin

- QA topology.
- fallback.
- composants réseau.

## Dashboard hydraulique

### Version métier

- couverture bassin.
- segments validés.
- état global du réseau.

### Version expert

- segments suspects.
- segments plats.
- statuts `FLOW_REVERSED_SUSPECTED`, `FLAT_SEGMENT`, `LOW_SLOPE_UNCERTAIN`.

### Version admin

- table QA complète.
- export arbitrage.
- logs d’exécution.
