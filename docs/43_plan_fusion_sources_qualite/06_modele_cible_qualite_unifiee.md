# Modèle Cible (PROPOSITION DDL STRICTEMENT READ-ONLY)

Voici le schéma cible proposé pour la fusion, unifiant toutes les mesures qualité de l'eau.

```sql
CREATE TABLE qualite.mesure_qualite_unifiee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table VARCHAR(100) NOT NULL, -- ex: 'mesure_qualite_sebou', 'mesure_qualite_riviere'
    source_system VARCHAR(100),
    support_type VARCHAR(50) NOT NULL, -- 'SENTINELLE', 'RIVIERE', 'BARRAGE_GARDE', 'BARRAGE'
    
    station_id UUID, -- FK vers infra.stations_mesure
    ire_station VARCHAR(50),
    code_station VARCHAR(50),
    station_nom VARCHAR(100),
    
    date_mesure TIMESTAMP NOT NULL,
    
    parametre_code VARCHAR(50) NOT NULL,
    parametre_nom VARCHAR(100),
    
    valeur DOUBLE PRECISION,
    unite VARCHAR(20),
    
    classe_qualite VARCHAR(50),
    qualite_flag VARCHAR(50),
    mapping_status VARCHAR(50) DEFAULT 'MAPPED',
    
    source_row_hash VARCHAR(255) NOT NULL UNIQUE, -- SHA256(ire_station + date_mesure + parametre_code + valeur)
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Index recommandés
CREATE INDEX idx_mesure_qualite_unifiee_support ON qualite.mesure_qualite_unifiee(support_type);
CREATE INDEX idx_mesure_qualite_unifiee_station ON qualite.mesure_qualite_unifiee(ire_station, station_id);
CREATE INDEX idx_mesure_qualite_unifiee_date ON qualite.mesure_qualite_unifiee(date_mesure DESC);
CREATE INDEX idx_mesure_qualite_unifiee_param ON qualite.mesure_qualite_unifiee(parametre_code);
```
