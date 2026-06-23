# Limites des Indicateurs (Fallbacks)

Le Dashboard Qualité s'est plié à la règle : *"Ne jamais simuler ni inventer des données"*.
C'est pourquoi certains indicateurs sont marqués comme inactifs/à brancher dans le frontend actuel :

1. **Qualité globale (toutes stations) :** Affichera *"Classification globale à brancher après exposition des classes réglementaires par mesure"* jusqu'à ce que le backend expose un agrégat calculant les classes (Classe I, II, III).
2. **Aperçu carte :** Affichera *"Carte qualité à brancher après validation des coordonnées et classes qualité."* Le composant `BusinessMap` est réservé au Dashboard métier général.
3. **Évolution temporelle Globale :** L'encart de la vue d'ensemble affiche *"Donnée insuffisante — nécessite agrégat backend par mois/année"* pour éviter d'importer les 120 000 points bruts dans le frontend.
