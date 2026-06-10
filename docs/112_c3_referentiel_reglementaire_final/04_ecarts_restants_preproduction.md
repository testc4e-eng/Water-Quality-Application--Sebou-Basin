# Ecarts restants preproduction

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | ecarts reels |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Ecarts reels constates

### 1. Type d'eau operationnel limite

Preuve BD :

```sql
SELECT count(*)
FROM metadata.qualite_type_eau
WHERE actif = true
  AND statut_operationnel = 'REGLEMENTAIRE_OPERATIONNEL';
```

Resultat :

- `1` type d'eau operationnel

Impact :

- le runtime PREPROD est borne a `surface_generale` ;
- les autres types d'eau documentaires ne sont pas encore promus operationnellement.

### 2. Mappings et seuils non exhaustifs au sens documentaire large

Preuves BD :

```sql
SELECT count(*) FROM metadata.qualite_mapping_canonique_reglementaire WHERE actif = true;
SELECT count(*) FROM metadata.qualite_parametre_reglementaire WHERE actif = true AND classifiable IS true;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire WHERE actif = true;
```

Resultats :

- `36` mappings actifs ;
- `36` parametres classifiables actifs ;
- `177` seuils actifs.

Impact :

- le coeur operationnel est present ;
- le perimetre reste borne a ce noyau classeur.

### 3. Coexistence router reglementaire / router qualite legacy

Constat code :

- `backend/app/routers/quality.py` expose le moteur reglementaire ;
- le meme router contient aussi des endpoints qualite legacy bases sur `qualite.mesure_qualite_riviere`.

Impact :

- la partie reglementaire est active ;
- la dette legacy qualite n'est pas entierement purgee.

### 4. Frontend reglementaire raccorde, mais perimetre borne

Constat code :

- `/dashboard-qualite-reglementaire` existe ;
- le frontend depend des endpoints `/quality/*` ;
- le contrat officiel reste `type_eau=surface_generale`.

Impact :

- le dashboard est operationnel en DEV/PREPROD conditionnelle ;
- il ne faut pas le sur-vendre comme couverture multi-types d'eau complete.

## Synthese

Les ecarts restants n'invalident pas le moteur reglementaire. Ils bornent son perimetre operationnel et justifient un statut conditionnel plutot qu'un `GO_PREPROD` plein.
