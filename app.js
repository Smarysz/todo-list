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
            const data = await TODODB.getAllTasks();
            res.renderID('tasks', { data, TODO });
        });

        app.get('/notes', function (req, res) {
            res.renderID('notes');
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
            const removed = await TODODB.removeTask(tid);
            if (removed) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.post('/task/confirm/:tid', async function (req, res) {
            const tid = req.params.tid;
            const confirmed = await TODODB.confirmTask(tid);
            if (confirmed) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.post('/task/uncheck/:tid', async function (req, res) {
            const tid = req.params.tid;
            const unchecked = await TODODB.uncheckTask(tid);
            if (unchecked) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
            res.end();
        });

        app.post('/task/add', async function (req, res) {
            const added = await TODODB.addTask(req.body);
            if (added) {
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