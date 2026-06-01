# Backlog technique

## Backlog non bloquant

| ID | Bloc | Volume | Cause | Impact | Decision | Action | Responsable |
|---|---|---:|---|---|---|---|---|
| REF-005 | unites manquantes referentiel | 2 actifs residuels (`FM`, `F_M_MES`) | 37 unites validees et appliquees ; residuel client | exposition incomplete sur cas ambigus uniquement | `CLIENT_REQUIRED` | retour client sur `FM` / `F_M_MES`; `MD` reste suivi documentaire client | Client / C4E |
| REF-006 | `table_cible` manquante | 65 | exposition cible non renseignee | gouvernance API/IA incomplete | `BACKLOG_TECHNIQUE` | renseigner table cible ou classer hors restitution | C4E |
| REF-007 | mappings abreviations orphelins | 5 | sources non mappees | faible | `BACKLOG_TECHNIQUE` | analyser aliases restants | C4E |
| REF-008 | legacy riviere non resolus | 39 | mappings historiques | faible apres REF-001 | `BACKLOG_TECHNIQUE` | nettoyer audit ou archiver | C4E |
| REF-009 | suivi Sebou non resolus | 7 | mappings historiques | faible apres REF-003 | `BACKLOG_TECHNIQUE` | nettoyer audit ou archiver | C4E |
| QA-001 | evaporation nulles | 10308 | lacunes source | trous analytiques | `QA_WARNING` | filtrage dashboard, pas interpolation | C4E/client |
| QA-002 | pollution `valeur_num` null | 3447 | `valeur_raw = '-'` | valeurs non calculables | `QA_WARNING` | garder brut, exclure agregations numeriques | C4E |
| QA-003 | debit negatif | 2087 | donnees historiques flaggees | analytics a filtrer selon usage | `BACKLOG_TECHNIQUE` | conserver flag QA | C4E |
| QA-004 | qualite negative | 2 | cas ponctuels flagges | faible | `BACKLOG_TECHNIQUE` | revue metier ponctuelle | C4E |

## Regles de traitement

- aucune interpolation evaporation sans validation metier ;
- aucune conversion de `-` pollution en zero ;
- les valeurs sous seuil doivent etre gerees par qualifier, pas forcees en numerique ;
- les referentiels doivent rester case-sensitive pour les codes metier sensibles (`MO` / `Mo`).
