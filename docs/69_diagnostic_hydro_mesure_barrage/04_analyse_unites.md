# Analyse des unités

## Source métier validée

| Paramètre | Unité métier validée |
|---|---|
| `Niveau_eau_barrage` | `m` avec référence `NGM` |
| `Volume_barrage` | `Mm³` |
| `Restitution_barrage` | `Mm³` |
| `Apports_barrage` | `Mm³` |
| `Transfert_barrage` | `Mm³` |

## Cible actuelle

| Colonne cible | Sens métier supposé | Unité portée |
|---|---|---|
| `cote_m` | niveau d’eau | `m` |
| `volume_mm3` | volume barrage | `Mm³` |
| `lacher_m3s` | restitution / lâcher | `m3/s` |

## Diagnostic

### Cohérent

- `cote_m` est compatible avec `Niveau_eau_barrage`
- `volume_mm3` est compatible avec `Volume_barrage`

### Incohérent

- la source porte `restitutions_mm3` en `Mm³`
- la cible porte `lacher_m3s` en `m3/s`
- sans règle métier de conversion explicite, ce n’est **pas** le même indicateur

### Non représenté

- `apports_mm3`
- `transfert_mm3`

## Contradictions de valeur déjà présentes

Les écarts `source -> cible` sur les champs actuellement portés sont faibles et relèvent du **rounding** :

### Niveau d’eau

- conflits stricts : `2 334`
- écart absolu min : `0.001`
- écart absolu max : `0.005`
- écart moyen : `0.00286`

### Volume

- conflits stricts : `350`
- écart absolu min : `0.001`
- écart absolu max : `0.005`
- écart moyen : `0.00250`

## Conclusion

Les unités ne bloquent pas `NIVEAU_EAU` ni `VOLUME`.

Le blocage d’unité concerne surtout :

- `RESTITUTION` vs `lacher_m3s`
- l’absence de colonnes cibles pour `APPORTS` et `TRANSFERT`
