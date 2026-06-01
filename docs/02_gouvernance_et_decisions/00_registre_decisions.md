# Registre des décisions SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | document maître |
| Source de vérité | Oui, pour les décisions projet |
| Snapshot | 2026-05-22 |

## Décisions validées

| ID | Sujet | Décision | Date | Responsable | Impact |
|---|---|---|---|---|---|
| DEC-001 | Migration historique | Clôturée avec backlog | 2026-05-08 | Data/C4E | fin pilotage par lots |
| DEC-002 | Documentation | Nouvelle gouvernance stratégique active | 2026-05-22 | Projet | documents maîtres prioritaires |
| DEC-003 | Réorganisation | Lot A déplacé vers `12_historique_et_archives/root_legacy` | 2026-05-22 | Projet | 50 fichiers historiques racine archivés |
| DEC-004 | BD réelle | La BD `abh_sad` prime sur docs anciennes | 2026-05-22 | Data | contradictions documentées |
| DEC-005 | `public.*` | Ne pas traiter comme contrat production | 2026-05-22 | Backend/Data | purge legacy |
| DEC-006 | Barrages | volumes journaliers distincts des débits | 2026-05-08 | Métier/Data | cohérence hydro |
| DEC-007 | Qualité sensible | `MO` et `Mo` restent distincts | 2026-05-13 | Métier/Data | évite faux mapping |
| DEC-008 | IDP | aucune fusion destructive automatique | 2026-05-19 | SIG/Data | lineage préservé |
| DEC-009 | Routage pollution | topologique visuel, non hydraulique scientifique | 2026-05-14 | SIG/Data | garde-fou dashboard |
| DEC-010 | SWAT/WASP | outputs actuels sandbox legacy | 2026-05-22 | Modèles/Data | pas décisionnel |
| DEC-011 | Dashboards P0 | nouvelles routes isolées | 2026-05-20 | Front/Back | pas de remplacement legacy |

## Décisions implicites à formaliser

| ID | Sujet | Décision implicite | Action |
|---|---|---|---|
| DEC-IMP-001 | Dossiers historiques | les dossiers `32_*` à `89_*` deviennent preuves historiques | exécuter par lot B après revue liens |
| DEC-IMP-002 | Référentiel réglementaire | statut DEV partiel | obtenir validation métier |
| DEC-IMP-003 | Ingestion V1 | conception prête, non production | définir seuil GO industrialisation |
| DEC-IMP-004 | API qualité | coexistence `/quality` legacy et `/qualite` P0 | clarifier contrat public |

## Décisions en attente

| ID | Sujet | Décision attendue | Responsable | Priorité |
|---|---|---|---|---|
| DEC-PENDING-001 | IDP spatial | arbitrage doublons/orphelins/conflits | Métier + SIG | P0 |
| DEC-PENDING-002 | Paramètres | dictionnaire officiel final | Métier + Data | P0 |
| DEC-PENDING-003 | Réglementaire | version active et seuils officiels | Métier + Data | P0 |
| DEC-PENDING-004 | SWAT | validation scientifique | Reda | P0 |
| DEC-PENDING-005 | WASP | validation scientifique | Anas | P0 |
| DEC-PENDING-006 | Lot B documentaire | déplacement des dossiers historiques | Projet | P1 |

