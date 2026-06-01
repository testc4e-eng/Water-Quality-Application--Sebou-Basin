# Procédure — Segments plats

## Périmètre
81 segments en statut `FLAT_SEGMENT`.

## Objectif
Identifier si le segment plat peut rester tel quel ou s'il nécessite une vérification métier.

## Méthode
Pour chaque segment orange :
1. Vérifier la longueur.
2. Observer la position dans le bassin : plaine, retenue, barrage, confluence.
3. Comparer avec les segments voisins.
4. Vérifier si la différence altimétrique est réellement proche de 0.
5. Renseigner la décision.

## Décisions recommandées
| Situation | Décision |
|---|---|
| Segment en plaine ou pente naturellement faible | VALIDATED_AS_IS |
| MNT insuffisant pour trancher | IGNORE_MNT_ARTIFACT |
| Contexte réseau douteux | UNCERTAIN |
| Besoin d'information terrain | NEED_FIELD_VALIDATION |

## Attention
Un segment plat n'est pas forcément faux. Le MNT 30 m peut lisser les pentes faibles.
