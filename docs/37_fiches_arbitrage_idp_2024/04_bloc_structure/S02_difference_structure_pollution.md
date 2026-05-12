# [S02] Différence de structure pollution

---

## 1. Résumé rapide

- Bloc : Structure
- Type : problème structure
- Volume : 1 colonne divergente confirmée
- Priorité : Élevée
- Tables concernées : `public.mesures_idp_2024_src_pollution_globale`, `public.mesures_idp_2024_src_pollution_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Deux tables peuvent sembler identiques, mais si une colonne clé n’a pas le même type, la fusion ou la comparaison devient moins sûre.

---

## 3. Description du problème

L’audit confirme une différence de type sur :

- `eau_ss_terr_niv_statique_m_sol`

Types observés :

- `double precision` dans `src_pollution_globale`
- `text` dans `src_pollution_marche_cadre`

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : `eau_ss_terr_niv_statique_m_sol`
- valeur : numérique attendue
- date : plusieurs dates
- point : plusieurs points
- observation : colonne typée en numérique

Exemple 2 :
- table : `public.mesures_idp_2024_src_pollution_marche_cadre`
- paramètre / source : `eau_ss_terr_niv_statique_m_sol`
- valeur : texte possible
- date : plusieurs dates
- point : plusieurs points
- observation : même colonne typée en texte

---

## 5. Analyse

Le volume n’est pas exprimé en lignes problématiques distinctes ici, mais le conflit est structurel et confirmé.

Le pattern montre que la fusion des deux tables source pollution nécessite une harmonisation préalable.

---

## 6. Impact métier

- impact sur analyse qualité : faible direct
- impact sur pollution : difficulté à consolider les données souterraines
- impact sur dashboard : risque de lecture incohérente ou de champ non exploitable
- risque décisionnel : fusion de deux structures non totalement compatibles

---

## 7. Options possibles

Option 1 : conserver les deux tables séparées  
Option 2 : harmoniser le type avant fusion  
Option 3 : exclure temporairement cette colonne de la fusion

---

## 8. Recommandation

Harmoniser explicitement la colonne avant toute fusion, ou l’exclure temporairement si sa valeur métier n’est pas prioritaire.

---

## 9. Questions à poser au métier

- Cette colonne est-elle indispensable à la première intégration IDP ?
- Les valeurs textuelles éventuelles doivent-elles être conservées comme information brute ?
- Une normalisation ultérieure est-elle acceptable ?

---

## 10. Décision attendue

- Décision : stratégie de gestion de la colonne divergente
- Responsable : chef projet métier / équipe data après validation métier
- Délai : avant fusion source pollution

---

## 11. Liens avec autres fiches

- dépend de : `PL04`
- impacte : `S03`, `S04`
