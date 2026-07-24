# Matrice de dependances

## Chemin critique MVP

### Dashboard Home

Depend de :
- `API /api/v1/dashboard/home`
- runtime backend dashboard
- services KPI/agregation
- robustesse frontend en cas d'erreur partielle

### Declaration Pollution

Dependra de :
- matrice metier officielle
- workflow complet
- roles et droits
- statuts et transitions
- validations et champs obligatoires
- contrats API
- integration carte / pollution / propagation / rapports

### Propagation

Depend de :
- endpoints propagation
- donnees pollution exploitable
- articulation avec les declarations

## Sujets geles hors blocage

- Dashboard Carte
- Dashboard Qualite
- Campagnes pollution
- Administration / Ingestion
