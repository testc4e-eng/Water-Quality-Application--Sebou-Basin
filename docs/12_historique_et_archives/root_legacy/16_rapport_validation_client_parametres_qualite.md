# Rapport d'Arbitrage et Validation des Paramètres (Destiné à: ABH / Équipe Chimie / Client)

L'audit de votre système d'information historique a mis en évidence le fait fantastique que la quasi-totalité de vos relevés (95%) repose sur 35 paramètres structurellement identifiables. Le reste du bruit est en grande partie dû à des fautes de frappe.

Néanmoins, certains codes issus de vos anciens laboratoires subsistent dans la base à haute fréquence. **Afin que la nouvelle plateforme décisionnelle (WQDSS) ne fausse pas les indicateurs de santé du Sebou**, nous nécessitons une réponse stricte de validation (Oui/Non/Autre) de la part de vos experts pour les paramètres suivants.
*(Note : Lors de l'ingestion Spatiale et Souterraine du Lot 4A-2, un total réel de 3 751 lignes historiques ont été temporairement gelées `qa_flag_param_unmapped` dans l'attente de cet arbitrage).*

| Abréviation (Telle que lue dans Sandbox) | Occurrences | Hypothèse Probable des Data Engineers | Validation Chimiste ABH (À Remplir) |
|---|---|---|---|
| `H_G` | > 4 700 | Huiles et Graisses Totales ? Ou Mercure (`Hg` inversé) ? | [ ] Accepté comme .... , Unité cible : .... |
| `sat` | > 1 200 | Saturation en Oxygène Dissous (%) ? | [ ] Accepté comme .... , Unité cible : .... |
| `PTD` | 136 | Phosphore Total Dissous ? | [ ] Accepté comme .... , Unité cible : .... |
| `PTP` | 136 | Phosphore Total Particulaire ? | [ ] Accepté comme .... , Unité cible : .... |
| `RS105` | > 2 200 | Résidu Sec à 105°C ? | [ ] Accepté comme .... , Unité cible : .... |
| `RS185` | 9 | Résidu Sec à 185°C ? | [ ] Accepté comme .... , Unité cible : .... |
| `F_M_mes` / `FM` | ~ 15 | Fraction Minérale des MES ? | [ ] Accepté comme .... , Unité cible : .... |
| `Numerotation_GT`| 1 | Test colimétrique Numération Germes Totaux ? | [ ] Rejet conseillé ou ... |
| `IP(mgO2/l)` | 182 | Indice de Permanganate (Oxydabilité) ? | [ ] Accepté comme Oxydabilité... |

___
*(Signataire / Expert Validateur de l'Agence : ___________________ Date : ___/___/2026 )*
