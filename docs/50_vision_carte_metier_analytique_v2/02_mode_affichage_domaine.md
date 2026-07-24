# Mode 2 — Affichage par Domaine (Sprint 2D)

**Logique :** `Domaine → Paramètre → Supports disponibles → Sélection multi-supports → Carte + Workspace`

## 1. Principe

L'utilisateur souhaite étudier un phénomène ou paramètre de manière transverse, indépendamment d'un support spécifique.

## 2. Exemple métier

```text
Qualité → Cadmium
Supports disponibles :
☑ Stations Qualité
☑ Sentinelles
☐ Barrages
☐ Points prélèvement pollution
```

## 3. Classification automatique des résultats

Les données remontées par la sélection sont restituées selon leur nature :

| Type | Restitution |
|------|-------------|
| **Valeurs ponctuelles** | KPI (valeur actuelle, classe, dernière mesure) affichés sous forme tabulaire ou étiquettes |
| **Séries temporelles** | Graphiques avec analyse de tendance, comparaison multi-stations sur la même échelle de temps |
