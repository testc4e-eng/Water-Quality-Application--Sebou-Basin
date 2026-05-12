# Checklist validation C17

- [ ] couverture OK : taux de validation referentiel 19.0% ; `A_VALIDER`=96 ; `NON_RECONNU`=65
- [ ] parametres critiques OK : 21 blocages critiques restants
- [ ] mappings OK : 91 lignes critiques encore en `A_VALIDER` ou `QUARANTAINE`
- [ ] regles QA OK : base regles presente, mais RS/TA/TAC/SiO2/SiO3 non totalement stabilises
- [x] securite OK : SQL actif=0, metadata cible non creee, raw non modifie, aucun lot E lance

## Blocages a lever avant validation

- `APPORTS_HM3` : A_VALIDER
- `NIVEAU_EAU` : A_VALIDER
- `VOLUME` : A_VALIDER
- `RESTITUTION` : A_VALIDER
- `TRANSFERT` : A_VALIDER
- `TA` : A_VALIDER
- `TAC` : A_VALIDER
- `TH` : A_VALIDER
- `MO` : A_VALIDER
- `RS105` : A_VALIDER
- `SF` : A_VALIDER
- `CU` : A_VALIDER
- `ZN` : A_VALIDER
- `NI` : A_VALIDER
- `CR` : A_VALIDER
- `SE` : A_VALIDER
- `SN` : A_VALIDER
- `SB` : A_VALIDER
- `V` : A_VALIDER
- `SIO2` : A_VALIDER
- `SIO3` : A_VALIDER
