# Droits d'Accès Bassin et Intégration des Seuils

Pour éviter l'accumulation de dettes d'architecture et de sécurité, deux éléments cruciaux doivent être spécifiés dès le début :

## 1. Droits d'Accès par Bassin
Même si le projet actuel se concentre sur le Sebou, l'API cartographique doit intégrer une gestion des droits dès le Sprint 0.

L'API doit filtrer en fonction des permissions de l'utilisateur :
```json
{
  "user_id": "expert_sebou",
  "authorized_basins": ["SEBOU"],
  "authorized_subbasins": ["MOYEN_SEBOU"]
}
```
Ceci assure la sécurité et évite la fuite de données lors des futures évolutions multi-bassins.

## 2. Seuils Réglementaires comme Couche de Référence
La structure de la carte métier doit être préparée pour absorber :
* Les seuils réglementaires.
* Les palettes qualité.
* Les classes réglementaires (marocaines).

Exemple : L'affichage du paramètre "pH" doit nativement prévoir l'application de la palette colorimétrique issue des classes réglementaires marocaines, anticipant l'implémentation de la classification (V2) sans repenser les légendes de la carte.
