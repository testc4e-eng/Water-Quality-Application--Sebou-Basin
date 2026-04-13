# Workflow test fonctionnel — `/admin/popup-rules`

## 1) Pré-requis
- Backend démarré (`/api/v1` accessible).
- Frontend démarré.
- Table `metadata.popup_rules_config` existante (déjà créée via `setup_db.py`).

## 2) Smoke-test API automatisé (CRUD + cache)
Commande:

```powershell
python c:\dev\WQDSS\repo_git\backend\scripts\smoke_observatory_popup_rules.py --base-url http://127.0.0.1:8011/api/v1
```

Option avec token:

```powershell
python c:\dev\WQDSS\repo_git\backend\scripts\smoke_observatory_popup_rules.py --base-url http://127.0.0.1:8011/api/v1 --token <JWT>
```

Validation attendue:
- `SMOKE TEST SUCCESS`

## 3) Test fonctionnel UI (admin)
1. Ouvrir `/admin/popup-rules`
2. Vérifier la liste des couches.
3. Sélectionner une couche (ex: `sources`).
4. Modifier `name_fields`, `type_fields`, `code_fields`.
5. Cliquer `Enregistrer`.
6. Cliquer `Clear cache observatory`.
7. Vérifier que la ligne est bien active/à jour.

## 4) Test fonctionnel carte (popup)
1. Depuis `/admin/popup-rules`, cliquer `Ouvrir Dashboard Cartographique (test popup)`.
2. Activer la couche testée.
3. Cliquer une entité.
4. Vérifier popup:
   - Nom lisible (pas seulement `id`/`uid`)
   - Type/classe/code cohérents
5. Revenir admin, ajuster les champs si nécessaire, re-tester.

## 5) Critères d’acceptation
- CRUD règles popup OK.
- Clear cache effectif.
- Popup carto affiche en priorité `nom`/`code métier`.
- Aucun fallback “bruité” sur des IDs techniques si un nom existe.
