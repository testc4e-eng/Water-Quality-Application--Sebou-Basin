# LOT 4A-4B : Structuration Logique (Pollution Ponctuelle — IDP)

Ce document établit la mécanique théorique de franchissement algorithmique du mur de complexité IDP. Aucun code n'a piqué la base (Strict READ-ONLY) de ce périmètre complexe associant Topographie Industrielle et Mesures Qualitatives.

## 1. Fusion ou Rétention Thématique des Tables Sources
Sur le corpus IDP Sandbox 2024, le modèle éclaté regroupe :
- `mesures_idp_2024_qualite_marche_cadre`
- `mesures_idp_2024_qualite_globale`
- `mesures_idp_2024_src_pollution_marche_cadre`
- `mesures_idp_2024_src_pollution_globale`

**Stratégie de traitement** : Fusion sémantique lors de la lecture. Les scripts du Dry-Run liront ces 4 tables comme un `UNION ALL` virtuel (si les colonnes sont jumelles). Distinguer "Marche Cadre" de "Globale" n'est potentiellement qu'un jargon de facturation de marchés publics qui n'intéresse pas la chimie algorithmique du SAD, à moins que le métier (Doc `20_`) n'exige la préservation de la trace du marché (`source_name = Marche Cadre N°x`).

## 2. Anatomie de l'Architecture Cible SAD
Le déversement se fracturera en deux couches étanches :

### Couche Infra (L'entité Topographique)
- `infra.rejet_industriel` / `infra.rejet_domestique` etc.
- **La Clé Métier de Raccordement (Pivot)** : Un champ comme `code_usine` ou `nom_societe` en sandbox DOIT matcher l'entité infra cible (ou être auto-généré). Sans cela la jointure spatiale explose. 

### Couche Qualité (L'échantillon prélevé)
- `qualite.source_pollution_prelevement` : Héberge la Méta-data du jour du prélèvement (Heure, Entité concernée, Opérateur labo).
- `qualite.source_pollution_mesure_param` : Le tableau atomique des paramètres (DBO5, Azote...) relatifs à cet ID de Prélèvement.

## 3. Stratégie d'Assujettissement des Infrastructures (Le Raccordement Infra)
Afin de ne pas crasher sur les `WOULD_CONFLICT` d'identité géospatiale :
- **L'Upsert Doux** : Le futur code de Dry-Run cherchera le nom d'usine/point de rejet dans les tables `infra.rejet_*`.
- Si **Trouvé** : Branchement normal de l'ID cible au Prélèvement.
- Si **Inconnu** : Interdiction absolue de créer automatiquement l'usine (Pas d'auto-INSERT `infra.*`). Nous emploierons le flag `qa_flag_missing_source = TRUE` pour signaler que le bloc analytique est rejeté ou conservé dans un buffer d'attente (Orphelin).

## 4. Politique de Tolérance sur les Paramètres Chimiques
- L'upsert appliquera le même barrage sémantique validé dans le Lot 4A-1/1B. Tout composé obscur (Les éternels Ambiguïtés de labo) sera refoulé. 
- Les vides (`NULL`) seront effacés `WOULD_SKIP`. 

## 5. Nouveau Cartel de QA Flags (Spécial IDP)
Outre les boucliers historiques, le dry-run instaurera :
- 📍 **`qa_flag_missing_source`** : Usine / Décharge / Step introuvable dans le référentiel des entités WQDSS Prod.
- 🎭 **`qa_flag_duplicate_event`** : Si deux tables Sandbox (ex: Globale et Marche) présentent le même prélèvement à la même date et même usine.
- 🧮 **`qa_flag_param_unmapped`** et **`qa_flag_negative`** : Conservent leur logique immuable du monde aquatique ambiant.

## 6. Conditions Préalables Indispensables (Pre-requisites to Dry-Run)
Le programme IDP `lot4a4b_idp_dry_run_simulator.py` ne sera ni rédigé ni invoqué tant que :
- L'équipe WQDSS (Docs `20`/`21`) n'a pas validé techniquement si l'on gèle les "orphelins d'usine" ou si l'on tente un insert permissif d'usines fantômes avec des coordonnées nulles.
- Le paramètre pivot structurant les entreprises dans Sandbox (Code C.G.E, Nom de l'émergence...) n'a pas été formellement cartographié à `infra.rejet*`.
