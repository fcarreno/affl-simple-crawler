const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'sql9.freemysqlhosting.net',
    user: process.env.DB_USER || 'sql9313622', // TODO: move to .env
    password: process.env.DB_PASSWORD || '6RBmF3tYPr', // TODO: move to .env
    database:  process.env.DB_DATABASE || 'sql9313622'
});
const promisedPool = pool.promise();

module.exports = promisedPool;






