const mysql2 = require('mysql2');
const todo = require('./todo');

class TODODB {

    #dbPassword = null;

    /**
     * 
     * @param {object} params DB connection parameters
     */
    constructor({ dbHost, dbUser, dbPassword, dbName, dbPort = 3306, dbTimeout = 5000 }) {
        this.dbHost = dbHost;
        this.dbUser = dbUser;
        this.#dbPassword = dbPassword;
        this.dbName = dbName;
        this.dbPort = dbPort || 3306;
        this.pool = mysql2.createPool({ host: this.dbHost, user: this.dbUser, password: this.#dbPassword, database: this.dbName, connectTimeout: dbTimeout });
        this.promisePool = this.pool.promise();
    }

    async testConnection() {
        try {

            const [result] = await this.promisePool.query('SELECT name FROM priority WHERE ID = 2');

            return result[0].name === 'Medium';

        } catch (err) {
            todo.error(err);
            return false;
        }
    }
}

module.exports = TODODB;