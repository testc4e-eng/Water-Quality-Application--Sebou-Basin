# [A08] Données qualité nulles

---

## 1. Résumé rapide (lecture 30 sec)

- Type : anomalie métier
- Domaine : qualité des eaux
- Priorité : Moyenne
- Statut : à valider
- Décision requise : Oui

Certaines analyses qualité sont présentes mais sans valeur mesurée. Elles ne sont pas exploitables directement dans les lectures métier.

---

## 2. Description métier détaillée

Les analyses qualité doivent permettre de comparer les paramètres par station et par date. Une ligne sans valeur ne permet pas cette lecture.

Elle peut toutefois représenter une tentative de mesure ou une donnée incomplète à conserver comme trace.

---

## 3. Description du problème

- anomalie observée : valeur absente alors que le paramètre est renseigné
- ce qui est observé : date et paramètre présents, valeur vide
- ce qui est attendu : mesure complète ou règle claire d'exclusion

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : à confirmer
- station : à confirmer
- date : cas récents et historiques
- valeur : vide
- observation : ligne présente mais non exploitable pour l'analyse

Exemple 2 :
- paramètre : à confirmer
- station : à confirmer
- date : plusieurs campagnes
- valeur : vide
- observation : le paramètre est connu mais le résultat n'est pas disponible

Exemple 3 :
- paramètre : à confirmer
- station : plusieurs stations
- date : plusieurs périodes
- valeur : vide
- observation : phénomène récurrent dans les données qualité

---

## 5. Analyse des cas

Le problème est récurrent et non marginal. Il semble correspondre à des analyses incomplètes ou à des résultats non saisis.

Ce n'est pas un problème de sens du paramètre, mais de complétude.

---

## 6. Volume et étendue

- nombre de cas concernés : environ 16 803 lignes signalées avec valeur nulle sur les tables qualité consolidées
- zones concernées : plusieurs stations et milieux
- périodes concernées : historique multi-annuel
- fréquence : élevée

---

## 7. Interprétations possibles

- mesure prévue mais non réalisée
- résultat non saisi
- résultat écarté au laboratoire
- problème de transmission
- valeur conservée vide à titre de trace

---

## 8. Données associées à analyser

- campagnes de mesure
- paramètres les plus souvent vides
- stations les plus touchées
- fiches laboratoire
- règles métier de complétude minimale

---

## 9. Cas particulier : données absentes

### Statut des données
- partielles

Ici, les lignes existent mais la valeur n'est pas disponible.

---

## 10. Questions à poser au métier

- Faut-il conserver ces lignes comme trace d'analyse incomplète ?
- Ces cas doivent-ils apparaître dans les synthèses métier ?
- Une catégorie "analyse non exploitable" doit-elle être affichée ?

---

## 11. Options de traitement

Option 1 : exclure systématiquement ces lignes
Option 2 : les conserver comme traces non exploitables
Option 3 : distinguer selon le type de campagne

---

## 12. Recommandation

Exclure ces lignes des calculs et synthèses métier, tout en conservant si besoin une trace documentaire distincte.

---

## 13. Impact métier (léger)

Ces lignes peuvent brouiller les tableaux et donner l'impression d'une couverture plus complète qu'en réalité.

---

## 14. Actions à prévoir

- action court terme : valider la règle métier de présence minimale d'une mesure
- action moyen terme : identifier les familles et campagnes les plus touchées

---

## 15. Niveau de confiance

- élevé

Le volume des valeurs nulles est confirmé et largement documenté.

---

## 16. Notes complémentaires

- à distinguer clairement des manques de données globaux comme la température
- lié à A09 et A10 seulement par la notion de complétude
