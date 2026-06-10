# Comptes de démonstration MVP4

Ces comptes sont réservés à `DEV` et démonstration client. Ils ne doivent pas être réutilisés en production.

## ROLE_DECIDEUR

Login : `demo_decideur`  
Password : `Demo@2026`

Permissions principales :

- dashboard
- audit données

Écrans accessibles :

- accueil et dashboards
- `/admin/data-governance/audit` en lecture

Scénario démo recommandé :

- consulter le catalogue des classes ;
- lire les compteurs ;
- visualiser les états de santé ;
- constater l'absence de boutons d'action métier.

## ROLE_EXPERT

Login : `demo_expert`  
Password : `Demo@2026`

Permissions principales :

- audit
- canevas
- upload
- validation
- approbation
- gestion référentiels de gouvernance

Écrans accessibles :

- audit classes
- génération canevas
- upload/staging
- change request avec approbation

Scénario démo recommandé :

- générer un canevas ;
- uploader un fichier ;
- examiner les erreurs ;
- approuver une change request ;
- constater l'absence du droit `Apply`.

## ROLE_CONSULTANT

Login : `demo_consultant`  
Password : `Demo@2026`

Permissions principales :

- audit
- canevas
- upload
- création et soumission de demandes

Écrans accessibles :

- audit
- canevas
- ingestion
- création de change request

Scénario démo recommandé :

- charger un fichier ;
- consulter le rapport d'erreurs ;
- créer puis soumettre une demande ;
- constater le blocage sur `Approve` et `Apply`.

## ROLE_DATA_ADMIN

Login : `demo_data_admin`  
Password : `Demo@2026`

Permissions principales :

- audit
- canevas
- upload
- validation
- approbation
- promotion
- rollback
- gestion référentiels de gouvernance

Écrans accessibles :

- tout le portail `Data Governance`

Scénario démo recommandé :

- charger un fichier ;
- vérifier le staging ;
- créer une change request ;
- approuver ;
- promouvoir ;
- exécuter le rollback logique.

## ROLE_SYS_ADMIN

Login : `demo_sys_admin`  
Password : `Demo@2026`

Permissions principales :

- toutes les permissions `ROLE_DATA_ADMIN`
- gestion utilisateurs
- demandes de reset
- lecture logs sécurité

Écrans accessibles :

- portail `Data Governance`
- écrans utilisateurs et sécurité

Scénario démo recommandé :

- démontrer le flux complet data-admin ;
- montrer la gestion des utilisateurs ;
- montrer les restrictions sur les autres rôles.

## ROLE_AI_AGENT

Login : `demo_ai_agent`  
Password : `Demo@2026`

Permissions principales :

- audit
- canevas
- upload
- création et soumission

Écrans accessibles :

- audit
- canevas
- ingestion sans approbation ni apply

Scénario démo recommandé :

- préparer un lot ;
- lancer un upload ;
- produire une demande ;
- montrer que l'agent ne peut pas approuver ni promouvoir.
