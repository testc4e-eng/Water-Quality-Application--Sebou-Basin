# Anomalies transferees au rapport client final

## Synthese

Ces anomalies demandent une information absente, une confirmation metier ou un fichier client. Elles ne bloquent pas la cloture migration.

| ID | Question client | Donnee attendue | Priorite |
|---|---|---|---|
| GEO-001 | Quel est le rattachement officiel des stations aux nappes ? | table station/nappe ou regle geographique validee | P1 |
| GEO-002 | Quels points eau doivent etre rattaches a quelle nappe ? | table point_eau/nappe | P1 |
| GEO-003 | Quels points eau correspondent a quelles stations ? | table point_eau/station | P1 |
| GEO-004 | Quelle correspondance profil/nappe utiliser ? | table profil/nappe | P1 |
| GEO-005 | A quelle station correspond le cas `null I` ? | identifiant station officiel | P1 |
| QA-005 | Les donnees temperature existent-elles ? | fichiers temperature ou confirmation absence | P2 |
| QA-001 | Les valeurs evaporation nulles doivent-elles etre completees ? | fichiers complets ou validation lacune | P2 |
| QA-002 | Le symbole `-` en pollution signifie-t-il valeur absente ? | confirmation signification qualifier | P2 |

## Formulation courte client

Aucune anomalie bloquante ne subsiste. Les points ci-dessus sont requis pour enrichir les donnees, ameliorer les rattachements GEO et fiabiliser les analyses avancees.

