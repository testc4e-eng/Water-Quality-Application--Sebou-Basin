# Synthèse arbitrage IDP 2024

## 1. Cas structurants necessitant arbitrage

Top 10 des problèmes les plus structurants :

1. `P01` Paramètres non mappés : `4 755` lignes
2. `P05` Valeurs non numériques : `2 035` cas
3. `PL03` Points amont / aval : `1 806` lignes repérées
4. `PL01` Sources non rattachées : `240` points
5. `S03` Fragmentation des données IDP : `8 899` lignes réparties sur 4 tables
6. `S01` Recouvrement qualité globale / marché : `40` cas
7. `PL04` Recouvrement sources globale / marché : `5` cas
8. `D01` Valeurs nulles : `11` cas
9. `S04` Absence des tables IDP dans `abh_sad` : `4` tables absentes dans la cible
10. `S02` Différence de structure pollution : `1` colonne divergente confirmée

## 2. Décisions prioritaires

| Sujet | Décision | Bloc | Priorité |
|---|---|---|---|
| Paramètres non mappés | quarantaine puis validation de mapping | Paramètres | Critique |
| Paramètres ambigus | définir la signification officielle | Paramètres | Critique |
| Valeurs non numériques | fixer la règle de traitement labo / conversion | Paramètres / Données | Critique |
| Sources non rattachées | décider de la quarantaine et du rattachement manuel | Pollution | Critique |
| Points amont / aval | dire s’ils sont des sources ou des points de contrôle | Pollution | Critique |
| Recouvrements globale / marché | arbitrer la règle de fusion | Structure | Critique |
| Tables IDP absentes dans `abh_sad` | définir leur statut cible | Structure | Critique |
| Unités absentes ou mélangées | fixer l’unité officielle par famille | Paramètres | Élevée |
| Différence de structure pollution | harmoniser ou exclure la colonne divergente | Structure | Élevée |
| Valeurs nulles | décider exclusion ou quarantaine | Données | Moyenne |

## 3. Risques majeurs

- double comptage si fusion brute de `globale` et `marché cadre`
- perte d’information si suppression prématurée de paramètres non mappés
- mauvaise lecture des points pollution si `amont` / `aval` sont assimilés à des sources
- intégration partielle ou incohérente si le statut des 4 tables IDP dans `abh_sad` n’est pas clarifié

## 4. Plan d’action proposé

Phase 1 : quarantaine  
- mettre en quarantaine les paramètres non mappés, paramètres ambigus, valeurs non numériques, recouvrements et sources non rattachées

Phase 2 : validation métier  
- arbitrer les paramètres, les règles de fusion, le statut des points source et le rôle des tables IDP dans `abh_sad`

Phase 3 : nettoyage  
- ne nettoyer qu’après validation explicite, avec backup et conditions précises

Phase 4 : intégration SAD  
- intégrer uniquement des données validées, tracées et harmonisées

## 5. Lecture de pilotage

Le pipeline IDP n'est pas en echec. Les cas ambigus residuels ont ete identifies, traces et regroupes dans des supports d'arbitrage. La suite releve d'une validation metier sur l'identite et le traitement de certaines entites.
