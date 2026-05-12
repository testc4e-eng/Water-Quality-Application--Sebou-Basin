# Formulation rapport client final

## Anomalies a transmettre client

### MO_METAL

Apres extraction detaillee, les 11 lignes `MO_METAL` restantes ne sont plus proposees comme anomalie client bloquante.

Constat :

```text
Les lignes restantes proviennent toutes du libelle source Molybdene(mg/l), rattache au parametre metier Mo / Molybdene.
```

Decision proposee :

```text
Traitement C4E possible apres validation interne : creation/synchronisation du referentiel Mo et mapping strict des 11 lignes tracees source.
```

Question client :

```text
Aucune question client requise si C4E valide que Molybdene(mg/l) correspond bien au parametre Mo en mg/L.
```

Precision critique :

```text
MO = Matieres organiques et Mo = Molybdene. La casse est metier et doit etre conservee.
```

### NUMEROTATION

Formulation client :

```text
Une ligne historique de nappe contient le champ Numerotation_GT, interprete comme identifiant legacy et non comme parametre de qualite eau. Cette ligne n'est pas exposee dans les dashboards qualite et reste conservee uniquement pour tracabilite source.
```

Action client demandee :

```text
Aucune action client immediate. Si le client souhaite exploiter ce champ, il doit fournir la definition fonctionnelle de Numerotation_GT et son usage attendu hors qualite analytique.
```

## Impact metier

| Cas | Impact dashboard | Impact IA/reporting | Impact migration |
|---|---|---|---|
| `MO_METAL` | non expose tant que non mappe | non utilise dans agregations | correction C4E sure proposee |
| `NUMEROTATION` | exclu | exclu | legacy ignore |

## Formulation executive

```text
REF-001 a REF-004 sont clos cote C4E. Les deux restes post-cloture ne constituent pas de bloquant migration : MO_METAL est resoluble par tracabilite source vers Molybdene, et NUMEROTATION est un champ legacy non analytique conserve hors dashboards.
```
