const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const ejs = require('ejs');

const todo = require('./lib/todo');

fs.readFile('config.json', function (err, data) {
    if (err) {
        todo.err(err);
    } else {

        const config = JSON.parse(data.toString());
        const app = express();

        app.set('view engine', 'ejs');
        app.set('views', './views');

        app.use(express.static('./static'));

        app.get('/', function (req, res) {
            res.render('index', {});
        });

        const server = app.listen(config.port, function () {

            const appURL = 'http://127.0.0.1:' + config.port + '/';

            todo.info('Application runs on ' + appURL);

            exec('start http://127.0.0.1:' + config.port, function (error, stdout, stderr) {
                if (error) {
                    todo.error('Can not open application in browser! Paste this url in address bar: ' + appURL);
                }
            });
        });
    }
});