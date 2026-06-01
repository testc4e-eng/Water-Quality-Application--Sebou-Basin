# Consommation API qualité réglementaire

## Contrat officiel

- `type_eau=surface_generale`
- `active_only=true` pour les seuils opérationnels
- `water_type` : `LEGACY_DEPRECATED`, warning obligatoire si utilisé

## Statuts affichés

- `NON_CLASSIFIABLE`
- `HORS_PERIMETRE_REGLEMENTAIRE`
- `TYPE_EAU_NON_OPERATIONNEL`
- `PARAMETRE_NON_REGLEMENTAIRE`

## Corrections backend P0

- `/quality/thresholds` refuse les types documentaires.
- `/quality/classify` refuse les types documentaires.
- Un paramètre observationnel retourne `NON_CLASSIFIABLE`.
- Un paramètre classifiable sans seuil actif retourne `HORS_PERIMETRE_REGLEMENTAIRE`.
- La réponse classification expose `type_eau_resolved` et `deprecated_field_used`.
