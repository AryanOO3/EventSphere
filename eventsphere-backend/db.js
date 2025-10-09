const { Pool } = require('pg');

const pool = new Pool({
    user: 'eventsphere_user',
    host: 'localhost',
    database: 'eventsphere_db',
    password: 'test1234',
    port: 5432,
});

module.exports = pool;