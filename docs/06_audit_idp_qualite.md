# Audit Spécifique : Tables IDP 2024 (SAD Sebou)
*Date : 2026-04-15*

Cet audit isole l'analyse qualitative et structurelle des 4 tables de campagnes d’Incidence Directe de la Pollution (IDP) pour préparer le BLOC 4.

## Table : `mesures_idp_2024_qualite_globale`
### 1. Identité et Structure
- **Volumétrie** : 4894 lignes
- **Colonnes inférées** : station = `code_commune`, date = `date_jr_prelevement`, parametre = `parametre_qualite`

### 2. Contenu Réel & Qualité
- **Taux de Nulls** : `code_commune` : 100.0% NULL | `date_jr_prelevement` : 0.0% NULL | `parametre_qualite` : 0.0% NULL

#### Statistiques Métier 
- **Stations/Points distincts** : 0
  - Echantillon : ``
- **Paramètres distincts** : 57
  - Top 15 (fréquence) : 
    - NO3- (189)
    - Cl- (189)
    - NO2- (189)
    - TH (189)
    - Ca++ (189)
    - SO4-- (189)
    - Mg++ (189)
    - NH4+  (188)
    - CT (184)
    - SF (184)
    - CF (184)
    - Na+ (172)
    - DCO (172)
    - K+ (172)
    - MES (163)
- **Période temporelle** : `2024-09-12` -> `2025-12-14`
- **Doublons métier détectés (clé = "code_commune", "date_jr_prelevement", "parametre_qualite")** : **3067** conflits (répartis sur 1061 groupes)

### 3. Conclusion & Niveau de Risque
> **Hypothèses et Risques** : 
> - **Action préparatoire** : Mappage sémantique obligatoire des paramètres pour injection unifiée.

---

## Table : `mesures_idp_2024_qualite_marche_cadre`
### 1. Identité et Structure
- **Volumétrie** : 3614 lignes
- **Colonnes inférées** : station = `code_commune`, date = `date_jr_prelevement`, parametre = `parametre_qualite`

### 2. Contenu Réel & Qualité
- **Taux de Nulls** : `code_commune` : 100.0% NULL | `date_jr_prelevement` : 0.0% NULL | `parametre_qualite` : 0.0% NULL

#### Statistiques Métier 
- **Stations/Points distincts** : 0
  - Echantillon : ``
- **Paramètres distincts** : 65
  - Top 15 (fréquence) : 
    - SO42-_IC (127)
    - NH4+ Spect (127)
    - NH4+  (127)
    - NO3-_Spectro (127)
    - Cl-_IC (127)
    - CT (89)
    - Na+ (89)
    - Mg++ (89)
    - TA/Tas_meq/l (89)
    - somme
anions_mg/l (89)
    - Bilan_Ionique (89)
    - CF (89)
    - CO3 (89)
    - K+ (89)
    - Na+3 (89)
- **Période temporelle** : `2025-10-06` -> `2025-12-01`
- **Doublons métier détectés (clé = "code_commune", "date_jr_prelevement", "parametre_qualite")** : **2297** conflits (répartis sur 883 groupes)

### 3. Conclusion & Niveau de Risque
> **Hypothèses et Risques** : 
> - **Action préparatoire** : Mappage sémantique obligatoire des paramètres pour injection unifiée.

---

## Table : `mesures_idp_2024_src_pollution_globale`
### 1. Identité et Structure
- **Volumétrie** : 243 lignes
- **Colonnes inférées** : station = `code_commune`, date = `date_jr_prelevement`, parametre = `parametre`

### 2. Contenu Réel & Qualité
- **Taux de Nulls** : `code_commune` : 100.0% NULL | `date_jr_prelevement` : 0.0% NULL | `parametre` : 45.68% NULL

#### Statistiques Métier 
- **Stations/Points distincts** : 0
  - Echantillon : ``
- **Paramètres distincts** : 8
  - Top 15 (fréquence) : 
    - Rejet (35)
    - Oued (32)
    - A-B-C-D (21)
    - A-B-C-D-H-E (19)
    - F-G-D (13)
    - Forage (5)
    - Source (4)
    - Puits (3)
- **Période temporelle** : `2024-09-12` -> `2025-12-15`
- **Doublons métier détectés (clé = "code_commune", "date_jr_prelevement", "parametre")** : **139** conflits (répartis sur 54 groupes)

### 3. Conclusion & Niveau de Risque
> **Hypothèses et Risques** : 
> - **Action préparatoire** : Mappage sémantique obligatoire des paramètres pour injection unifiée.

---

## Table : `mesures_idp_2024_src_pollution_marche_cadre`
### 1. Identité et Structure
- **Volumétrie** : 148 lignes
- **Colonnes inférées** : station = `code_commune`, date = `date_jr_prelevement`, parametre = `parametre`

### 2. Contenu Réel & Qualité
- **Taux de Nulls** : `code_commune` : 100.0% NULL | `date_jr_prelevement` : 0.0% NULL | `parametre` : 100.0% NULL

#### Statistiques Métier 
- **Stations/Points distincts** : 0
  - Echantillon : ``
- **Paramètres distincts** : 0
  - Top 15 (fréquence) : 
    - 
- **Période temporelle** : `2025-10-06` -> `2025-12-01`
- **Doublons métier détectés (clé = "code_commune", "date_jr_prelevement", "parametre")** : **115** conflits (répartis sur 32 groupes)

### 3. Conclusion & Niveau de Risque
> **Hypothèses et Risques** : 
> - **Action préparatoire** : Mappage sémantique obligatoire des paramètres pour injection unifiée.

---

