# Points de validation métier — nettoyage IDP 2024

| Sujet | Question | Options | Recommandation | Décideur |
|---|---|---|---|---|
| Fusion globale / marché cadre | Les tables globale et marché cadre doivent-elles être fusionnées ? | fusion complète / fusion avec traçabilité / séparation maintenue | fusion avec colonne `origine_table` et quarantaine des recouvrements | ABH / chef projet métier |
| Source de référence | Quelle table doit faire foi si globale et marché cadre se recouvrent ? | globale / marché cadre / dernière date / règle métier | définir une règle explicite avant toute fusion | ABH / chef projet métier |
| Paramètres non mappés | Les paramètres non mappés doivent-ils être conservés en attente ? | oui / non / partiellement | oui, en quarantaine | ABH / métier qualité |
| Paramètres ambigus | Les paramètres ambigus doivent-ils être conservés ? | oui / non / cas par cas | oui, en quarantaine jusqu’à validation | ABH / métier qualité |
| Sources non rattachées | Les sources non rattachées doivent-elles rester en quarantaine ? | oui / non / rattachement manuel | oui, jusqu’à rattachement validé | ABH / métier pollution |
| Codes pollution | Quels codes pollution sont officiels ? | codes source / codes métier / double affichage | publier un référentiel officiel | ABH |
| Suppression des doublons exacts | Peut-on supprimer les doublons exacts ? | oui / non | oui, seulement s’ils sont confirmés après backup ; actuellement aucun doublon exact détecté | chef projet / DBA |
| Suppression des lignes strictement vides | Peut-on supprimer les lignes strictement vides ? | oui / non / quarantaine d’abord | quarantaine d’abord, suppression après validation | chef projet / métier |
| Valeurs non numériques | Les valeurs type `<0,005` doivent-elles être conservées ? | convertir / conserver en texte / mettre en quarantaine | quarantaine, puis règle métier | ABH / métier qualité |
| Recouvrements globale / marché cadre | Les 40 lignes qualité et 5 lignes source pollution en recouvrement doivent-elles être éliminées d’un côté ? | oui / non / arbitrage table de référence | arbitrer d’abord la table de référence | ABH / chef projet métier |
| Points amont / aval | Un point amont/aval peut-il être traité comme une source de pollution ? | oui / non / cas par cas | non par défaut ; validation au cas par cas | ABH / métier pollution |
| Réingestion source | Quels cas doivent être réingérés depuis `abh_sebou_070426` ? | aucun / cas corrigés / cas métier validés | seulement après validation des mappings et des sources | chef projet / équipe data |
