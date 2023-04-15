const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const bodyParser = require('body-parser');
const TODO = require('./lib/todo');
const TODODB = require('./lib/tododb');

(async function () {

    try {

        const config = JSON.parse(await fs.promises.readFile('config.json', { encoding: "utf8" }));
        config.appPort = config.appPort || 41114;

        if (!TODODB.testConnection()) {
            TODO.error('Database error!');
            exec('pause');
            return;
        }

        const app = express();

        app.set('view engine', 'ejs');
        app.set('views', './views');

        app.use(express.static('./static'));

        app.use(bodyParser.json());

        // Own render function which render a view with model containing page ID
        app.response.renderID = function (view, model = {}) {
            view = String(view);
            model.pageID = view;
            return this.render(view, model);
        };

        app.get('/', function (req, res) {
            res.renderID('index');
        });

        app.get('/tasks', async function (req, res) {
            const tasksData = await TODODB.getAllTasks();
            res.renderID('tasks', { tasksData, TODO });
        });

        app.get('/notes', async function (req, res) {
            const notesData = await TODODB.getAllNotes();
            res.renderID('notes', { notesData });
        });

        app.get('/exit', function (req, res) {
            res.renderID('exit');
        });

        app.post('/exit', async function () {
            await TODODB.close();
            process.exit();
        });

        app.delete('/task/:tid', async function (req, res) {
            const tid = req.params.tid;
            const removed = await TODODB.deleteTask(tid);
            if (removed) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.put('/task/confirm/:tid', async function (req, res) {
            const tid = req.params.tid;
            const confirmed = await TODODB.confirmTask(tid);
            if (confirmed) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.put('/task/uncheck/:tid', async function (req, res) {
            const tid = req.params.tid;
            const unchecked = await TODODB.uncheckTask(tid);
            if (unchecked) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.post('/task', async function (req, res) {
            const added = await TODODB.addTask(req.body);
            if (added.changes === 1) {
                res.json({ status: true, tid: added.lastInsertRowid });
            } else {
                res.json({ status: false });
            }
        });

        app.put('/task/:tid', async function (req, res) {
            const updated = await TODODB.updateTask(req.body);
            if (updated.changes === 1) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        });

        app.post('/note', async function (req, res) {
            const added = await TODODB.addNote(req.body);
            if (added.changes === 1) {
                res.json({ status: true, nid: added.lastInsertRowid });
            } else {
                res.json({ status: false });
            }
        });

        app.delete('/note/:nid', async function (req, res) {
            const nid = req.params.nid;
            const removed = await TODODB.deleteNote(nid);
            if (removed) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.put('/note/:nid', async function (req, res) {
            const updated = await TODODB.updateNote(req.body);
            if (updated.changes === 1) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        });

        app.use(function (req, res) {
            res.status(404);
            res.render('404');
        });

        app.listen(config.appPort, '127.0.0.1', function () {

            const appURL = 'http://127.0.0.1:' + config.appPort + '/';

            TODO.success('Application runs on ' + appURL);

            exec('start http://127.0.0.1:' + config.appPort + '/tasks', function (error) {
                if (error) {
                    TODO.error('Can not open application in browser! Paste this url in address bar: ' + appURL);
                }
            });
        });

    } catch (err) {
        TODO.error(err);
        exec('pause');
    }

})();