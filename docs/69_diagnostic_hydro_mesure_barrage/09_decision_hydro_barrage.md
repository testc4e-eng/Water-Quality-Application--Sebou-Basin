# Décision finale — `hydro.mesure_barrage`

## Problème principal identifié

Le problème principal n’est ni le mapping barrage, ni la clé temporelle, ni une dépendance à `ctid`.

Le problème est un **mauvais modèle cible** :

- la source porte `5` paramètres barrage validés métier
- la cible actuelle n’en supporte correctement que `2`
- `RESTITUTION` est en plus en conflit d’unité avec `lacher_m3s`

## Chiffres de synthèse

- paramètres détectés : `NIVEAU_EAU`, `VOLUME`, `RESTITUTION`, `APPORTS_HM3`, `TRANSFERT`
- volume stable source : `85 166`
- volume déjà cohérent : `92 526` lignes paramétriques
- volume prêt à insérer : `0`
- volume conflit : `2 684`
- volume timestep incohérent : `0`
- mélange métier : `oui`
- dépendance à `ctid` : `non`

## Stratégie recommandée

### Stratégie de migration

**Aucune migration `E1.1` sur la structure actuelle**

### Stratégie d’architecture

**Remodeler avant migration**

- recommandation : **Option B — tables spécialisées**

## Décision finale

**HYDRO_BARRAGE_A_REMODELER**

## Action suivante recommandée

Préparer un lot dédié de refonte barrage :

1. valider l’architecture spécialisée
2. définir les schémas cibles par paramètre
3. produire les scripts de migration sans `ctid`
4. exécuter ensuite mini-lot par mini-lot
