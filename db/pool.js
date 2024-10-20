const {Pool} = require('pg');
require('dotenv').config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Erforderlich für sichere Verbindungen bei Railway
    }
});

module.exports = pgPool;