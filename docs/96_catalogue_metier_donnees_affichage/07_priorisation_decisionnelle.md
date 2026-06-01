# Priorisation décisionnelle

## Niveaux

- `P0` = décision immédiate
- `P1` = analyse quotidienne
- `P2` = analyse historique
- `P3` = archive / consultation

## Matrice

| Domaine / famille | Niveau | Justification |
|---|---|---|
| Hydrologie barrage (`NIVEAU_EAU`, `VOLUME`, `LACHER`, `APPORT`, `TRANSFERT`) | P0 | impact direct décision ouvrage |
| Qualité P0 (`metaux`, `chimie-minerale`, `physicochimie`, `pollution-organique`) | P0 | première restitution spécialisée prête pour dashboard |
| Télémesure future | P0 | surveillance et alerte |
| Pollution / IDP cartes constats et points | P1 | forte utilité métier, non encore branché |
| Météo pluie / évaporation | P1 | contexte décisionnel quotidien |
| Hydrologie débit | P1 | analyse quotidienne et support décision |
| Microbiologie / biologique / terrain | P1 | utiles mais non prioritaires DG |
| Historique qualité et comparaison | P2 | tendance et expertise |
| Organoleptique, contexte station, hydromorphologie | P3 | consultation only |
| SWAT / WASP legacy | P3 | utile en prospective, pas en décision immédiate |

## Lecture par persona

- DG / cadres : P0 puis P1
- ingénieurs / analystes : P1 puis P2
- équipe technique : P2 puis P3
