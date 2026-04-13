# Clarification des Objectifs - SAD Sebou 2026

## 1. Synthese rapide
- Le projet doit fournir un SAD exploitable pour l'ABHS Sebou autour de la qualite des eaux, de l'hydrologie et des donnees SIG.
- Les objectifs sont globalement lisibles, mais trop larges s'ils ne sont pas separes entre MVP mission 4 et industrialisation ulterieure.
- L'enjeu principal est de transformer un besoin "plateforme complete" en objectifs mesurables et actionnables pour l'equipe.
- Niveau de clarte des objectifs: Moyen.

## 2. Objectifs exprimes initialement
- Centraliser les donnees utiles a la decision.
- Integrer les resultats des modeles hydrologiques et de qualite.
- Visualiser les indicateurs sur cartes et dashboards.
- Produire du reporting.
- Permettre l'exploitation et la maintenance du SAD.

## 3. Objectifs clarifies

### Objectifs metier
- Donner a l'ABHS une vision consolidee de l'etat des eaux de surface sur le bassin du Sebou.
- Soutenir les analyses croisees entre territoires, stations, barrages et indicateurs.

### Objectifs operationnels
- Consulter les couches de reference et les entites metier.
- Acceder aux dashboards climat, hydro et qualite.
- Exploiter les resultats SWAT dans les parcours d'analyse.
- Permettre a l'administration de consulter et corriger certaines donnees.

### Objectifs techniques
- Stabiliser les endpoints consommes par le frontend.
- Garantir des sorties GeoJSON correctes, homogenes et reutilisables.
- Encadrer le CRUD generique.
- Ameliorer progressivement tests, securite et maintenance.

### Objectifs lies aux donnees
- Qualifier les vues et tables critiques.
- Assurer coherence entre objets spatiaux et series temporelles.
- Documenter les sources, unites, referentiels et dependances.

## 4. Analyse de coherence
- Alignement avec le probleme: bon.
- Alignement avec les contraintes: partiel, car les objectifs restent plus larges que les moyens visibles.
- Alignement avec les moyens existants: bon pour le coeur applicatif, moyen pour l'industrialisation.
- Incoherences observees:
  - ambition "plateforme complete" vs socle de tests/ops encore limite
  - reporting evoque mais encore peu formalise

## 5. Points forts
- Objectif de centralisation deja bien avance.
- Objectif de visualisation SIG deja concret.
- Objectif d'integration modeles deja present via SWAT et dashboards.

## 6. Points faibles
- Objectifs parfois trop globaux.
- Peu de criteres de succes explicites.
- Peu de separation entre court terme et evolutions futures.

## 7. Priorisation proposee
| Objectif | Type | Priorite | Justification | Horizon |
|---|---|---|---|---|
| Stabiliser couches et objets SIG critiques | Technique / donnees | Haute | Base de toute lecture mission 4 | Court terme |
| Fiabiliser dashboards climat/hydro/qualite | Operationnel | Haute | Valeur directe ABHS | Court terme |
| Consolider integration SWAT | Metier / technique | Haute | Lien avec missions precedentes | Court terme |
| Encadrer `raw` et gouvernance des mises a jour | Donnees / securite | Haute | Risque fort | Court terme |
| Formaliser schema, tests, CI/CD | Technique | Moyenne | Industrialisation necessaire | Moyen terme |
| Etendre reporting avance | Operationnel | Moyenne | Important mais non bloquant pour MVP | Moyen terme |

## 8. Proposition de reformulation
- Formulation actuelle: "Developper le SAD mission 4"
  - formulation recommandee: "Consolider et rendre exploitable le SAD Sebou pour la consultation cartographique, les dashboards hydro-qualite et l'integration SWAT"
  - critere de reussite: parcours utilisateurs critiques fonctionnels et stables

- Formulation actuelle: "Faire le reporting"
  - formulation recommandee: "Produire les sorties de reporting prioritaires definies avec l'ABHS a partir des indicateurs et couches valides"
  - critere de reussite: liste de rapports ou exports cibles validee

- Formulation actuelle: "Gerer les donnees"
  - formulation recommandee: "Securiser et tracer les flux de consultation et de mise a jour des donnees critiques mission 4"
  - critere de reussite: regles d'acces et perimetre admin definis

## 9. Bonnes pratiques
- Metier: definir d'abord les decisions a soutenir.
- Redaction d'objectifs: utiliser des verbes verifiables.
- Donnees: relier chaque objectif a une source de donnees identifiable.
- Projet/dev: distinguer MVP, consolidation et evolutions.

## 10. Propositions
- Proposition 1: confirmer immediatement les objectifs MVP mission 4.
  - objectif concerne: exploitation ABHS
  - raison: eviter dispersion
  - benefice attendu: focus equipe
- Proposition 2: reformuler les objectifs reporting.
  - objectif concerne: reporting
  - raison: trop vague
  - benefice attendu: livrables clairs
- Proposition 3: reporter les extensions non critiques.
  - objectif concerne: fonctions avancees non indispensables
  - raison: ne pas surcharger la mission 4
  - benefice attendu: meilleure priorisation

## 11. Recommandations
- Recommandation principale: exprimer la mission 4 comme un ensemble d'objectifs verifies par usages reels et non comme une ambition generique de plateforme.
- Objectifs a valider avec l'equipe/client:
  - liste des parcours prioritaires
  - livrables de reporting
  - niveau d'edition des donnees permis
  - criteres de validation SIG
- Sous-etape suivante recommandee: Identification des donnees.

## 12. Questions ouvertes
- Quels tableaux de bord sont obligatoires pour la reception mission 4 ?
- Quelles sorties de reporting doivent etre livrees ?
- Quelles fonctions sont reservees aux admins ?
- Quelles couches SIG sont consideres comme officielles ?
