# LOT 2 : Résultat du Dry-Run d'Intégration (Stations)

*Généré automatiquement par le pipeline Python algorithmique. Strict **READ-ONLY**.*

## 1. Métriques Globales
- 🟦 `WOULD_INSERT` : 0 (Stations totalement nouvelles identifiées)
- 🟨 `WOULD_UPDATE` : 0 (Enrichissements de données repérés)
- 🟩 `WOULD_SKIP` : 390 (Équivalence absolue inter-bases ou filtrage volontaire)
- 🟥 `WOULD_CONFLICT` : 0 (Incidents de multi-cardinalité ou orphelins nom/code insolvables)

## 2. Détection Formelle des Transgressions (Anomalies Métier)
### Exception `NOM_NULL` (ANO-LOT2-002)
> ✅ Stations identifiées arbitrairement et placées dans le Bucket Skipped pour prémunir la production.

### Exception `DOUBLONS NOMINAUX` (ANO-LOT2-001)
> ✅ Résolution fine : si le barrage doublon possède un validateur Code 'ire_station' distinct => Match.
 Si le doublon source doit être discerné purement par le Nom, il est expédié en WOULD_CONFLICT.

## 3. Logs de Traitement
### 🚨 Conflits Bloquants (Exclus expressément)
- ⚠️ SKIP - Station sans nom ignorée (ID=353).
- ⚠️ SKIP - Station sans nom ignorée (ID=227).
- ⚠️ SKIP - Station sans nom ignorée (ID=268).
- ⚠️ SKIP - Station sans nom ignorée (ID=258).
- ⚠️ SKIP - Station sans nom ignorée (ID=274).
- ⚠️ SKIP - Station sans nom ignorée (ID=189).
- ⚠️ SKIP - Station sans nom ignorée (ID=224).
- ⚠️ SKIP - Station sans nom ignorée (ID=389).
- ⚠️ SKIP - Station sans nom ignorée (ID=387).
- ⚠️ SKIP - Station sans nom ignorée (ID=144).
- ⚠️ SKIP - Station sans nom ignorée (ID=364).

### 💡 Enrichissements (`UPDATE`) potentiels identifiés
- `Aucun`

## 4. Bilan 
🚨 **LOT MARQUÉ COMME SYNCHRONE (SKIP).** La base cible possède fondamentalement la même ossature utile que la Sandbox. Pas d'update utile repéré.
