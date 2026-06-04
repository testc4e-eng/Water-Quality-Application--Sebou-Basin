# Architecture métier cible

## Objectif

Construire un parcours d'accueil qui répond en moins de 30 secondes à :

- que se passe-t-il aujourd'hui sur le bassin ;
- où sont les points de vigilance ;
- quelles entités nécessitent une action ;
- quel est le niveau de confiance de l'information.

## Modèle opérationnel cible

### Niveau 1 — supervision quotidienne

Le home doit être alimenté uniquement par les flux opérationnels :

- barrages ;
- hydro ;
- pluvio ;
- qualité journalière.

### Niveau 2 — investigation métier

Le home doit permettre de basculer vers :

- `Carte Métier`
- `Qualité des Eaux`
- `Pollution`

### Niveau 3 — expertise

Les données secondaires restent accessibles mais non centrales :

- campagnes ;
- historiques étendus ;
- référentiels ;
- SWAT ;
- WASP ;
- diagnostics techniques.

## Écran d'accueil cible

### Hero

Titre :

`Système d'Aide à la Décision pour la Qualité des Eaux du Bassin du Sebou`

Sous-titre :

`Surveillance hydrologique, qualité des eaux et aide à la décision en temps quasi réel.`

Cartes synthétiques :

- barrages surveillés ;
- stations hydro ;
- stations pluvio ;
- stations qualité.

Règle :

- ces cartes doivent afficher des **comptes opérationnels réels** ;
- elles ne doivent pas afficher des comptes référentiels gonflés par l'historique.

### Carte métier

La carte devient l'élément principal du home.

Couche par défaut :

- barrages ;
- hydro ;
- pluvio ;
- qualité.

Couche secondaire désactivée :

- rejets ;
- campagnes ;
- SWAT ;
- WASP ;
- historique.

### Situation du bassin

Trois blocs :

- hydrologie ;
- pluviométrie ;
- qualité.

Ils doivent résumer :

- état ;
- variation récente ;
- tendance courte.

### Alertes

Le bloc alertes ne doit jamais être caché.

Types retenus :

- `HYDRO`
- `PLUVIO`
- `QUALITE`
- `BARRAGE`

### Tendances

Le bas d'écran doit montrer des graphes courts et lisibles :

- débit ;
- précipitations ;
- apports barrages ;
- qualité synthétique.

## Personas métier

### DG

Voit :

- état global ;
- exceptions ;
- tendances ;
- actions recommandées.

Ne voit pas :

- IDs ;
- QA détaillée ;
- référentiels ;
- détails d'import ;
- couches legacy.

### Exploitant métier

Voit :

- entités actives ;
- seuils d'alerte ;
- dernière mise à jour ;
- tendance locale ;
- lien vers le module détaillé.

### Expert

Sort du home pour aller dans les écrans spécialisés.

## Décision métier clé

Le home ne doit plus être un résumé du système.

Le home doit être un résumé du **bassin en fonctionnement**.
