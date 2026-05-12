# [A09] Données météo manquantes

---

## 1. Résumé rapide (lecture 30 sec)

- Type : manque de données
- Domaine : données météo
- Priorité : Élevée
- Statut : en attente données
- Décision requise : Oui

Les données météo ne sont pas totalement complètes. Certaines séries existent, mais avec des trous qui limitent l'analyse métier continue.

---

## 2. Description métier détaillée

Les données météo servent à contextualiser les analyses hydrologiques et qualité. Elles aident à comprendre les évolutions liées aux pluies, à l'évaporation et aux conditions climatiques.

Une chronique incomplète réduit la capacité d'interprétation dans le temps.

---

## 3. Description du problème

- manque observé : données partielles sur certaines séries météo
- ce qui est observé : présence de dates sans valeur exploitable, surtout sur l'évaporation
- ce qui est attendu : chroniques continues ou clairement qualifiées

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : évaporation
- station : à confirmer
- date : 2024-08-31
- valeur : vide
- observation : date présente mais sans valeur exploitable

Exemple 2 :
- paramètre : évaporation
- station : à confirmer
- date : 2024-08-30
- valeur : vide
- observation : répétition sur plusieurs jours

Exemple 3 :
- paramètre : précipitation
- station : à confirmer
- date : 2024-08-31
- valeur : observée vide, mais valeur alternative disponible
- observation : la donnée existe, mais pas toujours sous une forme homogène

---

## 5. Analyse des cas

Le manque est surtout concentré sur certaines séries météo. Il semble moins critique sur la pluie que sur l'évaporation. Le problème est récurrent sur plusieurs dates.

Le pattern principal est une météo partiellement disponible, pas totalement absente.

---

## 6. Volume et étendue

- nombre de cas concernés : environ 10 308 cas vides sur l'évaporation
- zones concernées : à confirmer
- périodes concernées : plusieurs périodes, y compris récentes
- fréquence : significative

---

## 7. Interprétations possibles

- station indisponible
- donnée non remontée
- série incomplète
- priorité donnée à certaines variables seulement
- reconstitution partielle de la donnée

---

## 8. Données associées à analyser

- pluie observée
- pluie alternative ou reconstituée
- évaporation
- couverture par station météo
- périodes de mesure

---

## 9. Cas particulier : données absentes

### Statut des données
- partielles

Les données météo sont présentes mais incomplètes selon les variables.

---

## 10. Questions à poser au métier

- Quel niveau de complétude météo est acceptable pour les analyses métier ?
- L'évaporation incomplète bloque-t-elle certaines restitutions attendues ?
- Faut-il distinguer en réunion les données observées et les données complétées ?

---

## 11. Options de traitement

Option 1 : utiliser seulement les périodes complètes
Option 2 : conserver les séries partielles avec avertissement
Option 3 : attendre un complément de données avant restitution complète

---

## 12. Recommandation

Conserver les séries météo disponibles, mais présenter clairement les trous de couverture et limiter les conclusions sur les périodes incomplètes.

---

## 13. Impact métier (léger)

Les interprétations climat-hydrologie peuvent être fragilisées si les manques ne sont pas signalés.

---

## 14. Actions à prévoir

- action court terme : valider le niveau minimal de complétude acceptable
- action moyen terme : compléter les séries météo incomplètes

---

## 15. Niveau de confiance

- élevé

Le manque est confirmé par les données météo actuelles.

---

## 16. Notes complémentaires

- ne pas confondre avec A10 qui concerne une absence totale de température
