Agis comme un expert senior en data engineering, qualité des données, PostgreSQL/PostGIS/TimescaleDB, et expert métier hydrologie, environnement et qualité des eaux.

Je travaille sur une base de données d’un système d’aide à la décision (SAD) eau/hydrologie.

Les Phases A et B sont terminées :
- la base est restructurée (schémas métier en place),
- les tables ont été migrées hors du schéma public,
- une couche api.v_* existe,
- les migrations sont industrialisées (logs, rollback, CI/CD).

Je lance maintenant la Phase C — Corrections de qualité de données indispensables.

## 🎯 Objectif principal
Transformer une base "structurellement propre" en base :
- fiable,
- cohérente,
- exploitable métier,
- prête pour dashboards, analyse et IA.

⚠️ Important :
- on ne modifie PAS l’architecture globale
- on corrige les données, pas les schémas (sauf exceptions justifiées)

---

# 1. Diagnostic global qualité des données

Analyse la base et identifie :

- incohérences métier
- données manquantes
- relations cassées
- doublons
- erreurs de mapping
- valeurs aberrantes
- incohérences temporelles
- incohérences spatiales
- dépendances incorrectes

Distingue :
- anomalies critiques (bloquantes)
- anomalies majeures
- anomalies mineures

---

# 2. Audit des identifiants et mapping (CRITIQUE)

Analyse :

- mapping `code_station`, `ire_station` → `infra.station.id`
- mapping barrage → `infra.barrage.id`
- correspondances multiples
- valeurs non appariées (orphelins)
- incohérences de référentiel

Génère :

## SQL audit
- liste des orphelins
- taux de mapping réussi (%)
- cas ambigus (1 code → plusieurs stations)

## SQL correction
- règles de correction automatique
- tables de mapping
- journal des corrections

---

# 3. Audit des données spatiales (PostGIS)

Analyse :

- géométries NULL
- géométries invalides
- SRID incohérents
- objets mal positionnés
- incohérences station ↔ bassin
- incohérences barrage ↔ territoire

Génère :

## SQL audit spatial
- ST_IsValid
- ST_SRID
- ST_Contains anomalies
- ST_Distance incohérent

## SQL correction
- correction SRID
- nettoyage géométrie
- recalcul rattachement spatial

---

# 4. Audit des séries temporelles (hydro / meteo / qualite)

Analyse :

- doublons temporels
- trous de données
- timestamps incohérents
- fréquences irrégulières
- valeurs aberrantes
- unités incohérentes

Génère :

## SQL audit
- détection doublons (timestamp + station)
- détection gaps temporels
- détection valeurs extrêmes

## SQL correction
- suppression doublons
- normalisation timestamps
- correction unités
- interpolation simple si nécessaire (optionnel)

---

# 5. Audit des données qualité des eaux

Analyse :

- incohérences paramètres
- valeurs hors norme réaliste
- erreurs de codification paramètres
- incohérence unité vs paramètre

Génère :

## SQL audit
- distribution des valeurs
- outliers statistiques
- incohérences paramètre/unité

## SQL correction
- normalisation paramètre
- correction unités
- marquage des valeurs douteuses

---

# 6. Audit des relations métier

Vérifie :

- station ↔ bassin
- station ↔ sous-bassin
- barrage ↔ bassin
- pollution ↔ réseau hydro

Génère :

## SQL audit
- objets sans rattachement
- rattachement multiple incohérent

## SQL correction
- recalcul via spatial
- mise à jour FK

---

# 7. Détection des doublons métier

Analyse :

- stations dupliquées
- barrages dupliqués
- sources pollution dupliquées

Génère :

## SQL audit
- doublons par nom + localisation
- doublons fuzzy (LOWER, distance)

## SQL correction
- fusion des doublons
- stratégie de conservation

---

# 8. Nettoyage des données legacy

Analyse :

- tables legacy encore utilisées
- colonnes inutiles
- données incohérentes

Génère :

- stratégie de décommissionnement
- archivage
- suppression contrôlée

---

# 9. Score de qualité des données

Construit un score global :

- intégrité référentielle
- complétude
- cohérence spatiale
- cohérence temporelle
- cohérence métier

Retour :

Score global /100  
+ score par domaine

---

# 10. Plan de correction opérationnel

Propose un plan en étapes :

Pour chaque étape :
- objectif
- SQL à exécuter
- vérification
- risque
- rollback

---

# 11. Pack SQL complet Phase C

Génère :

- scripts audit
- scripts correction
- scripts validation
- scripts logging

---

# 12. Rapport final Phase C

Génère un rapport :

- anomalies détectées
- corrections appliquées
- anomalies restantes
- score qualité final
- recommandations

---

# 13. Contraintes importantes

- ne jamais supprimer sans justification
- toujours tracer les corrections
- privilégier UPDATE avec backup
- proposer rollback
- commenter chaque SQL
- distinguer automatique vs manuel

---

# 14. Objectif final

À la fin de Phase C, la base doit être :

- cohérente
- fiable
- prête pour dashboards
- prête pour IA / RAG / analyse
- prête pour production réelle

---

# Documents à exploiter

- Phase A
- Phase B
- Industrialisation (Phase 16)
- vues API
- export brut système
- metadata SQL

---

Tu dois produire une réponse exploitable directement par un data engineer en production.