# LOT 4A-4 : Rapport d'Arbitrage IDP et Qualité Ponctuelle

Cher Client / ABH,

Dans le cadre de l'ingestion massive des Inventaires de Pollution (IDP 2024 et historiques), notre algorithme s'arrête face à une fracture structurelle fondamentale :

### Question 1 : Le Référentiel Infra (L'empreinte au sol)
Les prélèvements Qualité (DBO5, Azote...) relatifs aux Décharges ou Rejets Ind. se réfèrent à des points géographiques dans la Sandbox. **Sont-ils déjà répertoriés dans votre réseau Production `infra.rejet_*` actuel ?** 
Si oui, quelle est la clé de fusion (Code Rejet) ? Si non, devons-nous concevoir l'Upsert pour qu'il **crée le Rejet** s'il n'existe pas ?

### Question 2 : Le Dénominateur Commun des tables
Pourquoi l'année 2024 possède 4 tables distinctes (Globale vs Marché Cadre) ? Sont-ce des doublons ou des extensions scientifiques ?

