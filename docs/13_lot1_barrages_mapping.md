# LOT 1 : Plan de Mappage et Règles d'Intégration — Infrastructures Barrages

## 1. Contexte et Périmètre
Ce document (Étape 3 du Workflow de Convergence) encadre formellement les règles de ciblage et de transformation qui doivent lier la base *Sandbox* à la base *Production* pour le Lot 1 (Barrages).

- **Table Source** : `abh_sebou_070426.public.infra_barrages_abhs`
- **Table Cible** : `abh_sad.infra.barrages`

## 2. Clé de Rapprochement Retenue et Justification
**Clé de mapping principale : `nom_barrage` (normalisé : lower, suppressions espaces multiples/dashes).**

**Justification** : Lors de l'audit (Étape 2), le `code_commune` ou l'IRE (`ire`) présentaient trop de lacunes structurelles. Le nom est fiable pour l'intégrité géospatiale des macro-ouvrages. Toutefois, l'audit A/B a révélé deux exceptions majeures imposant des cas de contournement stricts.

## 3. Cas Particuliers Détectés (Exceptions)

### Le cas "bouhouda" (Doublon)
- L'audit A/B fait remonter 2 lignes nommées "bouhouda". Une clé censée être unique qui matche 2 fois provoque une cardinalité instable (`N-N` ou `1-N`), rendant un `UPDATE` chaotique ou auto-écrasant. 
- **Règle imposée** : Tout barrage multiple sur la clé nominalisée sera flaggé en **`WOULD_CONFLICT`** et exclu de l'automatisation. Il nécessitera une résolution manuelle (soit suppression dans  `abh_sebou_070426`, soit ID de ciblage dur).

### Le cas "None" (Ouvrage Anonyme)
- L'audit indique une ligne avec `nom_barrage = None`.
- **Règle imposée** : Un barrage ne portant pas de nom défini brise la logique référentielle. Cette ligne sera arbitrairement marquée en **`WOULD_SKIP`** (Ignorée), ce qui bloquera formellement tout UPDATE/INSERT la concernant. L'équipe métier devra l'identifier ou la purger.

## 4. Mapping de la Structure (`Source` ➔ `Cible`)
Puisque les deux tables présentent un miroir parfait (17 colonnes identiques), le DDL de mapping est en 1:1, de la source `id` à `geom`.

- **Transformation** : Aucune mutation de typage ou re-création spatiale.
- **Règle géospatiale** : La géométrie PostGIS (`geom`) est comparée par égalité stricte WKB/WKT entre la source et la cible.

## 5. Règles Opérationnelles (Lignes de Conduite Dry-Run / Prod)

- **Condition de `WOULD_INSERT` (Nouveau)** :
  Un nom_barrage normalisé existant dans la sandbox mais absent de la cible.
  
- **Règle sur les MISSINGS (NULLs) & Règle d'Enrichissement (`WOULD_UPDATE`)** :
  Si un barrage Matche (même `nom_barrage` normalisé, non en conflit) : on compare champ par champ (`hauteur`, `vrn_hm3`, `geom`...). 
  Si **aucune** différence n'est détectée (ou si the data est identique), la règle est le **`WOULD_SKIP`**. 
  Un update n'est proposé (`would_update`) **UNIQUEMENT** si une valeur source est jugée informativement supérieure ou différente, et on l'indiquera en console. 
  
- **Clôture Automatique du Lot** :
  Si au terme du script le volume de `would_insert == 0` et `would_update == 0`, ce document stipule la levée du plan d'exécution : la table est "Déjà Synchrone".
