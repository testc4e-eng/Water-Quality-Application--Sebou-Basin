# Questions Métier à Trancher (Fusion Qualité)

Avant toute fusion physique des 4 tables de qualité, les points suivants doivent être validés par l'équipe d'expertise métier :

1. **Règle de résolution des doublons métier** :
   - En cas de conflit strict (Même station, même date, même paramètre) entre `qualite.mesure_qualite_sebou` (Sentinelles qualifiées) et `qualite.mesure_qualite_riviere` (Historique), quelle source est définie comme **maître** ? (Recommandation technique : prioriser `sebou`).

2. **Valeurs négatives et hors limites** :
   - Historiquement, certaines mesures ont des valeurs absurdes (ex: -9999). Autorisez-vous l'équipe technique à nullifier / exclure ces données automatiquement lors du processus d'unification via le staging ?

3. **Intégration du Barrage de Garde** :
   - Confirmez-vous que la table `suivi_qualite_barrage_garde_hebdo` peut partager la même table de fond (`mesure_qualite_unifiee`) à condition que son `support_type` soit formellement isolé (`BARRAGE_GARDE`) ? Cela permet d'alléger la maintenance de l'API tout en séparant logiquement la donnée.

4. **Nommage des paramètres non réglementaires** :
   - Des paramètres historiques (ex: `BOD` au lieu de `DBO5`, ou `MeS` au lieu de `MES`) existent dans `mesure_qualite_riviere`. Souhaitez-vous un mapping automatique lors de l'insertion, ou préférez-vous écarter en quarantaine toutes les données dont le code ne matche pas strictement le référentiel ?

5. **Décommissionnement** :
   - Après la fusion (Phase G), à quel moment considérez-vous qu'on peut formellement supprimer (DROP) les anciennes tables sans risque d'audit rétrospectif externe ?
