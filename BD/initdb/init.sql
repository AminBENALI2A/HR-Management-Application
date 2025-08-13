
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