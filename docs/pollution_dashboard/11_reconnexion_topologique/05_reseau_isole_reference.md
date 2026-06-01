# Composant Isolé de Référence (ISOLATED_ACCEPTED)

## Identification
Conformément à la validation métier (Capture de référence du 14/05/2026), un tronçon spécifique doit rester déconnecté du réseau principal.

- **Edge ID :** [À CONFIRMER]
- **Nom Oued :** [À CONFIRMER]
- **Localisation :** Bassin amont / Zone spécifique.

## Justification
Ce tronçon correspond à une zone d'écoulement endoréique ou à une perte karstique documentée. Il ne doit **PAS** être reconnecté artificiellement pour le routage de pollution, car le polluant n'atteindrait jamais le barrage de garde via ce chemin.

## Implémentation Graphe
Dans NetworkX, ce composant sera marqué avec l'attribut `qa_status = 'ISOLATED_ACCEPTED'`.
Il sera coloré en **Gris Foncé** sur le frontend QA.
