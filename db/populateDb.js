const {Client} = require('pg')

const SQL = `
    CREATE TABLE IF NOT EXISTS roles(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        role VARCHAR(100) UNIQUE
    );
    INSERT INTO roles (role)
    VALUES  ('user'),
            ('members'),
           ('admin');
    
    CREATE TABLE IF NOT EXISTS member_codes (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        code VARCHAR(255) NOT NULL DEFAULT gen_random_uuid()
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        forename VARCHAR(100),
        surname VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER NOT NULL DEFAULT 1,
        CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id)
    );

    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255),
    date Date,
    user_id INTEGER NOT NULL,
    message VARCHAR(255),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
    );
`;

require('dotenv').config();

async function main() {
    console.log('seeding ...');
    const host = process.env.HOST; // localhost in .env
    const client = new Client({
        connectionString: `postgresql://postgres:VOfGRMdWAhFhgvtJlfZxgNpRaFCRDDhX@junction.proxy.rlwy.net:59077/railway`
    })
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('all done');
}

main();