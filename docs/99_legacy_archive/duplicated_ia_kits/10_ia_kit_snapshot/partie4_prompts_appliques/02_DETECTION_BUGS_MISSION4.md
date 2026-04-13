# Detection Bugs - SAD Sebou 2026 Mission 4

RESUME GLOBAL :
Fragile

BUGS IDENTIFIES :
1. Le frontend construit une URL d'export `raw/export/...` qui n'existe pas dans le backend visible
   - type : confirme
   - impact : fonctionnel
   - niveau : majeur
   - justification : route construite dans le client, aucune route `raw/export` trouvee cote backend
   - references: [client.ts](/c:/dev/sad_sebou0210/sad_sebou2026/version%204/sad_sebou0210/frontend/src/api/client.ts#L274)

2. Le mode `instantaneous` dans l'hydrologie redirige en realite vers la vue `daily`
   - type : confirme
   - impact : calcul / affichage
   - niveau : majeur
   - justification : le mapping declare `latest`, puis il est ecrase par `api.v_measurements_daily`
   - references: [hydro.py](/c:/dev/sad_sebou0210/sad_sebou2026/version%204/sad_sebou0210/backend/app/routers/hydro.py#L57)

3. Le endpoint de login attrape toutes les exceptions, y compris les `HTTPException` deja construites
   - type : confirme
   - impact : robustesse / comportement API
   - niveau : mineur
   - justification : un payload invalide non-dict ou un `HTTPException` leve dans le `try` est remappe en `Invalid login payload`
   - references: [auth.py](/c:/dev/sad_sebou0210/sad_sebou2026/version%204/sad_sebou0210/backend/app/api/v1/auth.py#L39)

4. Le client frontend normalise `hauteur` et `apports_hm` avec un test de verite qui transforme `0` en `null`
   - type : confirme
   - impact : affichage / donnees
   - niveau : majeur
   - justification : `b.hauteur ? Number(b.hauteur) : null`
   - references: [client.ts](/c:/dev/sad_sebou0210/sad_sebou2026/version%204/sad_sebou0210/frontend/src/api/client.ts#L126)

5. Le client appelle des routes `/geojson/*` et `/stations/{id}/measurements` alors que le projet expose aussi une autre couche `layers` / `entities`, ce qui augmente le risque de confusion contractuelle
   - type : probable
   - impact : fonctionnel / regression
   - niveau : mineur
   - justification : coexistence de plusieurs contrats paralleles pour des besoins proches
   - references: [client.ts](/c:/dev/sad_sebou0210/sad_sebou2026/version%204/sad_sebou0210/frontend/src/api/client.ts#L178), [api_v1.py](/c:/dev/sad_sebou0210/sad_sebou2026/version%204/sad_sebou0210/backend/app/api/api_v1.py#L33)

BUGS A VERIFIER EN PRIORITE :
- comportement du dashboard hydro quand `aggregation=instantaneous`
- fonctionnement reel de l'export `raw`
- cas metier ou `hauteur=0` ou `apports_hm=0`
- comportement login sur payloads JSON invalides ou incomplets

RECOMMANDATIONS DE CORRECTION :
- P1 : corriger la route d'export ou supprimer la fonction frontend tant que le backend n'existe pas.
- P2 : corriger le mapping `instantaneous` dans `hydro.py`.
- P3 : remplacer les tests de verite par des tests `!= null` dans les normalizers frontend.

RISQUES SI NON CORRIGE :
- incoherences visibles dans les dashboards mission 4
- fonctions UI presentes mais non operationnelles
- interpretation metier erronee de certaines valeurs numeriques

CONCLUSION :
Le code contient quelques bugs concrets et plusieurs points de fragilite contractuelle qui peuvent impacter directement l'usage mission 4.
