const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');

const Request = require('./lib/request');
const Response = require('./lib/response');
const Application = require('./lib/application');

const createApp = () => new Application();
const createServer = (app) => http.createServer((request, result) => {
    let req = new Request(request);
    let res = new Response(result);

    if (request.method === 'POST') {
        const bus = new Busboy({ headers: request.headers });
        const tmpFiles = [];

        bus.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const saveTo = path.join(os.tmpdir(), path.basename(fieldname));
            let fileAlreadyExists = tmpFiles.find(file => saveTo === saveTo);
            if (!fileAlreadyExists) {
                tmpFiles.push(saveTo);
            }
            file.pipe(fs.createWriteStream(saveTo));
            file.on('data', data => {
                req.body[fieldname] = { filename, encoding, mimetype, filepath: saveTo, length: data.length, data };
            });
        });

        bus.on('field', (fieldname, value) => {
            req.body[fieldname] = value;
        });

        bus.on('finish', () => {
            app.dispatch(req, res);
            tmpFiles.forEach(file => fs.unlink(file));
        });

        request.pipe(bus);
    } else {
        app.dispatch(req, res);
    }
});

module.exports = { createApp, createServer };
