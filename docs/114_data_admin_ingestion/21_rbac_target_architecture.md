# Architecture RBAC cible MVP4

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | architecture cible |
| Source de vérité | Oui pour MVP4 |
| Date | 2026-06-05 |

## Rôles cibles

- `ROLE_DECIDEUR`
- `ROLE_EXPERT`
- `ROLE_CONSULTANT`
- `ROLE_DATA_ADMIN`
- `ROLE_SYS_ADMIN`
- `ROLE_AI_AGENT`

## Permissions techniques matérialisées

- `dashboard.read`
- `data_admin.audit.read`
- `data_admin.template.generate`
- `data_admin.upload`
- `data_admin.validation.review`
- `data_admin.change_request.create`
- `data_admin.change_request.submit`
- `data_admin.change_request.approve`
- `data_admin.change_request.apply`
- `data_admin.rollback.apply`
- `data_admin.reference.manage`
- `security.users.manage`
- `security.password_reset.manage`
- `security.logs.read`

## Matrice fonctionnelle

| Action | DECIDEUR | EXPERT | CONSULTANT | DATA_ADMIN | SYS_ADMIN | AI_AGENT |
|---|---|---|---|---|---|---|
| Dashboard | OUI | OUI | OUI | OUI | OUI | OUI |
| Audit données | OUI | OUI | OUI | OUI | OUI | OUI |
| Upload | NON | OUI | OUI | OUI | OUI | OUI |
| Validation | NON | OUI | NON | OUI | OUI | NON |
| Approbation | NON | OUI | NON | OUI | OUI | NON |
| Promotion | NON | NON | NON | OUI | OUI | NON |
| Rollback | NON | NON | NON | OUI | OUI | NON |
| Gestion référentiels | NON | OUI | NON | OUI | OUI | NON |
| Gestion utilisateurs | NON | NON | NON | NON | OUI | NON |

## Traduction opérationnelle

### `ROLE_DECIDEUR`

- lecture dashboard ;
- lecture audit ;
- aucun upload ;
- aucune validation ;
- aucune action de promotion.

### `ROLE_EXPERT`

- audit, canevas, upload ;
- revue métier ;
- approbation ;
- pas d'`apply` métier ;
- pas de rollback métier.

### `ROLE_CONSULTANT`

- audit, canevas, upload ;
- préparation des lots ;
- pas d'approbation ;
- pas de promotion ;
- pas de rollback.

### `ROLE_DATA_ADMIN`

- contrôle complet du flux `data_admin` ;
- promotion `INSERT_ONLY` ;
- rollback logique `INSERT_ONLY` ;
- pas de gestion utilisateurs globale.

### `ROLE_SYS_ADMIN`

- toutes les capacités `data_admin` ;
- gestion utilisateurs ;
- gestion demandes de reset ;
- lecture des logs de sécurité.

### `ROLE_AI_AGENT`

- audit ;
- génération de canevas ;
- upload ;
- création et soumission de demandes ;
- pas d'approbation ;
- pas d'`apply` ;
- pas de rollback.

## Compatibilité legacy

Les rôles historiques suivants restent supportés pour éviter toute régression :

- `viewer`
- `manager`
- `admin`

Ils sont mappés sur les mêmes permissions via `security.role_permissions`, mais ne constituent plus le modèle cible de démonstration.
