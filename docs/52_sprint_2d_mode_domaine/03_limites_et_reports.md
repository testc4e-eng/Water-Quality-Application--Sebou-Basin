# Limites et reports (Sprint 2D)

## 1. Filtrage Client vs Backend
- Actuellement, nous utilisons `parameter_code` dans la requête au backend `GET /api/v1/business-map/features`.
- S'il s'avère que le backend retourne encore des stations qui ne possèdent pas ce paramètre, un filtrage côté client (`properties.attributes[parameter_code]`) devra être ajouté à l'avenir. Le plan 2D a laissé ceci au backend en priorité.

## 2. Checkboxes de Supports (Mode Domaine)
- La fonctionnalité optionnelle proposée dans le Sprint 2D pour filtrer les supports au sein d'un domaine a été reportée au Sprint 2D.1 pour conserver la simplicité de l'interface actuelle et valider rapidement l'approche thématique.

## 3. Valeurs récentes absentes dans MapV1
- Les `latest_values` de la V1 ne sont pas systématiquement intégrées au GeoJSON allégé (`features`). Nous avons ajouté une lecture depuis `attributes`, en espérant que l'information y est injectée par le backend, sinon un fallback "Sélectionné pour analyse" est affiché pour inviter au clic "Ajouter au Workspace".
