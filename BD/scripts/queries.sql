select * from users
select * from password_reset_token

UPDATE users
SET telephone = '+212767148331', 
    password_hash = '$2a$12$laSYKxwnp2sSMcpAwwJwfufj0jqa882itavWMMddellSIvSiz8lYm'
WHERE nom = 'Admin';


CREATE TABLE password_reset_token (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "tokenHash" VARCHAR NOT NULL,
    "expiresAt" BIGINT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

creation 2025-08-11 22:34:37.215002
modification 2025-08-11 22:34:37.215002