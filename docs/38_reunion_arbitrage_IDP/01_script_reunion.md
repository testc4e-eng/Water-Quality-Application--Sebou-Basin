# Script de réunion — Arbitrage IDP 2024

## Sujet : Fragmentation IDP

1. Résumé  
Les données IDP 2024 sont réparties sur `4` tables et ne sont pas encore positionnées clairement dans le système cible.

2. Chiffres clés  
- `8 899` lignes au total  
- `4` tables sources  
- `4` tables absentes dans `abh_sad`

3. Exemple concret  
Une même famille de données existe en version `globale` et en version `marché cadre`, ce qui rend la lecture globale moins claire.

4. Question à poser  
Veut-on fusionner ces ensembles ou conserver une séparation avec traçabilité ?

5. Options  
- conserver les tables séparées  
- fusionner avec une trace d’origine  
- choisir une table de référence par domaine

6. Recommandation  
Conserver la traçabilité d’origine et n’autoriser une fusion qu’après arbitrage explicite.

---

## Sujet : Recouvrement qualité globale / marché

1. Résumé  
Des mesures qualité apparaissent dans les deux ensembles.

2. Chiffres clés  
- `40` cas de recouvrement confirmés

3. Exemple concret  
Même point, même date, même paramètre, même valeur dans `globale` et `marché cadre`.

4. Question à poser  
Quelle source doit faire foi quand un même résultat existe deux fois ?

5. Options  
- garder les deux ensembles  
- fusionner avec origine  
- retenir une table prioritaire

6. Recommandation  
Mettre ces cas à part et fixer une règle métier unique avant intégration.

---

## Sujet : Recouvrement sources globale / marché

1. Résumé  
Quelques points pollution apparaissent dans les deux ensembles.

2. Chiffres clés  
- `5` cas de recouvrement confirmés

3. Exemple concret  
Même point, même date, même commune et même nature dans les deux tables pollution.

4. Question à poser  
Faut-il fusionner ces cas ou garder une source prioritaire ?

5. Options  
- conserver séparé  
- fusionner avec origine  
- choisir une table de référence

6. Recommandation  
Arbitrer une règle simple de priorité avant toute fusion.

---

## Sujet : Paramètres non mappés

1. Résumé  
Une part importante des résultats qualité ne peut pas être reliée directement au dictionnaire cible.

2. Chiffres clés  
- `4 755` lignes concernées

3. Exemple concret  
Des paramètres comme `NH4+`, `Ca++` ou `NO3-_Spectro` existent en source mais ne sont pas encore reliés au référentiel final.

4. Question à poser  
Que fait-on des paramètres présents mais non encore validés dans le dictionnaire officiel ?

5. Options  
- exclure provisoirement  
- conserver en attente  
- valider un mapping progressif

6. Recommandation  
Conserver en attente et valider un mapping progressif avec l’ABH.

---

## Sujet : Paramètres ambigus

1. Résumé  
Certains paramètres n’ont pas de signification officielle stabilisée.

2. Chiffres clés  
- `27` cas explicites plus cas dérivés

3. Exemple concret  
`H_G`, `sat`, `PTD` et `PTP` peuvent être interprétés de plusieurs manières.

4. Question à poser  
Quelle définition officielle faut-il retenir pour chaque paramètre ambigu ?

5. Options  
- bloquer ces paramètres  
- les conserver sans usage  
- valider une définition officielle

6. Recommandation  
Valider rapidement une définition officielle avant exploitation.

---

## Sujet : Variantes de paramètres et unités

1. Résumé  
Plusieurs paramètres ont des variantes de libellés ou des unités non stabilisées.

2. Chiffres clés  
- plusieurs centaines de lignes selon paramètre  
- plusieurs familles concernées

3. Exemple concret  
Un même paramètre peut apparaître avec des écritures différentes ou avec une unité absente.

4. Question à poser  
Quel libellé et quelle unité doivent devenir la référence métier ?

5. Options  
- garder les variantes  
- regrouper sous un libellé officiel  
- exclure les cas non clairs

6. Recommandation  
Adopter un libellé officiel et une unité officielle par famille de paramètres.

---

## Sujet : Valeurs non numériques et valeurs labo spéciales

1. Résumé  
Certaines valeurs ne sont pas directement exploitables comme des chiffres.

2. Chiffres clés  
- `2 035` cas non numériques

3. Exemple concret  
Des valeurs comme `<0,005` ou d’autres écritures labo ne se lisent pas comme une valeur simple.

4. Question à poser  
Quelle règle métier doit s’appliquer à ces valeurs ?

5. Options  
- exclure  
- conserver en quarantaine  
- convertir selon une règle validée

6. Recommandation  
Définir une règle métier unique puis appliquer cette règle de manière homogène.

---

## Sujet : Valeurs nulles

1. Résumé  
Quelques résultats n’ont pas de valeur exploitable.

2. Chiffres clés  
- `11` cas

3. Exemple concret  
Une ligne de résultat existe mais la valeur attendue n’est pas renseignée.

4. Question à poser  
Ces lignes doivent-elles être exclues ou conservées comme données incomplètes ?

5. Options  
- exclure  
- conserver en attente  
- conserver uniquement pour traçabilité

6. Recommandation  
Les conserver séparément jusqu’à validation de la règle métier.

---

## Sujet : Sources non rattachées

1. Résumé  
Des points pollution existent dans l’IDP sans correspondance claire dans la cible.

2. Chiffres clés  
- `240` points non rattachés

3. Exemple concret  
Un point source présent dans les données IDP n’est pas retrouvé tel quel dans le référentiel intégré.

4. Question à poser  
Faut-il enrichir le référentiel ou garder ces points en attente ?

5. Options  
- exclure  
- conserver en quarantaine  
- rattacher manuellement

6. Recommandation  
Conserver en quarantaine puis rattacher manuellement avec validation métier.

---

## Sujet : Codes pollution ambigus

1. Résumé  
Plusieurs codes opérationnels existent sans liste officielle stabilisée.

2. Chiffres clés  
- plusieurs codes concernés

3. Exemple concret  
Un même type de source peut être désigné par des codes différents selon le contexte.

4. Question à poser  
Quels codes doivent être considérés comme officiels ?

5. Options  
- garder tous les codes  
- publier une liste officielle  
- regrouper les codes équivalents

6. Recommandation  
Publier une liste officielle puis aligner les codes existants sur cette base.

---

## Sujet : Points amont / aval

1. Résumé  
De nombreux points décrivent une position de contrôle plutôt qu’une source clairement identifiée.

2. Chiffres clés  
- `1 806` lignes repérées

3. Exemple concret  
Un point nommé `amont` ou `aval` peut servir à observer un impact sans être la source elle-même.

4. Question à poser  
Ces points doivent-ils être classés comme sources ou comme points de contrôle ?

5. Options  
- les traiter comme sources  
- les traiter comme points de contrôle  
- les sortir temporairement des synthèses

6. Recommandation  
Les qualifier d’abord comme points de contrôle sauf validation contraire du métier.
