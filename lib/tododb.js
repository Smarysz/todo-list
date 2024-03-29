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
    static async deleteTask(tid) {
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

    static async addTask({ title, deadline, priority, description }) {
        const sql = `INSERT INTO task (title, deadline, done, priority_id, description) VALUES('${title}', '${deadline || 'NULL'}', 0, ${priority || 1}, '${description}')`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Task has been added!');
            return result;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    static async updateTask({ tid, title, deadline, priority, description }) {
        const sql = `UPDATE task SET title = '${title}', deadline = '${deadline}', priority_id = ${priority}, description = '${description}' WHERE ID = ${tid}`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Task has been updated!');
            return result;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    static async getAllNotes() {
        const sql = 'SELECT * FROM note';
        try {

            const rows = db.prepare(sql).all();
            return rows;

        } catch (err) {
            TODO.error(err);
            return null;
        }
    }

    static async addNote({ name, description }) {
        const sql = `INSERT INTO note VALUES (NULL, '${name}', '${description}')`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Note has been added!');
            return result;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    static async deleteNote(nid) {
        const sql = `DELETE FROM note WHERE ID = ${nid}`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Note has been deleted!');
            return result.changes === 1;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

    static async updateNote({ nid, title, content }) {
        const sql = `UPDATE note SET title = '${title}', content = '${content}' WHERE ID = ${nid}`;
        try {
            const result = db.prepare(sql).run();
            if (result.changes === 1) TODO.info('Note has been updated!');
            return result;
        } catch (err) {
            TODO.error(err);
            return false;
        }
    }

}

module.exports = TODODB;