# Décision de clôture de la qualification

## Objet

Préparer la décision finale de clôture de la phase de qualification métier préproduction.

## Scénario A

### Toutes les validations obtenues

Conséquence :

- `QUALIFICATION_METIER_CLOTUREE`
- passage en préproduction sur le périmètre validé
- mise à jour du dossier de gouvernance et du statut projet

## Scénario B

### Validations partielles

Conséquence :

- `PREPRODUCTION_CONDITIONNEE`
- seuls les domaines validés passent en préproduction ;
- les sujets non validés restent tracés dans une matrice d’actions post-validation ;
- la qualification n’est pas remise en cause ; elle reste partiellement ouverte sur des décisions ciblées.

## Rappel de responsabilité

### Mission C4E

- migration ;
- contrôle ;
- qualification ;
- documentation ;
- traçabilité.

### Responsabilité client

- validation ;
- arbitrage ;
- confirmation ;
- correction si requise sur la donnée source.

## Recommandation

Le scénario recommandé à ce stade est :

`PREPRODUCTION_CONDITIONNEE`

Motif :

- le socle SAD est avancé ;
- les contrôles sont réalisés ;
- les arbitrages sont préparés ;
- certaines validations métier structurantes restent attendues sur D1 à D4.
