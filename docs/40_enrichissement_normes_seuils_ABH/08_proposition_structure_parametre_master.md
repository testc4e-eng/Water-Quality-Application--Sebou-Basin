# Proposition structure parametre_master

## Objectif

Proposer une structure cible pour `metadata.parametre_master` capable de porter à la fois le référentiel métier, les variantes source, les unités de référence et les seuils ABH sans valider automatiquement les contenus.

## Colonnes proposées

| Colonne | Rôle | Remarque |
|---|---|---|
| id_parametre | identifiant technique stable | clé primaire UUID ou séquence |
| code_parametre | code métier court | à définir avec l’ABH |
| nom_officiel | libellé officiel validé | source de vérité métier |
| libelle_court | libellé UI / tableau | version courte pour l’application |
| domaine | grand domaine | qualité, météo, hydrologie, pollution, SWAT, WASP |
| theme | regroupement fonctionnel | ex. minéralisation, micropolluants, microbiologie |
| sous_theme | niveau fin de classement | ex. nitrates, orthophosphates |
| type_eau_applicable | périmètre de la norme | surface, rivières, lacs, souterraines |
| unite_reference | unité officielle de stockage / affichage | à valider |
| unite_source | unité observée dans les sources | peut porter plusieurs valeurs concaténées ou via table fille |
| source_norme | document de référence | ex. PDF ABH 2014 |
| page_norme | page d’origine du seuil | traçabilité documentaire |
| seuil_excellent_min | borne basse excellente | laisser vide si non applicable |
| seuil_excellent_max | borne haute excellente | laisser vide si non applicable |
| seuil_bon_min | borne basse bonne | laisser vide si non applicable |
| seuil_bon_max | borne haute bonne | laisser vide si non applicable |
| seuil_moyen_min | borne basse moyenne | laisser vide si non applicable |
| seuil_moyen_max | borne haute moyenne | laisser vide si non applicable |
| seuil_mauvais_min | borne basse mauvaise | laisser vide si non applicable |
| seuil_mauvais_max | borne haute mauvaise | laisser vide si non applicable |
| seuil_tres_mauvais_min | borne basse très mauvaise | laisser vide si non applicable |
| seuil_tres_mauvais_max | borne haute très mauvaise | laisser vide si non applicable |
| sens_interpretation | règle métier d’interprétation | plus petit = meilleur, plus grand = meilleur, intervalle optimal |
| variantes_associees | variantes source connues | liste séparée ou table fille |
| statut_validation | statut d’avancement | à valider par défaut |
| commentaire_metier | notes d’arbitrage | traçabilité des décisions |

