# Plan de Snapping Progressif

La reconnexion doit se faire par étapes pour éviter de créer des connexions hydrauliquement absurdes (sauts de bassin).

## PASS 1 : Snapping Micro (< 5m)
- **Cible :** Undershoots et Gaps < 5m.
- **Méthode :** `ST_Snap` des endpoints sur les segments les plus proches.
- **Risque :** Très faible.

## PASS 2 : Snapping Small (5–25m)
- **Cible :** Gaps de continuité.
- **Méthode :** Validation automatique si les segments appartiennent au même sous-bassin (colonne `sous_bassi`).
- **Risque :** Modéré (possibilité de connecter deux oueds parallèles).

## PASS 3 : Snapping Validé (25–50m)
- **Cible :** Gaps importants.
- **Méthode :** Uniquement si `component_id` est différent et que la connexion débloque un chemin vers le barrage de garde.
- **Risque :** Élevé. Nécessite une validation QA.

## Règle d'Or
**JAMAIS de snapping automatique > 50m.** Les gaps supérieurs à 50m sont considérés comme des ruptures réelles de continuité (oueds s'enfonçant dans le sol, irrigation, etc.) ou des erreurs de digitalisation majeures nécessitant une correction manuelle QGIS.
