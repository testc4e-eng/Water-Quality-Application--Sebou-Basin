# Diagnostic lenteur menu

## Constat

Le menu observatoire historique mélange plusieurs responsabilités :

- couches GEO ;
- hiérarchie métier distante ;
- paramètres ;
- valeurs ;
- légendes ;
- statistiques ;
- construction de couche carte.

Dans `Dashboard2`, les appels de hiérarchie `/observatory/*` sont liés au parcours guidé historique. Cette logique peut générer des chargements en cascade et rendre l'ouverture perçue du menu lente, surtout pour `Qualité mesurée`.

## Cause fonctionnelle

| Cause | Effet |
|---|---|
| Catalogue chargé depuis API au lieu d'un référentiel léger local | Spinner ou liste vide au démarrage. |
| Sélection famille/paramètre couplée au chargement valeurs | Trop de requêtes précoces. |
| GEO et valeurs métier mélangées | UX confuse et composants difficiles à optimiser. |
| Absence de distinction `module à venir` | Risque de spinner infini pour familles non exposées. |

## Décision

Créer un menu V2 isolé :

- catalogue métier local instantané ;
- familles P0 actives uniquement si endpoint spécialisé disponible ;
- familles P1/P2 affichées en `à venir` ;
- requêtes valeurs déclenchées uniquement après clic sur `Afficher`.
