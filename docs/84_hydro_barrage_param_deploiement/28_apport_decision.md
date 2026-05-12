# Harmonisation APPORT - Decision

## Decision

`APPORT_HARMONISATION_OK`

## Justification

- `APPORTS_HM3` a ete remplace par `APPORT` dans le referentiel canonique et dans `hydro.mesure_barrage_param`.
- Les valeurs numeriques sont inchangees : `value_delta_max = 0`.
- L'unite metier reste `Mm3/j`.
- `APPORTS_HM3` et `apports_hm3` restent des alias de compatibilite, pas des codes canoniques actifs.
- Les vues API et la MV dashboard hydrologie sont reconstruites avec `APPORT`.
- La compilation Python et le build frontend sont OK.

## Backlog residuel

| Classe | Anomalie | Statut |
|---|---|---|
| INFO | `apports_hm3` conserve comme alias API temporaire | non bloquant |
| INFO | avertissement Vite taille chunk | hors perimetre |

## Stop

Aucune phase suivante n'a ete lancee.
