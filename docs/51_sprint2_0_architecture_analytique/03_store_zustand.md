# 3. Choix du Store Frontend : Zustand

## Décision
`STORE = Zustand`

## Justification
Bien que le Sprint 1 reposait sur des états locaux React (`useState`) et de l'injection de Props, la V2 requiert une architecture complexe où la carte, la barre latérale et les panneaux d'analyse sont fortement couplés mais topologiquement éloignés dans l'arbre DOM. 

1. **Performances** : Zustand permet de re-rendre de manière chirurgicale uniquement les composants abonnés aux parties spécifiques du state (par exemple, uniquement le composant Graphique lorsque la donnée `selectedSeries` change, sans re-rendre la Map).
2. **Prop Drilling** : Évite de passer `selectedSeries` et `addSeries` en props depuis `DashboardCartoMetier.tsx` jusqu'au plus profond de `BusinessRightPanelV1.tsx`.
3. **Simplicité** : Plus léger que Redux, pas de boilerplate de reducers.
4. **Interaction Carte/Panneaux** : Permet à la Map de déclencher une action `addSeries(feature)` depuis un clic GeoJSON, et aux panneaux d'y accéder instantanément. Idéal pour un concept de Workspace cartographique interactif.

Le fichier `frontend/src/store/useAnalysisWorkspaceStore.ts` sera créé au Sprint 2B.
