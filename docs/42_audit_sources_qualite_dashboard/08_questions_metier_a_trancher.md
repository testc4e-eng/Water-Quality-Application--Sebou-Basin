# Questions Métier à Trancher

À l'issue de cet audit approfondi sur les structures de données, plusieurs questions fondamentales doivent être tranchées avec l'équipe métier avant de figer la logique applicative du Dashboard Qualité :

1. **Périmètre du Dashboard Qualité des Eaux :**
   * Le dashboard Qualité doit-il afficher **exclusivement** les 6 stations sentinelles (temps réel) ou faut-il conserver une vue globale sur les historiques (`mesure_qualite_riviere`) qui couvrent des centaines d'autres stations ?

2. **Traitement du Barrage de Garde :**
   * Le barrage de garde (historique hebdomadaire) doit-il avoir un onglet séparé dans le Dashboard Qualité, ou doit-il être intégré à une vue cartographique globale malgré sa nature différente ?

3. **Traitement des Nappes Souterraines :**
   * Les nappes (`mesure_qualite_nappe`) doivent-elles être visibles dans le même dashboard ou dans un module complètement séparé ("Eaux souterraines") ?

4. **Traitement des Points Sources (Pollution) :**
   * Les points sources / prélèvements de pollution (`source_pollution_*`) doivent-ils être traités comme qualité historique ou doivent-ils être déplacés formellement dans un "Dashboard Pollution / IDP" distinct ? L'audit recommande une exclusion totale du dashboard qualité réglementaire.

5. **Source de Vérité pour les Noms des Stations :**
   * Quelle source fait foi pour les noms de stations ? Actuellement, `api.v_station_dimension` centralise le référentiel physique (`infra.stations_mesure`) et les alias (`qualite.station_alias_metier`). Est-ce validé comme modèle définitif ?

6. **Campagnes de Pollution :**
   * Les campagnes pollution (`staging.raw_idp_*` et `qualite.source_pollution_prelevement`) doivent-elles être strictement exclues de ce dashboard ?

7. **Scalabilité des Stations Sentinelles :**
   * Faut-il prévoir dès maintenant une montée en charge de 6 stations vers N stations en temps réel (et donc adapter l'API pour qu'elle liste dynamiquement le contenu de `mesure_qualite_sebou`), ou code-t-on ces 6 IRE "en dur" comme un POC ?
