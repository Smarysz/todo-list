const TODO = require('./todo');
const db = require('better-sqlite3')('todo.db');

db.pragma('journal_mode = WAL');

class TODODB {

    /**
     * Close connection with SQLite database
     */
    static async close() {
        return db.close();
    }

    static async testConnection() {
        try {

            const row = db.prepare('SELECT name FROM priority WHERE ID = 2').get();
            return row.name === 'Medium';

        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    /**
     * 
     * @param {boolean} newest Tasks will be ordered by newest date of them
     */
    static async getAllTasks(newest = true) {
        const sql = `SELECT task.*, priority.name AS priority_name FROM task INNER JOIN priority ON priority.ID = task.priority_id${newest ? ' ORDER BY task.deadline DESC' : ''}`;
        try {

            const rows = db.prepare(sql).all();
            return rows;

        } catch (err) {
            TODO.error(err);
            return null;
        }
    }

    /**
     * 
     * @param {number} tid Task ID in database
     * Remove specific task from database
     */
    static async removeTask(tid) {
        const sql = `DELETE FROM task WHERE ID = ${tid}`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Task has been deleted!');
            return result.changes === 1;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    /**
     * 
     * @param {number} tid Task ID in database
     * Confirm task (The task is done)
     */
    static async confirmTask(tid) {
        const sql = `UPDATE task SET done = 1 WHERE ID = ${tid}`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Task has been confirmed!');
            return result.changes === 1;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    static async uncheckTask(tid) {
        const sql = `UPDATE task SET done = 0 WHERE ID = ${tid}`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Task has been unchecked!');
            return result.changes === 1;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

}

module.exports = TODODB;