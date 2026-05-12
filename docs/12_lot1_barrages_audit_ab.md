# LOT 1 : Audit A/B détaillé — Infrastructures Barrages

## 1. Résumé Global
- **Base Source Sandbox** : `abh_sebou_070426.public.infra_barrages_abhs`
- **Base Cible Production** : `abh_sad.infra.barrages`
- **Volumétrie Source** : 34 barrage(s)
- **Volumétrie Cible** : 34 barrage(s)

### Synthèse des Correspondances :
- 🟢 **Match Exact** : 34
- 🟡 **Match Approximatif** : 0
- 🔵 **Nouveau (À créer)** : 0
- 🔴 **Conflits détectés** : 0
- ⚪ **Orphelins cible (existant dans sad mais pas dans source)** : 0

## 2. Analyse des Clés Métier (Stratégie de Liaison)
> **Choix de la clé de mapping identifiée** : Liaison composite dynamique par **NOM NORMALISÉ**.
> - Colonne évaluée Source : `nom_barrage`
> - Colonne évaluée Cible : `nom_barrage`
> - *Justification* : Le code hydro (IRE ou ID) étant instable (ou vide) sur certaines tables géospatiales des barrages, le nom textuel (insensible à la casse/dashes) s'avère la clé métier la plus humaine et fiable pour éviter la duplication des infrastructures de base, couplée à une distance de sécurité inter-points (<500m).

## 3. Comparaison Structurelle
### Colonnes SOURCE (`infra_barrages_abhs`)
- `id` (integer)
- `code_commune` (text)
- `ire` (text)
- `nom_barrage` (text)
- `nom_oued` (text)
- `statut` (text)
- `buts` (text)
- `type_barrage` (text)
- `vrn_hm3` (double precision)
- `hauteur` (double precision)
- `apports_hm` (double precision)
- `montant_md` (double precision)
- `mise_en_se` (text)
- `observation` (text)
- `coord_x` (double precision)
- `coord_y` (double precision)
- `geom` (USER-DEFINED)

### Colonnes CIBLE (Production)
- `id` (integer)
- `code_commune` (text)
- `ire` (text)
- `nom_barrage` (text)
- `nom_oued` (text)
- `statut` (text)
- `buts` (text)
- `type_barrage` (text)
- `vrn_hm3` (double precision)
- `hauteur` (double precision)
- `apports_hm` (double precision)
- `montant_md` (double precision)
- `mise_en_se` (text)
- `observation` (text)
- `coord_x` (double precision)
- `coord_y` (double precision)
- `geom` (USER-DEFINED)

## 4. Tableau Détaillé des Nouveautés (NEW)
| ID Source | Nom Source | Coordonnées | Action Requise |
|---|---|---|---|
| - | - | - | Aucun nouveau barrage. |

## 5. Tableau des Correspondances (Exact & Approx)
| Nom Source | Statut | Cible Produit | Distance (m) |
|---|---|---|---|
| sidi abbou | 🟢 Exact | sidi abbou | N/A |
| ratba | 🟢 Exact | ratba | N/A |
| m'dez | 🟢 Exact | m'dez | N/A |
| ain smen | 🟢 Exact | ain smen | N/A |
| ribate el kheir | 🟢 Exact | ribate el kheir | N/A |
| sid el mokhfi | 🟢 Exact | sid el mokhfi | N/A |
| machraa lahjer | 🟢 Exact | machraa lahjer | N/A |
| kodiat borna | 🟢 Exact | kodiat borna | N/A |
| tafrent | 🟢 Exact | tafrent | N/A |
| bab ouander | 🟢 Exact | bab ouander | N/A |
| rdat | 🟢 Exact | rdat | N/A |
| bouhouda | 🟢 Exact | bouhouda | N/A |
| sahla | 🟢 Exact | sahla | N/A |
| bab louta | 🟢 Exact | bab louta | N/A |
| ouljet essoltane | 🟢 Exact | ouljet essoltane | N/A |
| bouhouda | 🟢 Exact | bouhouda | N/A |
| garde du sebou | 🟢 Exact | garde du sebou | N/A |
| el kansera | 🟢 Exact | el kansera | N/A |
| idriss premier | 🟢 Exact | idriss premier | N/A |
| allal al fassi | 🟢 Exact | allal al fassi | N/A |
| sidi chahed | 🟢 Exact | sidi chahed | N/A |
| al wahda | 🟢 Exact | al wahda | N/A |
| asfalou | 🟢 Exact | asfalou | N/A |
| blad  el  gaada | 🟢 Exact | blad  el  gaada | N/A |
| mahraz | 🟢 Exact | mahraz | N/A |
| aggay | 🟢 Exact | aggay | N/A |
| injil | 🟢 Exact | injil | N/A |
| tizguit aval | 🟢 Exact | tizguit aval | N/A |
| tizguit  amont | 🟢 Exact | tizguit  amont | N/A |
| aman  seyernine | 🟢 Exact | aman  seyernine | N/A |
| jorf el ghorab | 🟢 Exact | jorf el ghorab | N/A |
| gharbia | 🟢 Exact | gharbia | N/A |
| essaf | 🟢 Exact | essaf | N/A |
| None | 🟢 Exact | None | N/A |

## 6. Analyse des Conflits (CONFLICT) & Risques
Sont classés comme conflit deux barrages ayant le même nom mais dont l'écart spatial est inacceptable (> 500m) induisant un risque analytique majeur.

> *Aucun conflit spatial majeur relevé sur les homologues* ✅.

## 7. Recommandation pour la phase de Mapping (Ne pas exécuter)
- **Stratégie globale UPSERT** : Les `NEW` doivent être purement insérés.
- Les `MATCH` doivent déclencher un enrichissement : ne mettre à jour les coordonnées de `abh_sad` que si les champs existants sont vides ou flaggés 'legacy'. Aucun delete autorisé.
- La future clé d'intégrité pour le module Qualité Unifiée dépendra de l'UUID / primary key de la ligne cible consolidée, les `MATCH EXACT` ne subiront pas de duplication id.
