# LOT 4A-2 : Plan de Mappage Qualité (Rivières et Nappes)

## 1. Périmètre de Traitement
Ce lot organise l'UPSERT formel des deux plus immenses réservoirs analytiques du pôle Qualité (Eaux Superficielles & Eaux Souterraines), hors contexte lentique (Barrages).
- **Source 1** : `public.mesures_qualite_rivieres`
- **Source 2** : `public.mesures_qualite_nappes`
- **Cible 1** : `qualite.mesure_qualite_riviere`
- **Cible 2** : `qualite.mesure_qualite_nappe`

## 2. Table de Décision et Mapping Flag (QA)
- 🟨 **Flag Non-Mappé (`qa_flag_param_unmapped`)** : Lors de cette phase, tous les paramètres exclus du dictionnaire consolidé ou soulevant explicitement une faille `A ARBITRER` (ex: `H_G`, `sat`, `PTD`, `PTP`, `RS105`, `RS185`, `F_M_mes`, `FM`, `Numerotation_GT`, `IP(mgO2/l)`) déclencheront le QA. La donnée transite mais reste aveugle pour l'analytique `valeur_num`.
- 🟨 **Flag Censure (`qa_flag_negative`)** : Toute grandeur `< 0` allumera ce drapeau. La remontée quantitative sera effacée (ou insérée en méta) pour ne pas tuer les bilans de masses.
- 🟥 **Politique de Rejet Absolu (`WOULD_SKIP`)** : Un test qualitatif stritement `NULL` n'apporte aucune donnée de valeur. La ligne ne migrera même pas vers la prod.
- 🟥 **Clé Station (`WOULD_CONFLICT`)** : En l'absence confirmée d'un `ire_station` spatialisé, la ligne est orpheline. Exclusion.

## 3. Clé Temporelle Idempotente
- `[station_id, temps, parametre_ref_id]`

## 4. Politique d'Héritage Unitaire
Aucun transfert arbitraire d'unité (ex: inventer des Mg/L). L'unité transitoire sera héritée par la jointure sur le paramètre canonique (quand celui-ci est `🟩 Validé`). Les ambigus hériteront de string vides `N/A`.
