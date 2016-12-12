const http = require('http');
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

        bus.on('file', (fieldname, file, filename, encoding, mimetype) => {
            file.on('data', data => {
                req.body[fieldname] = { filename, encoding, mimetype, length: data.length, data };
            });
        });

        bus.on('field', (fieldname, value) => {
            req.body[fieldname] = value;
        });

        bus.on('finish', () => {
            app.dispatch(req, res);
        });

        request.pipe(bus);
    } else {
        app.dispatch(req, res);
    }
});

module.exports = { createApp, createServer };
