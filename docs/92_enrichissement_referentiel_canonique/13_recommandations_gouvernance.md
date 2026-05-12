# Recommandations gouvernance referentiel

## Gouvernance parametres

Le referentiel canonique doit etre administre comme un objet metier central, pas comme une simple table technique.

Regles :

- un nouveau parametre doit avoir un code canonique, un nom, un domaine, une unite et un statut ;
- un parametre ambigu ne doit jamais etre active sans decision documentee ;
- un ancien code ne doit jamais etre supprime s'il existe dans l'historique ;
- les variantes doivent etre ajoutees comme alias avec source et type.

## Workflow creation parametre

Workflow recommande :

1. demande d'ajout ou detection ingestion ;
2. diagnostic d'existence par code, alias et libelle ;
3. verification unite et domaine ;
4. decision C4E ou client selon ambiguite ;
5. insertion referentiel proposee ;
6. validation par requetes QA ;
7. activation.

## Gestion alias

Les alias doivent porter au minimum :

- alias brut ;
- alias normalise ;
- type alias ;
- source ;
- statut ;
- date de creation ;
- commentaire decisionnel.

Types recommandes : historique, laboratoire, accent, analytique, legacy, metier, ingestion, typo, unite.

## Gestion legacy

Les parametres legacy doivent rester exploitables en ingestion et en lecture historique, mais ne doivent pas redevenir des codes canoniques si une cible valide existe.

Exemples :

- `RESTITUTION` reste alias de `LACHER` ;
- `APPORTS_HM3` reste alias legacy de `APPORT` ;
- `lacher_m3s` ne doit pas etre expose comme verite metier barrage ;
- les variantes qualite historiques restent des alias.

## Regles ingestion

Regles minimales :

- rejet de tout parametre inconnu en quarantaine ;
- rejet de tout alias collisionnel ;
- conversion uniquement si regle explicite ;
- conservation du libelle source dans l'audit ;
- conservation de l'unite source ;
- production d'un rapport d'ecarts a chaque ingestion.

## Versionning

Chaque evolution doit etre versionnee.

Champs ou tables recommandees :

- `version_ref` sur parametre ;
- table de log decisionnelle ;
- horodatage `updated_at` ;
- acteur `updated_by` ;
- statut de validation.

## Auditabilite

Toute correction de mapping doit pouvoir repondre a :

- quelle ligne source etait concernee ;
- quel parametre source etait utilise ;
- quel alias a matche ;
- quel `parametre_ref_id` a ete choisi ;
- quelle decision a autorise la correction ;
- quelle requete de rollback existe.

## QA continue

Controles periodiques recommandes :

- parametres actifs sans unite ;
- alias vides sur parametres utilises ;
- collisions d'alias ;
- parametres actifs sans domaine ou table cible ;
- parametres presents dans les tables finales mais absents du referentiel ;
- parametres non utilises depuis plus d'une periode definie ;
- unites incompatibles avec type metier.

## Recommandation finale

Valider d'abord l'enrichissement referentiel, puis appliquer les mappings surs. Les mappings probables et ambigus doivent rester hors correction automatique tant qu'une decision C4E/client n'est pas documentee.

