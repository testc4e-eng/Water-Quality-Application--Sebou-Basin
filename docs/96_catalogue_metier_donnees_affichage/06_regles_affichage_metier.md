# Règles d'affichage métier

## Principes directeurs

- afficher d'abord ce qui aide à décider ;
- reléguer le détail au clic et au filtre ;
- séparer clairement récent, historique, campagne et archive ;
- ne jamais mélanger les familles de paramètres si cela casse la lecture métier ;
- ne jamais charger massivement sans action explicite.

## Ce qui doit apparaître immédiatement

- fond cartographique ;
- choix de vision métier ;
- filtres principaux ;
- message d'état si aucune sélection n'a encore été soumise ;
- vue récente prioritaire par défaut sur les écrans décisionnels.

## Ce qui reste secondaire

- familles non P0 ;
- campagnes non branchées ;
- consultation organoleptique ;
- contexte station / hydromorphologie ;
- résultats SWAT/WASP legacy.

## Ce qui doit rester historique

- anciennes séries non prioritaires ;
- archives ;
- campagnes anciennes ;
- mesures consultation only ;
- objets legacy à garder pour traçabilité.

## Ce qui doit être masqué

- `FM`
- `F_M_MES`
- `MO_METAL` en tant que code exposé
- `lacher_m3s` comme contrat métier barrage

## Ce qui nécessite action utilisateur

- chargement des données ;
- changement de période détaillée ;
- affichage graphique ;
- géométrie détaillée ;
- consultation campagne / archive.

## Carte

- synthèse spatiale uniquement ;
- priorité au récent ;
- filtres obligatoires pour les familles volumétriques ;
- lazy loading systématique ;
- agrégation ou limitation par défaut ;
- `include_geom` uniquement en mode carte ;
- densité contrôlée par support, période et famille.

## Tableau

- contrôle métier et lecture source ;
- export futur recommandé ;
- détail ligne à ligne ;
- afficher la QA et le support ;
- conserver la source vue / endpoint / période.

## Graphique

- tendance ;
- comparaison inter-périodes ;
- usage ciblé sur séries filtrées ;
- pas de graphique quantitatif pour `COULEUR` ;
- distinguer barrage volume journalier et débit.

## Règles de fraîcheur

- temps réel : surveillance future ;
- récent : valeur par défaut décisionnelle ;
- moyen terme : tendance ;
- historique : comparaison ;
- archive : consultation.

## Règles multi-supports

- toujours afficher `support_type` ;
- ne pas fusionner `BARRAGE` et `RIVIERE` sans marqueur ;
- `DISQUE_SECCHI` dépend du support ;
- `T_AIR` dépend du couple support + source.

## Règles décisionnelles DG

- lecture très courte ;
- anomalies et points critiques avant le détail ;
- récent avant historique ;
- état `à venir` explicite plutôt qu'un vide silencieux.

## Risques UX à surveiller

- surcharge cartographique si multi-support + longue période ;
- confusion `MO` / `Mo` ;
- confusion débit / volume barrage ;
- mélange analyses qualité et campagnes pollution ;
- spinners infinis sur modules non branchés.
