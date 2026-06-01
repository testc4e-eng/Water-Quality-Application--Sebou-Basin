# BLOC 4 : Plan d'Implémentation - Couche Qualité Unifiée

## Objectif & Architecture Cible
L’objectif de cette refonte est d'assurer la convergence de toutes les mesures chimiques, physiques et microbiologiques éparpillées dans la base (IDP, Suivis Hebdo, Rivières, Nappes) vers un **schéma dimensionnel unique (`qualite`)**, sans jamais altérer les tables brutes (`staging`), selon le principe ELT (Extract-Load-Transform).

### Modèle de données (Détaillé dans `backend/sql/bloc4_schema_qualite_unifiee.sql`)
1. **Dimension Spatio-Temporelle (`qualite.prelevement`)** : Le grain métier de base n'est plus "la ligne de tableau source" mais l'événement physique : Un technicien a prélevé en une Station X, à une Date T.
2. **Dimension Métier Paramètre (`qualite.ref_parametre`)** : Référentiel canonique (ex: 1 seul ID pour DISSOLVED_OXYGEN, et non "DO", "O2_Diss", "oxy diss"). 
3. **Table de Fait (`qualite.mesure_qualite_unifiee`)** : Pivot long : `[prelevement_id, parametre_id, valeur, unite, QA_Flags]`. Elle garantit qu'il n'y a qu'une vérité par paramètre par prélèvement.

## Stratégie de Mapping Métier

### 1. Mapping Paramètres (Mise en œuvre du dictionnaire dynamique)
`qualite.map_parametre_source` jouera le rôle de traducteur universel.
La stratégie est la suivante :
1. Lors du script d'intégration, toute chaîne de caractère brute (`DO`, `DCO (O2/l)`) issue du tableau de staging cible est confrontée à ce pivot de mapping.
2. Si le mapping existe, le système l'associe à l'ID Canonique.
3. Si le mapping est inconnu, **l’insertion n’est pas rejetée** : le `flag_param_non_mappe` est mis à TRUE, et le code paramètre s’insère via un code originel fallback (dans la colonne valeur_texte ou extra-champ JSON défini) permettant au métier de le corriger a posteriori sans perdre la donnée.

### 2. Stratégie de Gestion des Doublons (Rétention Intelligente)
Plusieurs sources (ex: labo national vs campagne IDP) peuvent reporter la même valeur, à la même date et station.
1. La clé d'unicité forte est : `(prelevement_id, parametre_id)`.
2. Si un conflit survient (ON CONFLICT), le système déclenche la règle `flag_doublon_traite`.
3. Par défaut, la source d'import avec la **qualité labo supérieure** (selon le run et le flag de préséance) a priorité. La valeur originelle existante est gardée ou écrasée, mais l'événement est loggé dans `audit_integration_qualite`.

## Stratégie d'Intégration par Source

Le script final Python/SQL effectuera l'ingestion dans l'ordre suivant :
1. **Les tables massives génériques & suivis réguliers** :
   - `mesures_qualite_rivieres`, `mesures_qualite_nappes`, `mesures_qualite_barrages`.
   - `mesures_suivi_qualite_sebou_jr_6stations`, `mesures_suivi_qualite_brg_garde_hebdo`.
2. **Les tables Spécifiques de Campagne (IDP 2024)** :
   - L'audit `docs/12_historique_et_archives/root_legacy/06_audit_idp_qualite.md` a prouvé que ces tables étaient riches mais parfois hétérogènes.
   - Seront insérées en liant le `campagne_id` spécifiquement créé ("IDP Globale 2024" ou "IDP Marché Cadre").
   - Tous les noms hybrides type `Indicedephénol(mg/l)` observés iront d'abord être documentés dans le mapper.

## Vérification et Validation (Tests à prévoir)

- **Test 1 : Intégrité Paramétrique** -> Interroger pour garantir aucune valeur NULL sur l'ID Unifié sauf pour celles explicitement `flag_param_non_mappe`.
- **Test 2 : Intelligibilité Spatiale** -> `COUNT(*)` des prélèvements sans station associée (tolérés uniquement sur échantillons hors-réseau cartographié).
- **Test 3 : Idempotence** -> Relancer l'intégration IDP 2024 et vérifier que `qualite.audit_integration_qualite` affiche 100% de rejets/ignorés (preuve de l'action `ON CONFLICT DO NOTHING / UPDATE`).

## Risques et Arbitrages (En Attente Métier)
- L'audit des tables IDP montre qu'elles ne s'intègrent pas "par magie". Il subsiste de la complexité sur la déduction du code station (notamment sur `qualite_marche_cadre` où seuls les noms textes informels du point sont inscrits). Dans la phase d'implémentation algorithmique, nous utiliserons un FLAG provisoire station_unmapped si le géocodage formel échoue, afin de ne perdre aucune métrique scientifique.
