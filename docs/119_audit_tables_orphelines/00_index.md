# 119 — Audit des tables orphelines (base `abh_sad`)

**Date** : 2026-07-27. Audit **strictement en lecture seule** (connexion
`sad_app`, base native hôte). Croisement : inventaire `pg_class` ↔ références
`schema.table` dans `backend/app` (runtime) et `backend/scripts` (one-shots).

**Aucune suppression n'a été exécutée.** Le script de quarantaine proposé
([01_quarantine_script.sql](01_quarantine_script.sql)) déplace les objets vers
un schéma d'archive au lieu de les supprimer — réversible par simple
`ALTER TABLE ... SET SCHEMA`. À exécuter uniquement après validation du chef
de projet, hors période de démonstration.

## Synthèse par schéma

| Schéma | Taille | Verdict |
|--------|-------:|---------|
| `qa_dry_run` | **1 237 Mo** | **ORPHELIN CONFIRMÉ** — 7 tables d'artefacts du dry-run de migration qualité (dont `e0_mesures_preparees`, 1 019 Mo). Zéro référence dans app/ ET scripts/. La migration est clôturée (DEC-001, 2026-05-08). → candidat quarantaine n°1 |
| `staging` | 426 Mo | **CONSERVER** — 4 tables `raw_idp_*` référencées par le runtime ; les ~47 autres `raw_*` sont les chargements sources d'origine (lignage/traçabilité des phases A/B) et le schéma reste le sas d'ingestion du module 114 |
| `geo_work` | 192 Mo | **MIXTE** — 10 objets vivants (topologie réseau : `edges_final`, `nodes`, candidats `20260602`, matrice v2 `20260724`) ; ~19 objets intermédiaires de fabrication (gapfixed, valides, noded_20260602, backups, gaps résiduels) sans référence code → candidats quarantaine. Les 2 rasters MNT (`mnt_sebou_20260602*`, 147 Mo) sont utilisés hors runtime par les paquets QGIS d'arbitrage hydraulique (docs/43) → conserver |
| `analytics` | 495 Mo | Vivant (3 vues matérialisées, 14 références runtime) |
| `swat_output` / `wasp_output` / `wasp_sebou` / `swat_sebou` | 311 Mo | Vivants (références runtime) — gel SWAT/WASP en vigueur, ne pas toucher |
| `api`, `metadata`, `hydro`, `meteo`, `qualite`, `infra`, `geo`, `admin`, `security`, `audit`, `data_admin`, `qa`, `modeles`, `monitoring` | — | Vivants (schémas cœur, tous référencés) |
| `public` | 7 Mo | 1 table + 4 vues résiduelles, 2 références code — reliquat déjà géré par la quarantaine des routeurs legacy (supprimés au commit `82fa880`) ; vérifier les 2 références avant toute purge |
| `_timescaledb_*`, `timescaledb_*` | 1,8 Go | Internes TimescaleDB — ne jamais toucher |

## Gain potentiel de la quarantaine proposée

- `qa_dry_run` complet : **~1,24 Go**
- Intermédiaires `geo_work` (hors MNT et objets vivants) : **~30 Mo**
- Total récupérable après validation puis DROP différé : **~1,27 Go** (sur une
  base de ~5,4 Go hors internals)

## Procédure recommandée

1. Valider ce rapport (chef de projet).
2. Exécuter `01_quarantine_script.sql` (déplacement vers `zzz_archive_2026`,
   réversible) — **pas avant la démo de mardi**.
3. Période d'observation (2 semaines de runtime sans erreur).
4. Alors seulement : `DROP SCHEMA zzz_archive_2026 CASCADE` (destructif),
   précédé d'un `pg_dump` du schéma d'archive.
