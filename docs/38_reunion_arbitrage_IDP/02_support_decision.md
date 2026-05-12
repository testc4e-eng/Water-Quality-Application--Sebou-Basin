# Support de décision — Arbitrage IDP 2024

| Sujet | Problème | Options | Recommandation | Décision |
|------|--------|--------|--------------|---------|
| Fragmentation IDP | `8 899` lignes réparties sur `4` tables | séparation / fusion avec origine / table de référence | fusion seulement avec traçabilité | à décider |
| Recouvrement qualité globale / marché | `40` cas pouvant créer un double comptage | garder séparé / fusion avec origine / priorité source | fixer une règle métier unique | à décider |
| Recouvrement sources globale / marché | `5` cas de recouvrement pollution | garder séparé / fusion avec origine / priorité source | arbitrer avant intégration | à décider |
| Tables IDP absentes dans abh_sad | `4` tables absentes de la cible | rester source / intégrer / intégrer partiellement | clarifier le statut cible des tables | à décider |
| Paramètres non mappés | `4 755` lignes non reliées au dictionnaire | exclure / conserver en attente / mapping progressif | conserver en attente puis mapper | à décider |
| Paramètres ambigus | `27` cas explicites plus cas dérivés | bloquer / conserver sans usage / définir officiellement | définir officiellement | à décider |
| Variantes et unités | plusieurs variantes et familles concernées | garder l’existant / normaliser / exclure les cas non clairs | normaliser avec dictionnaire officiel | à décider |
| Valeurs non numériques | `2 035` cas | exclure / quarantaine / conversion selon règle | définir une règle métier unique | à décider |
| Valeurs labo spéciales | plusieurs cas inclus dans les valeurs non numériques | exclure / règle spécifique / conversion standardisée | valider une règle spécifique | à décider |
| Valeurs nulles | `11` cas | exclure / quarantaine / conserver pour traçabilité | conserver à part jusqu’à décision | à décider |
| Sources non rattachées | `240` points non intégrés | exclure / quarantaine / rattachement manuel | quarantaine puis rattachement manuel | à décider |
| Codes pollution ambigus | plusieurs codes opérationnels | garder tous / liste officielle / regroupement | publier une liste officielle | à décider |
| Points amont / aval | `1 806` lignes à qualifier | sources / points de contrôle / exclusion temporaire | les traiter comme points de contrôle par défaut | à décider |
