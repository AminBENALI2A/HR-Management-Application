select * from users
select * from password_reset_token

ALTER TABLE users
ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;


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

creation 2025-08-11 22:34:37.215002
modification 2025-08-11 22:34:37.215002