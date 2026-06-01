# Modes d'affichage carte / tableau / graphique

## Contexte

Une seule représentation ne suffit pas pour couvrir décision rapide, analyse détaillée et contrôle source.

## Solution

### Carte

- rôle : synthèse spatiale ;
- contenu : supports, points thématiques, lecture rapide ;
- usage : vue décisionnelle et analyse.

### Tableau

- rôle : détail vérifiable ;
- contenu : date, support, paramètre, valeur, QA ;
- usage : analyse métier et contrôle campagne.

### Graphique

- rôle : tendance temporelle ;
- contenu : agrégation moyenne sur la page chargée ;
- usage : comparaison rapide par période.

## Règles UX

- la carte est visible dès l'ouverture comme fond de lecture ;
- aucun chargement de données tant que l'utilisateur n'a pas cliqué sur `Afficher` ;
- la table et le graphique changent sur action utilisateur, jamais automatiquement au changement de filtre.
