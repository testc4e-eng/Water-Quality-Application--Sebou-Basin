# Home V2 DG cockpit

## Objectif

Renforcer la lecture décisionnelle du bandeau supérieur sans modifier le contrat backend.

## État implémenté

- bandeau supérieur full-width ;
- KPI critiques compacts ;
- indicateurs opérationnels compacts ;
- tooltips métier détaillés ;
- tendance légère sur KPI critiques basée sur la dernière valeur de session disponible.

## Règle de tendance actuelle

Faute de série historique KPI native dans le contrat `/api/v1/dashboard/home`, la tendance DG affichée sur :

- `IQGB`
- `IFD`
- `IPP`
- `ISR`

est calculée comme :

- différence entre le payload courant
- et le dernier payload Home stocké en session navigateur.

## Intérêt

- améliore la perception décisionnelle ;
- ne fabrique pas un historique backend inexistant ;
- reste cohérent avec le cache session déjà utilisé par le Home.

## Limite

Cette tendance n’est pas une série historisée métier.

Pour une vraie tendance DG robuste, il faudra à terme :

- historiser les KPI côté backend ;
- exposer des deltas ou séries dédiées dans une API spécialisée.
