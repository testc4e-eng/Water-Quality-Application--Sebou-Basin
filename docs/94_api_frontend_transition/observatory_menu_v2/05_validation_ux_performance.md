# Validation UX et performance

## Validations réalisées

| Contrôle | Résultat |
|---|---|
| Menu V2 isolé du legacy | OK |
| Catalogue local sans appel API | OK |
| Aucun appel valeurs avant `Afficher` | OK par architecture `submittedSelection` |
| Familles non disponibles marquées `à venir` | OK |
| Endpoints P0 utilisés | OK |
| Build Vite | OK |
| Ancien dashboard conservé | OK |

## Build

Commande :

```powershell
npm run build
```

Résultat :

- Build OK.
- 3043 modules transformés.
- Avertissement non bloquant : bundle principal > 500 kB. A traiter par code-splitting avant généralisation.

## Validations navigateur restantes

- Vérifier visuellement l'absence d'appel API à l'ouverture du menu V2.
- Tester `Qualité de l'eau > Métaux > Mo > Afficher`.
- Tester `Pollution organique > MO > Afficher`.
- Vérifier que `FM`, `F_M_MES`, `MO_METAL` n'apparaissent pas dans le catalogue.
