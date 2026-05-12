# Decision finale

## Context

Le referentiel existant reste exploitable comme base de reprise, et le dictionnaire final de cloture a maintenant ete materialise dans `metadata.referentiel_parametre_canonique`.

## Analysis

Etat verifie apres execution du `2026-05-07` :

- `metadata.referentiel_parametre_canonique` est cree et charge
- collision `DEBIT` resolue dans le referentiel canonique final
- `APPORTS_HM3` et `TRANSFERT` sont actifs avec unite `Mm3/j`
- nombreuses mesures qualite actives restent sans `parametre_ref_id`
- les consommateurs barrage restent encore a migrer completement vers le modele parametrique

## Solution

Decision :

- statut : `MIGRE_AVEC_BACKLOG`
- orientation : `UTILISER metadata.referentiel_parametre_canonique comme dictionnaire final`
- principe : conserver `metadata.referentiel_parametre` comme source historique, pas comme cible finale

Classification :

- `BACKLOG`
  - mise a jour des consommateurs legacy `lacher_m3s`
  - mapping qualite restant
  - unites qualite non consolidees
- `INFO`
  - SWAT/WASP ont deja des supports parametriques explicites
- `LEGACY_IGNORE`
  - variantes legacy qui restent uniquement en alias
