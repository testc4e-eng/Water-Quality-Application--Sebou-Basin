# Stratégie d’affichage par rôle

## Utilisateur métier

### À afficher

- KPI synthétiques.
- classes qualité et tendances.
- stations, cartes, séries temporelles utiles.
- température `T_MIN`, `T_MAX`, `T_MOY`.
- pollution : sites, résultats, tendances.
- alertes et messages métier compréhensibles.

### À reléguer

- paramètres `NON_CLASSIFIABLE` dans `Informations complémentaires`.
- avertissements scientifiques sous forme de bandeau court.
- périmètre réglementaire dans le header, pas dans la table technique.

### À exclure

- staging, batchs, lineage, run ids.
- erreurs backend détaillées.
- flags QA internes ligne à ligne.
- artefacts de validation spatiale et hydraulique.

## Expert métier

### À afficher en plus

- version réglementaire, type d’eau, seuils actifs/exclus.
- couverture stations / mesures.
- statut des données : classifiable, non classifiable, hors périmètre.
- contexte hydraulique : validé, en cours, non scientifique.
- synthèse QA compacte.

### Forme attendue

- panneaux secondaires ou onglets “Contexte expert”.
- badges et légendes normalisés.
- accès lecture seule aux détails sans exposer les structures techniques brutes.

## Administrateur / Dev

### À afficher

- contrôles QA détaillés.
- import_batch, lineage, batch status.
- anomalies, logs, flags techniques.
- vues d’audit, scan couverture, traces API.
- couches suspectes, segments plats, conflits spatiaux.

### Emplacement

- routes admin dédiées.
- jamais mélangés au tableau de bord métier principal.

## Traduction par dashboard

| Dashboard | Version métier | Version expert | Version admin/dev |
|---|---|---|---|
| Qualité réglementaire | Oui, route principale | même route avec panneau contexte expert | audit seuils/mappings hors écran métier |
| Température / climat | oui, tendances et séries | plus couverture et lacunes | ingestion, alias, lineage |
| Pollution | oui, sites + tendances + avertissement discret | plus contrat runtime | QA topology + logs |
| Hydraulique | couverture bassin et état global | segments suspects/plats | arbitrage et QA détaillée |
| Carto métier | support métier + valeur + popup | plus statut réglementaire et confiance | support legacy, source backend, debug API |

## Règle de formulation

- Dire “données en validation” plutôt que montrer un objet QA brut.
- Dire “validation hydraulique scientifique en cours” plutôt que détailler `used_fallback` et `direction_validated=false` au métier.
- Garder les termes techniques complets pour expert/admin seulement.
