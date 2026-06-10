# Registre des Décisions Métier - Nommage des Stations (Phase 4.5)

Ce document trace les décisions de renommage métier appliquées aux stations dans le cadre de la **Phase 4.5 (Validation Fonctionnelle des données)**.
Ces modifications s'appliquent via la table d'alias métier `qualite.station_alias_metier`, permettant d'afficher un nom simplifié pour les directions (DG) tout en préservant la traçabilité historique des données sources.

## Historique des Décisions

### VALIDATION MÉTIER N°1 (10 Juin 2026)

| IRE Station | Nom Original BD | Nouveau Nom Affiché (Alias) | Motif | Validé par |
| :--- | :--- | :--- | :--- | :--- |
| `3695/8` | `aval rejet sucrerie bel ksiri` | `aval bel ksiri` | Simplification du libellé pour affichage DG/métier. Évite la terminologie technique/polluante "rejet sucrerie". | Equipe métier |

---

## Mécanisme Technique d'Implémentation

Les alias sont stockés dans `qualite.station_alias_metier` :

```sql
CREATE TABLE IF NOT EXISTS qualite.station_alias_metier (
    ire_station TEXT PRIMARY KEY,
    nom_affichage TEXT NOT NULL,
    nom_original TEXT,
    commentaire TEXT,
    date_validation TIMESTAMP DEFAULT now(),
    valide_par TEXT
);
```

La vue de référence `api.v_station_dimension` interroge la table et utilise une fonction de coalescence pour la priorité d'affichage :
```sql
CAST(COALESCE(alias.nom_affichage, sm.nom) AS character varying(100)) AS station_nom
```
Toute mise à jour dans cette table se répercute automatiquement dans le backend et sur les Dashboards via cette vue centralisée.
