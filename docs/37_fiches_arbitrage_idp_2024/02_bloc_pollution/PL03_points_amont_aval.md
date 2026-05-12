# [PL03] Points amont / aval

---

## 1. Résumé rapide

- Bloc : Pollution
- Type : problème structure
- Volume : 1 806 lignes repérées
- Priorité : Élevée
- Tables concernées : `public.mesures_idp_2024_qualite_globale`, `public.mesures_idp_2024_qualite_marche_cadre`, `public.mesures_idp_2024_src_pollution_globale`, `public.mesures_idp_2024_src_pollution_marche_cadre`
- Décision requise : Oui

---

## 2. Description métier

Les points `amont` et `aval` décrivent souvent une position de contrôle autour d’un rejet ou d’une infrastructure. Ils ne représentent pas automatiquement une source de pollution.

---

## 3. Description du problème

L’audit confirme :

- `864` lignes qualité globale avec point `amont` ou `aval`
- `887` lignes qualité marché cadre avec point `amont` ou `aval`
- `30` lignes source pollution globale avec point `amont` ou `aval`
- `25` lignes source pollution marché cadre avec point `amont` ou `aval`

Le problème est que ces points peuvent être interprétés à tort comme des sources officielles.

---

## 4. Exemples concrets (OBLIGATOIRE)

Exemple 1 :
- table : `public.mesures_idp_2024_qualite_globale`
- paramètre / source : point de prélèvement
- valeur : à confirmer
- date : plusieurs dates
- point : `AVAL REJET INDUSTRIEL MERJA`
- observation : point aval, pas forcément une source

Exemple 2 :
- table : `public.mesures_idp_2024_qualite_marche_cadre`
- paramètre / source : point de prélèvement
- valeur : à confirmer
- date : plusieurs dates
- point : `AMONT BARRAGE DE GARDE`
- observation : point de contrôle spatial, pas forcément une source

Exemple 3 :
- table : `public.mesures_idp_2024_src_pollution_globale`
- paramètre / source : point de prélèvement
- valeur : à confirmer
- date : plusieurs dates
- point : `Amont STEP Taounate`
- observation : point de suivi amont d’une STEP

---

## 5. Analyse

Le volume est élevé : `1 806` lignes repérées.

Le pattern montre une confusion potentielle entre :

- point de contrôle environnemental
- source de pollution
- station d’observation autour de la source

---

## 6. Impact métier

- impact sur analyse qualité : mauvaise attribution de la source
- impact sur pollution : confusion entre rejet et point de suivi
- impact sur dashboard : mélange des objets à représenter
- risque décisionnel : tirer une conclusion sur une source à partir d’un point amont ou aval

---

## 7. Options possibles

Option 1 : assimiler tous les points amont/aval à des sources  
Option 2 : les exclure des référentiels source  
Option 3 : les conserver comme points de contrôle distincts

---

## 8. Recommandation

Conserver les points amont/aval comme points de contrôle distincts, et ne jamais les assimiler automatiquement à des sources officielles.

---

## 9. Questions à poser au métier

- Un point amont/aval doit-il apparaître dans le référentiel source ?
- Faut-il distinguer graphiquement une source et un point de contrôle ?
- Quels points amont/aval doivent être conservés pour l’analyse métier ?

---

## 10. Décision attendue

- Décision : règle officielle de gestion des points amont/aval
- Responsable : ABH / métier pollution
- Délai : avant la fusion et l’intégration SAD

---

## 11. Liens avec autres fiches

- dépend de : `PL01`, `PL02`
- impacte : `PL04`, `S03`
