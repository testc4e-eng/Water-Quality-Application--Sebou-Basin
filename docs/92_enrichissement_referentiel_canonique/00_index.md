# Enrichissement referentiel canonique

## Objet

Renforcer `metadata.referentiel_parametre_canonique` pour en faire le referentiel metier central des parametres.

## Mode

Audit initial read-only, puis enrichissement referentiel execute apres validation C4E.

## Livrables

| Fichier | Role |
|---|---|
| `01_audit_structure_referentiel_actuel.md` | audit structure et completude |
| `02_limites_referentiel_actuel.md` | limites et dette technique |
| `03_dictionnaire_metier_normalise.md` | dictionnaire cible normalise |
| `04_alias_et_variantes.md` | dictionnaire alias et variantes |
| `05_nouveaux_parametres_a_creer.md` | nouveaux parametres proposes |
| `06_parametres_legacy_a_conserver.md` | legacy a conserver comme alias |
| `07_parametres_ambigus_a_valider.md` | ambiguites restantes |
| `08_proposition_modele_referentiel_v2.md` | modele cible v2 |
| `09_sql_enrichissement_referentiel_NON_EXECUTE.sql` | SQL propose non execute |
| `10_sql_validation_post_enrichissement.sql` | controles post-enrichissement |
| `11_plan_migration_referentiel.md` | plan de migration |
| `12_impact_dashboards_et_ia.md` | impact dashboards / IA |
| `13_recommandations_gouvernance.md` | gouvernance |
| `14_reconciliation_tableau_metier_vs_referentiel.md` | reconciliation dictionnaire C4E / referentiel |
| `15_decisions_metier_finales_parametres.md` | decisions metier finales apres validation C4E |
| `16_sql_enrichissement_referentiel_FINAL_VALIDATION_REQUISE.sql` | script final propose, non execute |
| `17_sql_validation_referentiel_FINAL.sql` | controles post-enrichissement final |
| `18_decision_unite_hm3_apport_transfert.md` | decision unite `hm3` / `Hm3` / `HM3` vers `Mm3` |

## Synthese

| Indicateur | Valeur |
|---|---:|
| parametres existants | 92 |
| parametres qualite existants | 81 |
| lignes dictionnaire C4E | 126 |
| variantes C4E brutes | 262 |
| alias vides | 87 |
| unites manquantes | 59 |
| table cible manquante | 87 |
| nouveaux parametres proposes prioritaires | 19 |
| cas sortis des ambiguites artificielles | 18 |
| ambiguites restantes confirmees | 3 |
| volume REF-001 a REF-004 corrigeable apres enrichissement | 62361 |
| volume restant non mappe apres enrichissement | 12 |

## Maturite

| Etat | Niveau |
|---|---|
| actuel | referentiel structurel incomplet, utilisable partiellement |
| cible v2 | referentiel canonique enrichi, compatible ingestion, QA, dashboards et IA |
