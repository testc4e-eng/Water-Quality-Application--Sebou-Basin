# Gestion Secrets - SAD Sebou 2026 Mission 4

RESUME GLOBAL
- niveau de risque estime : eleve
- perimetre analyse : backend config, auth, acces base de donnees
- principale preoccupation de securite : presence d'un fichier `backend/.env` versionne dans le depot

INDICES TECHNIQUES OBSERVES
- chargement des secrets via `load_dotenv()`
- `backend/.env` est present dans les fichiers suivis par Git
- `SECRET_KEY`, `DB_USER`, `DB_PASS` et autres credentials sont consommes directement depuis l'environnement

FAMILLES DE RISQUE CONCERNEES
- stockage des secrets
- injection et configuration
- segregation des environnements
- rotation et cycle de vie
- journalisation et exposition accidentelle

FAIBLESSES IDENTIFIEES
- [Famille : stockage des secrets] [Criticite : elevee] fichier `backend/.env` suivi dans Git - [constat probable]
- [Famille : segregation des environnements] [Criticite : moyenne] faible separation visible entre secrets dev et production - [hypothese forte]
- [Famille : rotation et cycle de vie] [Criticite : moyenne] aucune politique visible de rotation/revocation des secrets - [hypothese forte]
- [Famille : injection et configuration] [Criticite : faible] configuration dispersee entre plusieurs modules `config.py`, `session.py`, `db_raw.py` - [constat probable]

IMPACTS POTENTIELS
- confidentialite : fuite de credentials base ou `SECRET_KEY`
- integrite : usurpation de jetons ou acces non autorise a la base
- disponibilite : revocation en urgence difficile si la gouvernance est faible

RECOMMANDATIONS PRIORITAIRES
- [Priorite haute] retirer immediatement `backend/.env` du suivi Git et regenerer les secrets compromis potentiellement exposes
- [Priorite haute] introduire un `backend/.env.example` sans valeurs sensibles
- [Priorite moyenne] separer clairement secrets local/dev/test/prod
- [Priorite moyenne] centraliser la lecture de configuration sensible
- [Priorite basse] documenter rotation, revocation et ownership des secrets techniques

POINTS A VERIFIER MANUELLEMENT
- [Priorite haute] presence de secrets dans l'historique Git ou dans d'autres fichiers/scripts
- [Priorite haute] valeur et rotation reelle du `SECRET_KEY`
- [Priorite moyenne] modes de stockage des secrets en production et CI/CD
- [Priorite moyenne] contenu eventuel des logs applicatifs et sauvegardes locales

CONCLUSION
- risque principal : compromission potentielle des secrets deja presents ou deja exposes via le depot
- correction immediate recommandee : supprimer les secrets du depot et faire une rotation des credentials critiques
- action complementaire : mettre en place une hygiene simple mais stricte des secrets par environnement
