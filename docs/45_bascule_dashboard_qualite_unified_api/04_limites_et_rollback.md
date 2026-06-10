# Limites et Plan de Rollback

La migration du Dashboard Qualité est finalisée. Cependant, certaines limites et contraintes restent à garder à l'esprit.

## 1. Limites actuelles
- Les filtres et classifications avancés au niveau frontend doivent supporter des paramètres nuls si certaines tables (comme `BARRAGE`) remontent moins de champs de référence.
- Le paramètre optionnel `stationId` dans certains hooks exige une surveillance si on filtre sur un support (ex: l'identifiant 1355/8 n'est pas forcément présent dans les Barrages). Le reset de `stationId` au changement de `supportType` dans l'UI mitige ce risque.

## 2. Procédure de Rollback Rapide
Étant donné que les modifications ne touchent que l'appel API dans `frontend/src/api/qualityRegulatory.ts`, un retour arrière est réalisable en 1 seule étape en modifiant la destination de la route :
```typescript
// Retour aux anciennes URL :
export async function getQualityStations() {
  const { data } = await api.get("/quality/stations");
  return data;
}
```
Les composants frontends qui n'utilisaient pas le `supportType` l'ignoreront tout simplement sans crasher.

## 3. Statut Dashboard DG
Le Dashboard DG n'a pas été touché et est protégé par son isolation dans d'autres fichiers (`home_service.py` etc.). Il restera sur son implémentation actuelle.
