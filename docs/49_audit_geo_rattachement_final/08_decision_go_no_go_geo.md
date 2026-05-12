# Decision go / no-go geo

## Statut

**GEO_BLOCKED**

## Blocages critiques

- raw_idp_2024_mesures_qualite_globale
- raw_idp_2024_mesures_qualite_marche_cadre
- raw_idp_2024_src_pollution_globale
- raw_idp_2024_src_pollution_marche_cadre
- raw_suivi_qualite_brg_garde_hebdo
- problemes spatiaux: geo.nappe
- problemes spatiaux: geo.source
- problemes spatiaux: geo.sous_bassin_abh
- problemes spatiaux: geo.sous_bassin_swat_beht
- problemes spatiaux: geo.sous_bassin_swat_moyen_sebou
- problemes spatiaux: geo.sous_bassin_swat_ouergha
- problemes spatiaux: infra.decharge
- problemes spatiaux: infra.decharge_inventaire_pollution
- problemes spatiaux: infra.decharge_inventaire_pollution_general
- problemes spatiaux: infra.huilerie
- problemes spatiaux: infra.huilerie_inventaire_pollution
- problemes spatiaux: infra.mine
- problemes spatiaux: infra.mine_inventaire_pollution
- problemes spatiaux: infra.point_eau
- problemes spatiaux: infra.rejet_abattoir
- problemes spatiaux: infra.rejet_abattoir_inventaire_pollution
- problemes spatiaux: infra.rejet_domestique
- problemes spatiaux: infra.rejet_industriel
- problemes spatiaux: infra.stations
- problemes spatiaux: infra.stations_mesure

## Blocages non critiques

- staging.raw_barrages_abhs
- staging.raw_points_eau_abhs
- staging.raw_rejets_domestiques_abhs
- staging.raw_rejets_ind_abhs
- staging.raw_rejets_abattoirs_abhs
- staging.raw_step_abhs
- staging.raw_step_ind_abhs
- staging.raw_decharges_abhs
- staging.raw_huileries_abhs
- staging.raw_mines_abhs
- staging.raw_stm_abhs

## Actions avant Lot E0

- Verifier les tables critiques avec lignes orphelines avant tout dry-run.
- Arbitrer les homonymes et doublons geographiques detectes sur les stations et barrages.
- Corriger ou neutraliser les geometries invalides / hors bassin si elles servent au rattachement final.
- Completer les codes manquants pour les tables IDP 2024 si l'IRE ne permet pas un rattachement unique.

## Actions possibles apres migration

- Ajouter une couche QA geographique avec statut de rattachement par ligne migree.
- Enrichir `metadata` avec regles de rattachement et seuils de distance valides.
