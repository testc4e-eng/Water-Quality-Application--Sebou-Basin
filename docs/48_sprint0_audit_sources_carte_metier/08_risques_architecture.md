# 8. Risques d'Architecture Identifiés

L'audit met en évidence les points de vigilance suivants à sécuriser pendant le développement backend :

## 1. Géométries manquantes ou invalides
* De nombreux objets (Huileries, Décharges, Fosses Septiques) dans `infra.*` n'ont pas de coordonnées complètes ou validées.
* L'endpoint `/features` doit filtrer strictement `geom IS NOT NULL`.

## 2. Paramètres sans mapping ou sans unité
* Les tables `qualite.source_pollution_mesure_param` contiennent des `param_code_legacy` non rattachés au référentiel (`qa_flag_param_unmapped = true`). 
* L'absence d'unité standardisée faussera les graphes.

## 3. Volumétrie des séries temporelles
* `hydro.mesure_debit` contient plus de 650 000 lignes.
* Envoyer l'intégralité d'une série horaire brute au frontend crashera le navigateur. L'endpoint `/series` DOIT imposer une agrégation (journalière, mensuelle ou downsampling LTTB) en fonction de la plage de date.

## 4. Conflits Qualité / Pollution
* Les paramètres comme "DBO5" ou "NO3" existent à la fois dans le domaine `QUALITE` (eau brute) et `POLLUTION` (rejets IDP). Il ne faut pas les mélanger dans la même série analytique sous peine de contresens métier. Le `support_type` doit rester le filtre absolu.
