# Limites MNT

## Limites détectées
- Le raster principal est un Arc/Info Binary Grid et doit rester accompagné de ses dossiers/fichiers `info` et `seboureproj`.
- Le CRS est lu comme UTM zone 30N basé WGS84, mais le nom PROJCRS est `unnamed`; la chaîne opérationnelle doit verrouiller le CRS cible.
- Le réseau runtime est en SRID 26191, le MNT en UTM zone 30N : tout échantillonnage doit transformer explicitement les coordonnées.
- Le MNT a une résolution d'environ 27.49 m : insuffisant pour corriger automatiquement des micro-segments ou ouvrages locaux.
- Les altitudes négatives minimes (-22 m) sont plausibles en bordure basse mais doivent être surveillées dans les contrôles extrêmes.

## Risques
| Risque | Impact | Mitigation |
|---|---|---|
| CRS mal déclaré | Sampling faux | Verrouiller EPSG/WKT dans script QA |
| Usage `.ovr` seul | Altitudes/géoréférencement invalides | Utiliser uniquement `seboureproj` |
| Pente faible | Faux suspect | Tolérance et revue manuelle |
| Ouvrages hydrauliques | Signal MNT ambigu | Croiser stations/barrages/réseau métier |

## Conclusion
Le MNT est exploitable pour QA scientifique, mais pas pour correction automatique. La validation doit rester auditée et réversible.
