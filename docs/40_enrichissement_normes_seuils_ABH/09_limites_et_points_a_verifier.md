# Limites et points à vérifier

- le PDF a été lu visuellement à partir des pages rendues en image ; l’extraction texte automatique du PDF source était vide
- les pages de travail principales sont les pages PDF `8`, `12`, `13` et `14`
- les notations scientifiques des lignes microbiologiques sur les lacs et les eaux souterraines (`25.10⁶`, `15.10⁷`) sont à confirmer manuellement
- certaines cellules de pH, calcium, sodium, NTK et nitrates sont vides dans les grilles simplifiées ; elles ont été laissées non renseignées
- la page `8` contient une grille générale plus riche que les grilles simplifiées ; elle doit être arbitrée comme norme principale ou norme de contexte
- le rapprochement inventaire ↔ PDF est une proposition automatique et ne vaut pas validation métier
- plusieurs paramètres inventaire relèvent de la météo, de l’hydrologie, de la pollution ou des modèles SWAT/WASP et ne sont pas couverts par ce PDF ABH
- les unités `µs/cm`, `mg/l`, `µg/l` et `/100ml` doivent être harmonisées avec l’écriture retenue par l’ABH
- paramètres du PDF non retrouvés clairement dans l’inventaire : Détergents anioniques, H.P.A. totaux, Hydrocarbures, Pesticides par substance, Pesticides totaux
- les seuils lus comme `100--200` ou les cellules visuellement ambiguës ont été conservés avec mention `à confirmer` dans le commentaire d’extraction
- une validation ABH reste nécessaire avant toute intégration dans un futur `metadata.parametre_master`
