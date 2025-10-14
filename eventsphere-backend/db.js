const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'eventsphere_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'eventsphere_db',
    password: process.env.DB_PASSWORD || 'test1234',
    port: process.env.DB_PORT || 5432,
});

module.exports = pool;