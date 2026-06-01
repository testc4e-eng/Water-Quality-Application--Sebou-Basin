# RAPPORT EXÉCUTIF WQDSS : BLOCAGES NÉCESSITANT ARBITRAGE MÉTIER

> **À l'attention de l'ABH / Direction de Projet / Experts Métier**
> Les audits de qualification sur les données de l'Agence du Bassin Hydraulique du Sebou (Hydrologie, Météorologie, Qualité et Pollution) ont atteint une maturité analytique de très haut niveau. Nos algorithmes ont pu ingérer automatiquement des millions d'enregistrements en corrigeant les lacunes physiques. 
> Néanmoins, certains cas relèvent d'un choix purement hydro-chimique ou administratif. L'intégration de ces pans cruciaux (Lacs, Pollution Industrielle) est **suspendue à vos validations** pour garantir la pureté scientifique de l'outil.

---

## 1. SYNTHÈSE EXÉCUTIVE (TOP RISQUES MAJEURS)
Sans votre avis, le système WQDSS restera paré à un risque de "Mélange Sémantique" et omettra des parties cruciales de vos inventaires annuels. Les points bloquants critiques à arbitrer sont :

1. **La Station "Garde Sebou"** : Inconnue du Référentiel Topographique de la nouvelle plateforme. (Où injectons-nous la donnée de suivi ?)
2. **Le Vocabulaire Chimique** : 148 mots abrégés utilisés il y a 10 ans par les chimistes ne sont pas lisibles informatiquement. Les Data Engineers ne peuvent pas parier au hasard sur ce que signifie l'acronyme `H_G`.
3. **Le Référentiel des Rejets Polluants** : Le système ne connait pas toujours les entreprises industrielles citées dans vos tableurs. 

Vous trouverez ci-dessous les 4 Fiches de Validation Simples avec la ou les questions adressées à votre expertise.

---

## 2. FICHES DE DÉCISION (ARBITRAGES REQUIS)

### 📋 `BLOQ-INFRA-001` : Topographie Introuvable (Barrage Garde Sebou)
- **Domaine** : Qualité (Hydrologie)
- **Le Problème** : Vous possédez un historique riche de plus de 7 000 prélèvements de laboratoire attribués implicitement au "Barrage Garde Sebou". Cependant, dans le référentiel des stations de la nouvelle Production (WQDSS), ce barrage n'existe pas ou ne porte pas ce nom (Peut-être un code technique ?). L'informatique refuse d'insérer des actes de laboratoires à une station géographiquement "fantôme".
- **Impact Actuel** : Le chargement des données "Garde Sebou" est bloqué.
- **Requête de Validation / Option de Traitement** :
  - **[   ]** *L'ID de la station en prod existe : il s'agit du code _________*
  - **[   ]** *Veuillez demander aux développeurs de créer informatiquement cette station sous le nom générique "Barrage Garde Sebou".*

---

### 📋 `BLOQ-QUAL-001` : Ambiguïtés du Vocabulaire Chimique
- **Domaine** : Qualité Physico-Chimique (Rivières, Nappes, Barrages)
- **Le Problème** : Les anciens fichiers Excel regorgent d'acronymes de laboratoire différents pour décrire le même paramètre. Dans ces termes barbares, nos ingénieurs ont été frappés par quelques occurrences extrêmement ambigües mais représentant des milliers de relevés : `H_G`, `sat`, `PTD`, etc. (S'agit-il du Mercure Hg ou des Huiles et Graisses HG ? S'agit-il de saturation ?).
- **Impact Actuel** : Pour ne pas corrompre vos futurs tableaux de bord décisionnels, ces paramètres (plus de 3 700 lignes) sont temporairement étiquetés comme "Non Validés" et écartés de la vue métier.
- **Requête de Validation / Option de Traitement** :
  - Fournir la confirmation scientifique via la fiche d'arbitrage (*cf. rapport d'Arbitrage LOT 4A-1 - Doc 16*). Par exemple: Cocher que `H_G` est le Mercure, que son unité cible sera `mg/L`.

---

### 📋 `BLOQ-IDP-001` : Carence Logique des Plateformes de Rejet
- **Domaine** : IDP (Inventaire Droits de Prélèvement / Pollutions Ponctuelles)
- **Le Problème** : Pour intégrer formellement un prélèvement de pollution pris à la buse d'une Décharge ou d'une Usine, le système WQDSS dispose de tiroirs géographiques (`Rejet_Urbain`, `Rejet_Industriel`, `Abattoir`...). Or, les usines ou communes monitorées dans vos anciens classeurs "IDP" ne semblent pas toutes exister dans cette topographie.
- **Impact Actuel** : Les données ponctuelles de certaines industries ou villes bloqueraient la synchronisation s'il n'y a pas "l'usine cible" correspondante où associer la donnée.
- **Requête de Validation / Option de Traitement** :
  - **[   ]** *Laissez l'algorithme "Orpheliner" la donnée. Elle remontera sur le SI WQDSS mais sera privée d'identité communale claire.*
  - **[   ]** *Veuillez programmer le code pour que le système crée l'usine / le rejet virtuellement dans WQDSS lorsqu'elle est absente du répertoire.*

---

### 📋 `BLOQ-IDP-002` : Fragmentation des Tableaux 2024
- **Domaine** : Architecture et Pollution Ponctuelle (IDP)
- **Le Problème** : L'ingestion des archives de l'année 2024 a été scindée par précaution en 4 tiroirs/fichiers distincts (Exemple : "Qualité Globale" vs "Marché Cadre"). S'agit-il de la même nature de donnée ? Maintenir cette séparation alourdit mathématiquement vos tableaux décisionnels et pourrait engendrer des compteurs en double si un rejet apparait dans les deux "marchés".
- **Impact Actuel** : Le Dry-run attend votre verdict pour fusionner ou non ces tiroirs.
- **Requête de Validation / Option de Traitement** :
  - **[   ]** *Ces tableaux sont fusionnables. Groupez les données (Union).*
  - **[   ]** *Non, les statistiques "Marché Cadre" doivent être strictement séparées des suivis "Globaux".*
