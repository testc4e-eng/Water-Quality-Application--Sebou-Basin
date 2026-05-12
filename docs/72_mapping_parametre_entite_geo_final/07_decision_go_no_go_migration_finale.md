# Décision GO / NO GO migration finale

**Décision : `GEO_MAPPING_BLOCKED`**

## Blocages retenus
- `hydro.mesure_barrage` : GEO_OK sur le rattachement, mais modèle métier barrage encore à remanier avant migration finale (`niveau`, `volume`, `restitution`, `apports`, `transfert`).
- `hydro.mesure_debit_source` : statuts=GEO_AMBIGU ; actions=RATTACHER_MANUELLEMENT
- `staging.raw_idp_2024_mesures_qualite_globale` : statuts=GEO_AMBIGU, GEO_NO_REF, GEO_NO_XY, GEO_XY_OK ; actions=BACKLOG_GEO, EXCLURE_TEMPORAIREMENT, MIGRER_AVEC_FLAG, RATTACHER_MANUELLEMENT
- `staging.raw_idp_2024_mesures_qualite_marche_cadre` : statuts=GEO_AMBIGU, GEO_NO_REF ; actions=BACKLOG_GEO, RATTACHER_MANUELLEMENT
- `staging.raw_idp_2024_src_pollution_globale` : statuts=GEO_AMBIGU, GEO_NO_REF, GEO_NO_XY, GEO_XY_OK ; actions=BACKLOG_GEO, EXCLURE_TEMPORAIREMENT, MIGRER_AVEC_FLAG, RATTACHER_MANUELLEMENT
- `staging.raw_idp_2024_src_pollution_marche_cadre` : statuts=GEO_AMBIGU, GEO_NO_REF ; actions=BACKLOG_GEO, RATTACHER_MANUELLEMENT
- `wasp_sebou.wasp_results` : statuts=GEO_OK ; actions=BACKLOG_REFERENTIEL
