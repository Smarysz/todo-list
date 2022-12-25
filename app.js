const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const TODO = require('./lib/todo');
const TODODB = require('./lib/tododb');

(async function () {

    try {

        const config = JSON.parse(await fs.promises.readFile('config.json', { encoding: "utf8" }));

        const db = new TODODB({
            dbHost: config.dbHost,
            dbUser: config.dbUser,
            dbPassword: config.dbPassword,
            dbName: config.dbName,
            dbPort: config.dbPort,
            dbTimeout: config.dbTimeout
        });

        const isCorrect = await db.testConnection();

        if (!isCorrect) {
            TODO.error('Database error!');
            return;
        }

        const app = express();

        app.set('view engine', 'ejs');
        app.set('views', './views');

        app.use(express.static('./static'));

        app.get('/', function (req, res) {
            res.render('index');
        });

        app.use(function (req, res) {
            res.status(404);
            res.render('404');
        });

        app.listen(config.appPort, '127.0.0.1', function () {

            const appURL = 'http://127.0.0.1:' + config.appPort + '/';

            TODO.success('Application runs on ' + appURL);

            exec('start http://127.0.0.1:' + config.appPort, function (error) {
                if (error) {
                    TODO.error('Can not open application in browser! Paste this url in address bar: ' + appURL);
                }
            });
        });

    } catch (err) {
        TODO.error(err);
    }

})();