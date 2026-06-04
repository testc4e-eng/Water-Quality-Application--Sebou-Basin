# Aide Decision Rapide

## TRUE_AMBIGUOUS

Utiliser :

- `ACCEPT_MATCH` si le candidat est clairement le bon
- `KEEP_SEPARATE` si les deux objets doivent rester differents
- `SAME_SITE_DIFFERENT_OBJECT` si c'est le meme lieu mais pas le meme objet metier
- `NEED_FIELD_VALIDATION` si seul le terrain peut trancher
- `WAIT_BUSINESS_DECISION` si le blocage est metier

## ORPHAN_REVIEW

Utiliser :

- `WAIT_SOURCE_FIX` si la source doit etre corrigee
- `INVALID_SOURCE_DATA` si la donnee ne peut pas etre exploitee
- `CREATE_NEW_SITE` si l'objet est valide mais n'a aucun master
- `NOT_USABLE` si l'objet ne doit pas entrer en preproduction
- `REVIEW_LATER` si vous manquez d'information

## Regle simple

- si vous etes sure : decidez
- si vous doutez mais la carte suffit : `KEEP_SEPARATE` ou `NOT_USABLE`
- si vous doutez et la carte ne suffit pas : `NEED_FIELD_VALIDATION` ou `WAIT_SOURCE_FIX`
