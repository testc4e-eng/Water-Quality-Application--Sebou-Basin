# Analyse de la clé métier

## Clés testées

- `(temps, barrage_id)`
- `(temps, barrage_id, parametre)`
- `(temps, barrage_id, type_mesure)`
- `(temps, barrage_id, time_step)`

## Résultat

### Cible actuelle

- clé physique cible : `(temps, barrage_id)`
- doublons dans `hydro.mesure_barrage` sur cette clé : `0`
- doublons sur la journée `(date(temps), barrage_id)` : `0`

### Source brute réelle

- clé ligne source : `(date_jr, ire_barrage, id)`
- clé métier brute minimale : `(date_jr, ire_barrage)`
- nombre de clés distinctes source : `84 832`
- nombre de lignes source : `85 166`
- doublons source sur `(date_jr, ire_barrage)` : `244` groupes, `334` lignes excédentaires, maximum `92`

### Source préparée `E0`

- `source_row_id` : stable (`r.id::text`)
- lignes au format `ctid` : `0`
- chaque `source_row_id` est répliqué sur plusieurs lignes à cause de l’explosion paramétrique
- doublons sur `source_row_id` seul : `85 001` groupes, maximum `4`
- doublons sur `(source_row_id, code_parametre_canonique)` : `0`

## Stabilité métier réelle

La vraie clé métier ne peut pas être réduite à `(temps, barrage_id)` si l’on veut porter les 5 paramètres métier :

- `NIVEAU_EAU`
- `VOLUME`
- `RESTITUTION`
- `APPORTS_HM3`
- `TRANSFERT`

Il faut au minimum :

- une clé polymorphe : `(temps, barrage_id, parametre[, type_mesure][, time_step])`

ou

- des tables spécialisées séparées par concept métier.

## Conclusion

La clé `(temps, barrage_id)` est stable **uniquement** pour le modèle cible actuel, qui écrase plusieurs concepts métier dans une même structure.
