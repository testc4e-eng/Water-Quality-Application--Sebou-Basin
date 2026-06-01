# Règles de classification officielles

## 1. Classification par seuil

Pour une mesure donnée, le moteur sélectionne le seuil actif par : type d'eau, code canonique, code réglementaire, unité moteur, version réglementaire et statut validé. La mesure est classée si la valeur numérique satisfait l'intervalle de classe.

Le Tableau n°1 officiel eaux de surface est l'unique source opérationnelle. Les grilles simplifiées restent `DOCUMENTAIRE_NON_OPERATIONNEL`.

## 2. Intervalles et bornes

- `operateur_min` et `borne_min` décrivent la borne basse.
- `operateur_max` et `borne_max` décrivent la borne haute.
- Les opérateurs autorisés sont `<`, `<=`, `>`, `>=`, `=` et `IS NULL` uniquement pour l'absence de borne.
- Une classe est retenue si toutes les bornes définies sont satisfaites.
- Les paramètres sans seuil officiel validé ne sont jamais classés par interpolation ou fallback.

## 3. Unités

La classification exige l'unité réglementaire source ou une unité moteur explicitement validée.

Décisions d'unité validées :

| Famille / paramètre | Unité source | Unité moteur | Règle |
|---|---|---|---|
| Métaux en `µg/l` | `µg/l` | `mg/L` | Conserver source et stocker valeur normalisée secondaire, facteur 0.001 |
| Microbiologie `CF`, `CT`, `SF` | `/100ml` | `UFC/100 mL` | Équivalence opérationnelle validée |
| `DBO5`, `DCO` | `mgO2/l` ou `mg/l` | `mg/L` | Équivalence opérationnelle validée |

En cas d'unité absente, ambiguë ou non mappée, le résultat est `NON_CLASSABLE_UNITE`.

## 4. Règle spécifique Mercure

Pour `Mercure (Hg)` / canonique `HG`, la règle métier validée remplace les 5 seuils incertains extraits :

| Condition source | Classe |
|---|---|
| `valeur < 1 µg/l` | `moyenne` |
| `valeur >= 1 µg/l` | `mauvaise` |

Aucune classe `excellente`, `bonne` ou `tres_mauvaise` n'est retenue pour `Hg` à ce stade.

## 5. Valeurs manquantes

Une valeur absente ne produit ni classe ni score. Elle doit retourner `NON_CLASSABLE_VALEUR_MANQUANTE` et ne doit pas améliorer la qualité globale.

## 6. Paramètre le plus pénalisant

La qualité globale d'un point/campagne correspond à la classe valide la plus défavorable parmi les paramètres classifiables, réglementaires, mappés au canonique et actifs. Les paramètres non classifiables sont listés en annexe du résultat mais exclus du calcul.

## 7. Palette qualité SAD

Palette mixte normalisée validée :

| Classe | Couleur SAD |
|---|---|
| excellente | bleu |
| bonne | vert |
| moyenne | jaune/orange |
| mauvaise | rouge |
| tres_mauvaise | violet |

La couleur PDF peut être conservée comme métadonnée de traçabilité, mais l'affichage opérationnel SAD utilise cette palette.

## 8. Traçabilité

Chaque classification doit retourner : code paramètre canonique, code réglementaire, classe, seuil utilisé, unité source, unité moteur, facteur de conversion si appliqué, source_document, version_reglementaire, règle appliquée et statut de validation.

## 9. Cas non classables

Les statuts non classables attendus sont : `PARAMETRE_NON_REGLEMENTAIRE`, `PARAMETRE_ABSENT_CANONIQUE`, `MAPPING_NON_VALIDE`, `UNITE_NON_MAPPEE`, `VALEUR_MANQUANTE`, `SEUIL_AMBIGU`, `VERSION_INACTIVE`.
