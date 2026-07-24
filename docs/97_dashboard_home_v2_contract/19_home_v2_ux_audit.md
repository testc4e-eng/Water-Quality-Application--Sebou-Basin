# Home V2 UX audit

## Résolutions auditées

- `1920x1080`
- `1600x900`
- `1366x768`

Captures utilisées :

- `C:\dev\WQDSS\repo_git\artifacts\screenshots\dashboards\audit_home_1920_loaded.png`
- `C:\dev\WQDSS\repo_git\artifacts\screenshots\dashboards\audit_home_1600.png`
- `C:\dev\WQDSS\repo_git\artifacts\screenshots\dashboards\audit_home_1366.png`

## Espace perdu

### Constats

- le Home n’a plus de gros vides structurels en desktop large ;
- la ligne A est correctement densifiée, mais reste légèrement généreuse sur `1366x768` ;
- le panneau droit carte reste un peu haut visuellement à cause des deux cartes empilées ;
- la ligne C est utile mais entre déjà dans le premier écran sur `1366x768`, ce qui compresse encore la perception de la carte ;
- la note métier basse est désormais fine et ne constitue plus une zone blanche problématique.

### Zones encore perfectibles

- réduire encore légèrement la hauteur visuelle perçue du panneau décision ;
- garder la ligne C visible mais moins dominante sur `1366x768` si une future passe de micro-optimisation est engagée.

## Hiérarchie visuelle

### Ce qui attire correctement l’œil

- la carte métier ;
- le bandeau KPI critique ;
- le panneau alertes à droite ;
- les KPI opérationnels de la ligne A.

### Ce qui doit rester secondaire

- la note température / avertissement scientifique ;
- les détails qualité sentinelle ;
- les mini tendances.

### Conclusion

La hiérarchie est maintenant cohérente avec un cockpit opérationnel :

- `Carte > Alertes > Recommandations > KPI > Synthèse basse`

## Densité informationnelle

### 1920x1080

- lecture possible sans scroll significatif ;
- carte complètement visible ;
- ligne C visible en grande partie ;
- densité adaptée à une démonstration DG.

### 1600x900

- cockpit encore lisible ;
- carte dominante ;
- début de ligne C visible sans dégrader la lecture.

### 1366x768

- interface exploitable ;
- carte visible immédiatement ;
- scroll faible mais non nul selon zoom navigateur ;
- la sidebar compacte automatique est nécessaire et justifiée.

## Ratio information / espace vide

Estimation qualitative :

- avant cockpit : `moyen`
- après cockpit compact + full width : `bon`

Le dashboard a désormais une densité institutionnelle crédible, sans tomber dans la surcharge.

## Conclusion

- UX Home V2 : `GOOD_FOR_DEMO`
- encore améliorable en micro-compactage sur `1366x768`
- niveau actuel compatible démonstration DG / exploitation

