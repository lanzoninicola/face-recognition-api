module.exports = knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST || '127.0.0.1',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PWD || 'Telemaco1',
        database: process.env.PG_DB || 'face_recognition'
    }
});