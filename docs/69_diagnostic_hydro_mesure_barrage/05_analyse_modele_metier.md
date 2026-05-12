# Analyse du modèle métier

## Réponse explicite aux questions métier

### 1. Le modèle actuel supporte-t-il correctement les paramètres validés ?

| Paramètre métier | Support actuel | Verdict |
|---|---|---|
| `Niveau_eau_barrage` | `cote_m` | partiellement oui |
| `Volume_barrage` | `volume_mm3` | oui |
| `Restitution_barrage` | `lacher_m3s` | non, unité et sémantique incohérentes |
| `Apports_barrage` | aucun support | non |
| `Transfert_barrage` | aucun support | non |

### 2. Plusieurs concepts métier incompatibles sont-ils mélangés ?

Oui.

La source `raw_mesures_niv_eau_barrages` est une ligne journalière **multi-mesures** :

- `66 746` lignes portent `3` paramètres simultanément
- `18 411` lignes portent `4` paramètres simultanément
- `9` lignes portent `2` paramètres simultanément
- moyenne des lignes multi-paramètres : `3.22` paramètres par ligne

La cible, elle, n’est dimensionnée que pour :

- niveau
- volume
- pseudo-lâcher

### 3. Le modèle actuel est-il une table polymorphe valide ?

Non.

La table actuelle n’est ni :

- une vraie table polymorphe (`parametre`, `valeur`, `unite`, `type_mesure`)

ni

- un vrai modèle spécialisé complet

Elle est une **fusion partielle** de plusieurs concepts métier.

## Lecture technique

La structure actuelle :

```text
(temps, barrage_id) -> cote_m, volume_mm3, lacher_m3s
```

ne permet pas de représenter proprement :

- `Apports_barrage`
- `Transfert_barrage`
- `Restitution_barrage` si l’unité métier reste `Mm³`
- l’attribut `reference_altitude = NGM`
- le type de transfert (`inter_barrage`, `inter_bassin`, `inconnu`)

## Conclusion

Le modèle cible actuel est une **fusion incorrecte de plusieurs concepts métier**.
