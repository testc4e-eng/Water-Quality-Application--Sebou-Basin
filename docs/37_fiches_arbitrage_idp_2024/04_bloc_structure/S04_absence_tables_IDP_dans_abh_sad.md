# [S04] Absence des tables IDP dans abh_sad

---

## 1. Résumé rapide

- Bloc : Structure
- Type : problème structure
- Volume : 4 tables absentes dans la cible
- Priorité : Critique
- Tables concernées : les 4 tables IDP 2024 non trouvées dans `abh_sad`
- Décision requise : Oui

---

## 2. Description métier

`abh_sad` est la base officielle du SAD. Si les tables IDP 2024 n’y existent pas sous leur nom source, il faut savoir si elles sont :

- en attente d’intégration ;
- déjà transformées ailleurs ;
- ou maintenues comme tables source externes.

---

## 3. Description du problème

Les 4 tables IDP 2024 ont été trouvées dans `abh_sebou_070426`, mais pas dans `abh_sad` sous leur nom d’origine :

- `mesures_idp_2024_qualite_globale`
- `mesures_idp_2024_qualite_marche_cadre`
- `mesures_idp_2024_src_pollution_globale`
- `mesures_idp_2024_src_pollution_marche_cadre`

Le problème est donc aussi un problème de positionnement dans le cycle de migration.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `abh_sad`
- paramètre / source : `mesures_idp_2024_qualite_globale`
- valeur : table non trouvée
- date : non applicable
- point : non applicable
- observation : absente de la cible sous ce nom

Exemple 2 :
- table : `abh_sebou_070426.public`
- paramètre / source : `mesures_idp_2024_qualite_globale`
- valeur : 4 894 lignes
- date : 2024-09-12 à 2025-12-14
- point : 212 points
- observation : présente dans la source

Exemple 3 :
- table : `abh_sad`
- paramètre / source : `mesures_idp_2024_src_pollution_globale`
- valeur : table non trouvée
- date : non applicable
- point : non applicable
- observation : absente de la cible sous ce nom

---

## 5. Analyse

Le constat est clair :

- les tables existent côté source
- elles n’existent pas côté cible sous ces noms

Cela ne signifie pas que les données sont perdues. Cela signifie qu’il faut décider si elles doivent :

- rester source ;
- être intégrées ;
- ou être considérées comme déjà migrées dans une autre structure.

---

## 6. Impact métier

- impact sur analyse qualité : possible décalage entre source auditée et cible officielle
- impact sur pollution : risque de confusion sur la source de vérité
- impact sur dashboard : difficulté à tracer ce qui a été réellement intégré
- risque décisionnel : croire qu’une donnée est déjà dans `abh_sad` alors qu’elle reste à qualifier

---

## 7. Options possibles

Option 1 : garder ces tables uniquement dans la base source  
Option 2 : les intégrer telles quelles dans `abh_sad`  
Option 3 : les transformer puis les intégrer dans des structures métier cibles

---

## 8. Recommandation

Ne pas intégrer ces tables telles quelles dans `abh_sad`. Les traiter comme sources à qualifier, puis n’intégrer que des données nettoyées et validées.

---

## 9. Questions à poser au métier

- Ces tables doivent-elles rester des sources de travail uniquement ?
- Faut-il les intégrer dans `abh_sad` après nettoyage ?
- Existe-t-il déjà des structures cibles équivalentes dans `abh_sad` qui doivent recevoir leur contenu ?

---

## 10. Décision attendue

- Décision : statut officiel des 4 tables IDP 2024 dans le dispositif SAD
- Responsable : chef projet métier / ABH
- Délai : avant toute phase de chargement cible

---

## 11. Liens avec autres fiches

- dépend de : `S03`
- impacte : `PL01`, `PL04`, `99_synthese_decision.md`
