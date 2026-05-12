# Analyse temporelle

## Source

- colonne temporelle : `date_jr`
- granularité observée : journalière
- plage détectée dans `E0` : `1996-12-01` → `2025-09-01`
- dates nulles : `92` lignes, toutes sur `ire_barrage = 1496/9`

## Cible

- colonne temporelle : `temps`
- toutes les heures/minutes/secondes sont à `00:00:00`
- la cible est donc stockée à granularité journalière

## Gaps et cadence dans la cible

Sur les successions par barrage :

- pas quotidiens (`delta = 1 jour`) : `84 818`
- gaps courts (`2` à `31` jours) : `2`
- gaps longs (`32` à `369` jours) : `1`
- gaps très longs (`>= 370`) : `0`

## Mélange de time steps

### Vérification métier

Le flux analysé ne mélange pas :

- journalier
- mensuel
- annuel
- instantané

### Conclusion

- `time_step incohérent` : `0`
- le blocage ne vient pas du temps
- le vrai problème est le **mélange de paramètres métier dans une table cible sous-dimensionnée**
