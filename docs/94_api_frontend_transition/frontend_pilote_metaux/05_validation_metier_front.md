# Validation métier frontend

Le pilote affiche un bloc de contrôles métier alimenté exclusivement par `/api/v1/qualite/metaux`.

| Contrôle | Attendu |
|---|---|
| `Mo` visible dans métaux | `> 0`, attendu backend validé : `11`. |
| `MO` absent des métaux | `0`. |
| `FM` exclu | `0`. |
| `F_M_MES` exclu | `0`. |
| `MO_METAL` exclu | `0`. |

## Interprétation

Si un contrôle devient rouge, le problème vient soit du backend spécialisé, soit d'une évolution de la vue SQL `api.v_qualite_metaux`. Le frontend ne doit pas corriger ces règles côté client par filtrage silencieux.
