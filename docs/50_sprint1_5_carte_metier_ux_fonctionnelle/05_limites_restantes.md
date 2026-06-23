# 5. Limites Restantes

Bien que le Sprint 1.5 corrige les problèmes fonctionnels majeurs (clustering, filtres réels, popups, KPIs statistiques), certaines limites architecturales doivent être prises en compte pour le **Sprint 2** (Analyse Multi-Support Avancée) :

1. **Popup : Absence de dernière mesure en temps réel sur la carte** : 
   La dernière valeur n'est visible que dans le panneau d'analyse (qui l'extrait de `/series`). Si l'on souhaite l'injecter massivement dans toutes les popups, il faudra exposer la colonne `last_value` directement dans le retour GeoJSON de `/features` via le backend.

2. **Panneaux rigides** :
   Les panneaux sont positionnés de manière "flottante" via Tailwind (`absolute left-4`), mais ne sont pas drag-and-drop. Ils peuvent légèrement surcharger l'écran sur de petits moniteurs.

3. **Classification réglementaire non connectée** :
   La coloration des entités repose uniquement sur le type de support (bleu pour l'eau, rouge pour la pollution, etc.). La V2 nécessitera de coloriser selon l'état qualitatif officiel (ex: Mauvais = Rouge, Bon = Bleu).

4. **Comparaison temporelle** :
   Le graphique Recharts affiche une seule série temporelle pour un objet. La comparaison inter-paramètres ou inter-stations (deux courbes superposées) n'est pas encore implémentée.
