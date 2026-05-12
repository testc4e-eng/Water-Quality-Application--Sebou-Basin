# VERROUS CLIENTS ACTIFS — SYNTHÈSE DE POURSUITE WQDSS 

> DOCUMENT DE GOUVERNANCE N°20 
> Ce document isole les dépendances extérieures (Client ABH / Expert Métier) qui paralysent temporellement les lots d'ingestion SQL du Hub Qualité WQDSS (Lot 4). Sans ces signatures, l'ingestion est gelée pour éviter la corruption de la Production.

## 🔴 Blocage 1 : Arbitrage des Paramètres Historiques "Polymorphes"
- **Impact** : Gel partiel de l'intégration analytique (Rivières, Nappes, Barrages).
- **Le problème** : Plus de 3 700 cellules mathématiques dorment en attente. Des acronymes anciens (`H_G`, `sat`, `PTD`, `PTP`, `F_M_mes`, etc.) foisonnent dans la Sandbox. Les Data Engineers ont un doute scientifique. (Ex: `H_G` est-il l'Huile/Graisse ou le Mercure `Hg` ?).
- **Urgence** : Élevée. Action bloque le Lot 4A-2 et Lot 4A-3.
- **Formulaire de résolution** : Fournir une correspondance canonique vers le dictionnaire SQL (Ref Doc `16`).

## 🔴 Blocage 2 : Identifiant Géographique "Garde Sebou" Introuvable
- **Impact** : Gel complet de l'ingestion du suivi Qualité Lacustre (Périmètre Hebdo : 7094 lignes).
- **Le problème** : La Prod actuelle ne possède _strictement_ à date, ancun `code_station` ou nom contenant le mot clé "GARDE" ou "SEBOU" de manière identifiable dans la table Mère Topographique `infra.stations_mesure`.  
- **Urgence** : Critique. 
- **Formulaire de résolution** : L'ABH doit fournir l'`id` nominal de Production de ce Barrage ou instruire l'équipe technique de le numériser/créer dans le système.

## 🟡 Blocage 3 (Nouveau) : La Politique Topographique IDP (Rejets)
- **Impact** : Gel structurel du Lot 4A-4 (Pollutions ponctuelle & Industrielle). 
- **Le problème** : L'ingestion des paramètres IDP exige que "l'usine source" existe dans le référentiel topographique `infra` de la Prod (`rejet_industriel`, `decharge`, `step`...). Ces points (souvent documentés dans les tables `inv_rejets..._abhs` du Sandbox) doivent soit être créés from-scratch, soit rattachés à des clés existantes en prod.
- **Urgence** : Modérée.
- **Formulaire de résolution** : Autorisation ABH d'activer une routine d'auto-création d'entreprise polluante (`INSERT INTO infra.*`), ou fourniture du mapping d'identité existant.

## 🟡 Blocage 4 (Nouveau) : Les Doublons 2024 de l'IDP
- **Impact** : Retard de conception (Structuration IDP - Lot 4A-4B).
- **Le problème** : En Sandbox l'année 2024 compte 4 tables (`qualite_globale`, `qualite_marche_cadre` etc.). 
- **Urgence** : Faible (Mais requis avant Ingestion IDP).
- **Formulaire de résolution** : Le client technique de l'ABH doit confirmer s'il s'agit d'une scission contractuelle d'une même nature ou si la table "Globale" ne suffit pas. L'ingénierie fusionnera ces tables si ordonné.
