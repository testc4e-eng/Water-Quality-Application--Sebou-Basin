# Résolution finale des stations température

## Volumétrie par statut QA
| Statut QA | Lignes |
|---|---|
| MANUAL_VALIDATED | 135913 |
| MANUAL_VALIDATED_WITH_SOURCE_ALIAS | 22524 |
| VALIDATED | 286757 |


## Décisions clés
- Les 11 stations précédemment bloquées sont validées en `MANUAL_VALIDATED`.
- `Bab Ouender` et `Bab_Ouender` sont validées comme `SAME_STATION_DIFFERENT_PERIODS` et rattachées à `bab ouender / 260/9` avec statut `MANUAL_VALIDATED_WITH_SOURCE_ALIAS`.
- Le nom source original doit être conservé dans `source_station_name`.

## Mapping final
| Source | Lignes | Station canonique | Code | station_id | Type | QA |
|---|---|---|---|---|---|---|
| ABHS | 14245 | fes (ABHS) | 3817/600 | d4ba6716-3169-4af4-be47-042db7ba289e | pluviometrique | MANUAL_VALIDATED |
| Aguelmam_Sidi_Ali | 14245 | aguelmam sidi ali | 1652/22 | a963a9da-0441-4b33-b6aa-6ffbc1041125 | pluviometrique | VALIDATED |
| Ain_aicha | 8644 | ain aicha | 1217/9 | 5776b37c-48c8-41b2-8f3d-afadac7fd12e | hydrologique | VALIDATED |
| Ait_Khabbach | 14245 | ait khabbach | 585/22 | 1b62f3e9-91a7-4c4a-9385-d3aa78eae978 | hydrologique | VALIDATED |
| Azibe_Soltane | 14245 | azib soltane | 1540/15 | b647955a-e26d-4564-8509-25cb40ef1404 | hydrologique | MANUAL_VALIDATED |
| Azzaba | 14245 | azzaba | 583/22 | 68d55282-7106-4a08-a074-0d8c92a609dd | hydrologique | VALIDATED |
| Bab Chhoub | 15867 | bab chhoub | 702/16 | 1230cd2c-2ca1-483a-8466-d6585fcfbd61 | hydrologique | VALIDATED |
| Bab Merzouka | 15867 | bab merzouka | 551/16 | da925486-bca7-49e3-af60-ea5f2294a77a | hydrologique | VALIDATED |
| Bab Ouender | 13880 | bab ouender | 260/9 | 517c713a-dda4-4dcb-a033-4143062487fd | hydrologique | MANUAL_VALIDATED_WITH_SOURCE_ALIAS |
| Bab_Ouender | 8644 | bab ouender | 260/9 | 517c713a-dda4-4dcb-a033-4143062487fd | hydrologique | MANUAL_VALIDATED_WITH_SOURCE_ALIAS |
| Bab_taza | 8644 | bab taza | 1586/600 | 3b477290-57ad-4aff-bf46-9418e450dc8d | pluviometrique | VALIDATED |
| Belksiri | 14245 | pont bel ksiri | 3694/8 | 475219d3-b07e-4a02-a189-1b4a743d04c7 |  | MANUAL_VALIDATED |
| Beni Heitem | 15867 | beni heitem | 672/16 | c9eda862-abf9-4375-b614-2e1b2eb84715 | hydrologique | VALIDATED |
| Boufellou | 8644 | boufellou | 1749/9 | 8672b830-aff8-4fd3-87a7-a43ac966af68 | hydrologique | VALIDATED |
| Boured | 8644 | boured | 295/10 | 7042849a-fb8a-4d37-9c74-94d910553723 | hydrologique | VALIDATED |
| Dar_El_Arssa | 14245 | dar el arsa | 2263/15 | 706fc2fe-3cee-4ec2-8e85-dbde9b672f89 | hydrologique | MANUAL_VALIDATED |
| Dar_El_Hamra | 14245 | dar el hamra | 1000/23 | bc8e6d83-08d3-4bfa-8c78-daa754af79b7 | hydrologique | VALIDATED |
| El_Malha | 8644 | el malha | 323/4 | fc8e8e8b-494c-46b7-aa72-d634d4c19cd2 | hydrologique | VALIDATED |
| El_Mers | 14245 | el mers | 541/23 | 2ad1ba50-cc7b-456a-8464-0dd4dd9058c7 | hydrologique | VALIDATED |
| ElHamam | 8644 | el hammam | 2062/21 | 440fef7e-9048-4ec4-ac30-d94a20e4f562 | hydrologique | MANUAL_VALIDATED |
| Galaz | 8644 | galaz | 1216/9 | 6f1bbf08-ce82-4dfe-ae44-6e26c9ef07e4 | hydrologique | VALIDATED |
| Had_kourt | 14245 | had kourt | 1436/8 | eecf0ca7-8e8b-45b1-b00c-ae8e75fd60ce | hydrologique | VALIDATED |
| Hajria | 8644 | hajria | 1508/9 | 0436c345-452d-4239-a3e3-2842fd3ab7b1 | hydrologique | VALIDATED |
| Jbel_oudka | 8644 | jbel oudka | 4626/600 | cfa0fcf9-82d2-4dae-be20-06b36bfe0fd3 | pluviometrique | VALIDATED |
| Kharrouba | 14245 | kharrouba | 454/9 | b1ba728c-f39b-4922-9a0c-3581390019e8 | hydrologique | VALIDATED |
| Khennichet | 8644 | khenichet | 1359/8 | 9d9c6454-777b-455f-a927-da8e8d63b5ec | hydrologique | MANUAL_VALIDATED |
| Lalla_Mimouna | 14245 | lalla mimouna | 1815/8 | 343b85cf-030e-46d8-b892-c4ce6cee7bd7 | hydrologique | VALIDATED |
| Moulay_Ali_Cherif | 14245 | my ali cherif | 1545/8 | d65b42a0-4871-4582-9950-1465e53adaaa | hydrologique | MANUAL_VALIDATED |
| OuedIfrane | 8644 | souk el had oued ifrane | 618/22 | 81f85bbe-9afa-4c6b-b051-ff0de9f75df6 | hydrologique | MANUAL_VALIDATED |
| Oulad_yaacoub | 14245 | oulad yaacoub | 6153/600 | 05239150-c8b0-4925-be27-95c3fcd483da | pluviometrique | VALIDATED |
| Ratba | 8644 | ratba | 1708/9 | ddd6fea0-22b6-49b3-83c9-7533a1188a86 | hydrologique | VALIDATED |
| Rdom | 8644 | souk el had rdom | 3261/14 | 9de7c827-693d-4af0-9f1f-ec66a407ccb3 | hydrologique | MANUAL_VALIDATED |
| Route26 | 14245 | pont rp 26 | 1541/15 | d098a56d-7e97-453f-b1c0-32305b595087 | hydrologique | MANUAL_VALIDATED |
| Tabouda | 8644 | tabouda | 1215/9 | f88b46fe-ff1e-4b06-916d-8f3d465562ca | hydrologique | VALIDATED |
| Taghzout | 8644 | taghzout | 1707/9 | 5b01a831-2781-4d2e-b60a-aaba6238d325 | hydrologique | VALIDATED |
| Tissa | 15867 | tissa boukarkour | 2551/15 | c65f2655-996e-4d9e-942d-a2da7b4dafe7 | hydrologique | MANUAL_VALIDATED |
| Zrarda | 15867 | zrarda | 891/16 | 7e275775-8cc5-4644-8381-87b3b3663f64 | hydrologique | VALIDATED |

