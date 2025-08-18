
-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('Super Admin', 'Gestionnaire', 'Ressource')),
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password_hash TEXT NOT NULL
);

ALTER TABLE users
ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;


-- Create the trigger function to update date_modification
CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that calls the function before update on users table
CREATE TRIGGER trg_update_date_modification
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_date_modification();



INSERT INTO users (nom, prenom, email, telephone, role, password_hash)
VALUES (
  'Admin',
  'Super',
  'aminebenaliroo@gmail.com',
  '+212767148331',
  'Super Admin',
  '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm' --admin123
);



select * from users
select * from password_reset_token




UPDATE users
SET telephone = '+212767148331', 
    password_hash = '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm'
WHERE nom = 'Admin';


INSERT INTO users (nom, prenom, email, telephone, role, password_hash)
VALUES 
  ('Benali', 'Amine', 'amine.benali@example.com', '+212600000001', 'Ressource', '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm'),
  ('Hassan', 'Ali', 'ali.hassan@example.com', '+212600000002', 'Gestionnaire', '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm'),
  ('Fatima', 'Zahra', 'fatima.zahra@example.com', '+212600000003', 'Ressource', '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm'),
  ('Mohamed', 'Youssef', 'mohamed.youssef@example.com', '+212600000004', 'Gestionnaire', '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm'),
  ('Sofia', 'El Amrani', 'sofia.elamrani@example.com', '+212600000005', 'Ressource', '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm');


CREATE TABLE password_reset_token (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "tokenHash" VARCHAR NOT NULL,
    "expiresAt" BIGINT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


///////////////////////////////////////////////////////////////////////// Partenaire




-- Script de création de la table Partenaires
CREATE TABLE partenaires (
    -- ID auto-incrémenté (clé primaire)
    id SERIAL PRIMARY KEY,
    
    -- Nom de la compagnie (obligatoire)
    nom_compagnie VARCHAR(255) NOT NULL,
    
    -- RCS (SIREN/SIRET) (obligatoire)
    rcs VARCHAR(50) NOT NULL,
    
    -- Numéro TVA (obligatoire)
    numero_tva VARCHAR(50) NOT NULL,
    
    -- Contacts sous forme JSON (obligatoire - au moins un contact)
    contacts JSONB NOT NULL,
    
    -- Activités sous forme JSON (obligatoire - au moins une activité)
    activites JSONB NOT NULL,
    
    -- Adresse (optionnelle)
    adresse TEXT,
    
    -- Dates gérées automatiquement par le système
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes pour vérifier qu'il y a au moins un contact et une activité
    CONSTRAINT check_au_moins_un_contact CHECK (jsonb_array_length(contacts) > 0),
    CONSTRAINT check_au_moins_une_activite CHECK (jsonb_array_length(activites) > 0)
);


ALTER TABLE partenaires
ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;


-- Trigger pour mettre à jour automatiquement date_modification
CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_date_modification
    BEFORE UPDATE ON partenaires
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

-- Index pour améliorer les performances
CREATE INDEX idx_partenaires_nom_compagnie ON partenaires(nom_compagnie);
CREATE INDEX idx_partenaires_rcs ON partenaires(rcs);
CREATE INDEX idx_partenaires_contacts ON partenaires USING GIN(contacts);
CREATE INDEX idx_partenaires_activites ON partenaires USING GIN(activites);

-- Commentaires sur la table
COMMENT ON TABLE partenaires IS 'Table des partenaires avec contacts et activités en JSONB';
COMMENT ON COLUMN partenaires.id IS 'Identifiant unique auto-incrémenté';
COMMENT ON COLUMN partenaires.nom_compagnie IS 'Nom de la compagnie (obligatoire)';
COMMENT ON COLUMN partenaires.rcs IS 'Numéro RCS/SIREN/SIRET (obligatoire)';
COMMENT ON COLUMN partenaires.numero_tva IS 'Numéro de TVA (obligatoire)';
COMMENT ON COLUMN partenaires.contacts IS 'Liste des contacts en JSONB: [{nom, prenom, email, tel, role, direction, departement}, ...]';
COMMENT ON COLUMN partenaires.activites IS 'Liste des activités en JSONB: ["Banque", "Assurance", ...]';
COMMENT ON COLUMN partenaires.adresse IS 'Adresse du partenaire (optionnelle)';
COMMENT ON COLUMN partenaires.date_creation IS 'Date de création automatique';
COMMENT ON COLUMN partenaires.date_modification IS 'Date de dernière modification automatique';

-- Exemple d'insertion
/*
INSERT INTO partenaires (nom_compagnie, rcs, numero_tva, contacts, activites, adresse) 
VALUES (
    'Ma Compagnie SA',
    'RCS123456789',
    'FR12345678901',
    '[
        {
            "nom": "Dupont",
            "prenom": "Jean",
            "email": "jean.dupont@company.com",
            "tel": "+33123456789",
            "role": "Directeur",
            "direction": "Commercial",
            "departement": "Ventes"
        }
    ]'::jsonb,
    '["Banque", "Assurance"]'::jsonb,
    '123 Rue de la Paix, 75001 Paris'
);
*/

UPDATE partenaires
SET contacts = '[
    {
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@company.com",
        "telephone": "+33123456789",
        "role": "Directeur",
        "direction": "Commercial",
        "departement": "Ventes"
    }
]'::jsonb
WHERE nom_compagnie = 'Ma Compagnie SA';


select * from partenaires


ALTER TABLE partenaires 
ADD COLUMN siren VARCHAR(9);

UPDATE partenaires 
SET siren = REGEXP_REPLACE(rcs, '[^0-9]', '', 'g');

ALTER TABLE partenaires
ALTER COLUMN siren SET NOT NULL,
ADD CONSTRAINT partenaires_siren_unique UNIQUE (siren);

SELECT rcs, siren FROM partenaires;

ALTER TABLE partenaires DROP COLUMN rcs;
