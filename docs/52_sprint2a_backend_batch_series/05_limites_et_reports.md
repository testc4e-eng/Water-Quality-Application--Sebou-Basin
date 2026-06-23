# 5. Limites et Reports

Ce document confirme les limites du Sprint 2A selon le cahier des charges :

- **Pas d'interpolation temporelle** : Les séries sont retournées telles quelles. C'est au frontend (Zustand + Recharts) de synchroniser les axes X.
- **Pas de mathématiques en base** : `/compare` et `/statistics` ne sont pas implémentés.
- **Limitation absolue à 20 séries** : Tout dépassement lève immédiatement une 422 Unprocessable Entity.
- **Pas d'export natif Backend** : Pas d'endpoint `/export`.
- L'URL finale est bien intégrée dans le routeur principal via `prefix="/business-map/analysis"`.
