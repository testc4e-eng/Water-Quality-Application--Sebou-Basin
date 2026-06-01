# Backlog client et hors restitution

| Parametre | Statut | Raison | Action |
|---|---|---|---|
| `FM` | `CLIENT_REQUIRED_HORS_RESTITUTION` | Signification non validee, pas d'unite, aucune occurrence finale qualite | Ne pas exposer ; conserver en quarantaine/staging si reapparait ; demander arbitrage client |
| `F_M_MES` | `CLIENT_REQUIRED_HORS_RESTITUTION` | Signification non validee, pas d'unite, aucune occurrence finale qualite | Ne pas exposer ; conserver en quarantaine/staging si reapparait ; demander arbitrage client |
| `MD` | `CLIENT_REQUIRED` | Backlog client documentaire, hors lot courant des 65 actifs sans `table_cible` | Maintenir en backlog client ; ne pas creer de restitution tant que non arbitre |

## Regles

- Aucun de ces parametres ne doit etre expose dans les dashboards publics.
- Aucun mapping automatique vers `MES`, fluorures ou matieres decantables n'est autorise.
- Toute reapparition dans une ingestion future doit etre routee vers quarantaine avec justification.

## Etat apres update `table_cible` du 2026-05-13

Le recalcul metier des `table_cible` a ete applique uniquement sur les 63 parametres valides. Les seuls parametres actifs conserves sans `table_cible` sont :

| Parametre | Statut post-update | Decision |
|---|---|---|
| `FM` | `CLIENT_REQUIRED_HORS_RESTITUTION` | Ne pas exposer ; validation client requise |
| `F_M_MES` | `CLIENT_REQUIRED_HORS_RESTITUTION` | Ne pas exposer ; validation client requise |

`MD` reste en backlog client documentaire et ne doit pas etre expose tant que son usage metier n'est pas arbitre.

Controle post-update : aucune unite, aucun alias, aucun statut et aucune table de mesures n'ont ete modifies.
