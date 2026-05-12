# [A14] Données extrêmes aberrantes

---

## 1. Résumé rapide (lecture 30 sec)

- Type : incohérence
- Domaine : qualité / hydrologie
- Priorité : Élevée
- Statut : à valider
- Décision requise : Oui

Certaines valeurs extrêmes paraissent incompatibles avec une lecture métier normale. Elles doivent être qualifiées avant d'être utilisées pour interpréter une tendance ou une alerte.

---

## 2. Description métier détaillée

Les valeurs extrêmes peuvent signaler un phénomène réel important ou une donnée non interprétable. Dans les deux cas, elles doivent être lues avec prudence.

Elles influencent fortement les comparaisons, les moyennes et les discussions sur les situations critiques.

---

## 3. Description du problème

- incohérence observée : valeurs extrêmes ou aberrantes
- ce qui est observé : valeurs négatives ou très atypiques selon le contexte
- ce qui est attendu : valeurs cohérentes ou explicitement qualifiées comme cas particuliers

---

## 4. Données observées (exemples concrets)

Exemple 1 :
- paramètre : débit
- station : ait khabbach
- date : 1984-08-31
- valeur : -1
- observation : débit négatif non compatible avec une lecture métier standard

Exemple 2 :
- paramètre : débit
- station : my ali cherif
- date : 1985-04-11
- valeur : -1
- observation : répétition du même schéma sur une autre station

Exemple 3 :
- paramètre : CF
- station : dar el arsa
- date : 2006-12-05
- valeur : -0.4
- observation : valeur extrême négative sur la qualité

---

## 5. Analyse des cas

Les cas aberrants ne sont pas majoritaires, mais leur effet sur l'interprétation est fort. Ils semblent souvent correspondre à une convention de saisie ou à un besoin de qualification métier.

Le pattern observé concerne surtout des valeurs négatives.

---

## 6. Volume et étendue

- nombre de cas concernés : 1 931 cas négatifs sur les débits ; quelques cas négatifs sur la qualité
- zones concernées : plusieurs stations
- périodes concernées : historique multi-annuel
- fréquence : importante en hydrologie, faible en qualité

---

## 7. Interprétations possibles

- erreur de saisie
- code historique pour donnée invalide
- signal "sous seuil"
- valeur à exclure
- problème de convention ancienne

---

## 8. Données associées à analyser

- séries hydrologiques
- paramètres qualité atypiques
- stations les plus touchées
- conventions historiques de saisie
- règles métier de validation

---

## 9. Cas particulier : données absentes

### Statut des données
- disponibles

Ici, le sujet concerne l'interprétation de données disponibles mais atypiques.

---

## 10. Questions à poser au métier

- Une valeur extrême doit-elle toujours être exclue ?
- Existe-t-il des conventions historiques connues pour les valeurs négatives ?
- Faut-il distinguer les cas réels, les cas douteux et les cas à écarter ?

---

## 11. Options de traitement

Option 1 : exclure toutes les valeurs extrêmes
Option 2 : les qualifier manuellement
Option 3 : conserver avec avertissement métier

---

## 12. Recommandation

Exclure par défaut les valeurs extrêmes incompatibles avec une lecture métier, sauf si une règle de requalification est explicitement validée.

---

## 13. Impact métier (léger)

Les valeurs extrêmes peuvent créer de fausses alertes ou de fausses tendances.

---

## 14. Actions à prévoir

- action court terme : valider la règle métier de traitement
- action moyen terme : documenter les conventions historiques reconnues

---

## 15. Niveau de confiance

- élevé

Les valeurs négatives et aberrantes sont confirmées dans les données et les audits.

---

## 16. Notes complémentaires

- lié à A03
- à utiliser dans les ateliers hydrologie et qualité
