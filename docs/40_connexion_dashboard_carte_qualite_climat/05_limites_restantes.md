# Limites Restantes

- le contrat `GET /api/v1/dashboard/home` n’expose toujours pas nativement la liste détaillée des 6 stations ; l’accueil s’appuie donc sur `GET /api/v1/quality/stations-with-timeseries`
- la pluie récente disponible en base est très partielle à date :
  - `1` point seulement dans la fenêtre runtime courante
- le débit récent runtime est lui aussi parcellaire :
  - `3` points seulement dans la fenêtre runtime courante
- certaines stations cartographiques `pluvio` n’ont pas encore de mesure exploitable rattachée ; le popup affiche alors correctement `A_VALIDER`
- `commune/province` des stations sont déduites par jointure spatiale avec `admin.communes` quand absentes du support source
- la validation visuelle complète du popup au clic n’a pas été automatisée ici faute de clic Playwright interactif disponible dans cet environnement, mais le contrat backend détaillé a été validé

## Mises à jour documentaires recommandées

À répercuter ensuite dans les documents maîtres :

- `docs/03_ai_knowledge_base/api_for_agents.md`
  - ajouter `GET /api/v1/quality/stations-with-timeseries`
  - ajouter `GET /api/v1/dashboard/trends`
  - préciser que `GET /api/v1/map/entities/{entity_id}` accepte aussi `group_code` + `support_code`

- `docs/03_ai_knowledge_base/project_structure_for_agents.md`
  - référencer `docs/40_connexion_dashboard_carte_qualite_climat/`

- `docs/03_ai_knowledge_base/architecture_for_agents.md`
  - signaler que la couche runtime Home consomme désormais des endpoints complémentaires pour les stations qualité réelles et les tendances BD
