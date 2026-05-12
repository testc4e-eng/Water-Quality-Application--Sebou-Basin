# 📑 RÉSUMÉ DÉCISIONNEL : ARBITRAGES MÉTIER & VALIDATIONS CLIENT

> **Document N°26**
> Destiné à la Direction de Projet ABH. 
> Ce rapport filtre uniquement les points de blocage nécessitant une validation experte pour libérer l'ingestion finale des données.

---

## 1. AVANT-PROPOS
Les travaux d'industrialisation du Système d'Aide à la Décision (SAD) Sebou ont permis de qualifier plus d'un million d'enregistrements. Pour finaliser le déploiement des modules "Qualité" et "Pollution", quatre décisions stratégiques doivent être entérinées par vos services.

---

## 2. POINT CRITIQUE N°1 : RÉFÉRENTIEL DES STATIONS
**Sujet** : Station manquante "Barrage Garde Sebou"
- **Observation** : 7 094 mesures de laboratoire sont rattachées à ce barrage. Or, aucun identifiant correspondant n'existe dans la base de production actuelle.
- **Risque** : Perte définitive de ces 7 000 données historiques lors de la migration.
- **Action attendue** : 
    - Nous confirmer le code officiel (ex: `BGS_01`) à utiliser dans le système.
    - OU, nous autoriser à créer une nouvelle fiche station "Barrage Garde Sebou" dans le répertoire.

---

## 3. POINT CRITIQUE N°2 : NORMALISATION CHIMIQUE
**Sujet** : Paramètres aux noms ambigus (ex: `H_G`, `sat`)
- **Observation** : Plus de 4 700 analyses portent le nom `H_G`. S'agit-il du Mercure (Hg), des Huiles et Graisses, ou d'un autre composé ? Pareillement pour `sat` (Saturation en Oxygène ?).
- **Risque** : Affichage de données fausses ou erronées sur les graphiques de suivi qualité.
- **Action attendue** : Compléter et signer la fiche de correspondance jointe (*Annexe A du Dossier 25*).

---

## 4. POINT CRITIQUE N°3 : GESTION DES REJETS INDUSTRIELS (IDP)
**Sujet** : Entreprises polluantes non répertoriées
- **Observation** : L'inventaire de pollution (IDP) liste des rejets industriels qui n'ont pas encore d'empreinte dans le répertoire géographique officiel.
- **Risque** : Impossibilité de localiser la pollution sur les cartes WQDSS.
- **Action attendue** : Valider s'il faut créer automatiquement ces "points de rejet" lorsqu'ils apparaissent dans les fichiers de pollution, ou s'ils doivent être créés manuellement par vos services SIG d'abord.

---

## 5. POINT CRITIQUE N°4 : FRAGMENTATION IDP 2024
**Sujet** : Dualité des tables "Globale" et "Marché Cadre"
- **Observation** : L'année 2024 est scindée en plusieurs tableaux.
- **Action attendue** : Confirmer si ces données doivent être fusionnées en une seule vue annuelle ou si la distinction contractuelle (Marche Cadre) doit être préservée.

---

## CONCLUSION
La résolution de ces points permettra de débloquer l'ingestion de **plus de 15 000 lignes de données stratégiques** (Barrages et Pollution). L'équipe technique est à votre disposition pour présenter ces cas sur écran lors d'une réunion de cadrage.
