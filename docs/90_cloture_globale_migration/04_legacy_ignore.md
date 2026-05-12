# Legacy ignore

## Objets classes `LEGACY_IGNORE`

| Objet | Volume | Decision | Justification |
|---|---:|---|---|
| `NUMEROTATION` dans `qualite.mesure_qualite_nappe` | 1 | `LEGACY_IGNORE` | champ identifiant `Numerotation_GT`, non parametre qualite |
| `public.*` | 3 objets | `LEGACY_IGNORE` | historique non couche production |
| `staging.*` | 81 objets | `LEGACY_IGNORE` | audit/reprise uniquement |

## Regles

- ne pas exposer `NUMEROTATION` dans les dashboards qualite ;
- ne pas creer de parametre canonique `NUMEROTATION` ;
- ne pas utiliser `public.*` comme source API ;
- conserver `staging.*` pour audit, preuves et ingestion future, pas pour restitution.
