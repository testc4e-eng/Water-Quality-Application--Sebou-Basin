# Decision geo apres correction

## Statut

**GEO_BLOCKED**

## Resultat IDP 2024 avec buffer 2 m

- Lignes IDP testees : `8899`
- Lignes rattachees `<= 2 m` : `816`
- Lignes ambiguës `<= 2 m` : `3790`
- Lignes orphelines `> 2 m` ou sans candidat : `4293`
- Nouveau taux global de rattachement geo : `99.27%`

## Lecture metier

- La regle XY `<= 2 m` permet de requalifier une partie des lignes IDP sans toucher aux donnees.
- Les problemes spatiaux restent des flags QA et non des blocages automatiques s'il existe un rattachement geo unique.
- Les incoherences de referentiel restent a traiter une par une.

## Blocages restants

- 4293 lignes IDP restent GEO_ORPHAN_XY_2M apres buffer 2 m
- 3790 lignes IDP restent GEO_AMBIGUOUS_XY_2M apres buffer 2 m
- staging.raw_suivi_qualite_brg_garde_hebdo reste sans cle geo exploitable
