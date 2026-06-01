# Organisation par support spatial

## Contexte

Le même paramètre peut concerner plusieurs supports spatiaux. La lecture métier exige de distinguer clairement rivière, nappe, barrage et Sebou.

## Analyse

Le support spatial est un axe de lecture structurant au même niveau que la période et le paramètre.

## Solution

Supports à exposer dans la V1 test :

- `RIVIERE`
- `NAPPE`
- `BARRAGE`
- `SEBOU`

## Règles d'affichage

- Filtre support disponible avant chargement.
- `include_geom` demandé seulement en mode carte.
- Carte : restitution synthétique support par support.
- Tableau : restitution détaillée ligne par ligne.
- Graphique : évolution temporelle du support filtré ou de l'ensemble.

## Améliorations optionnelles

- Ajouter une bascule par entité géographique fine.
- Ajouter une légende support harmonisée avec les couches MapLibre futures.
