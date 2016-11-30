const http = require('http');

const Request = require('./lib/request');
const Response = require('./lib/response');
const Application = require('./lib/application');

const createApp = () => new Application();
const createServer = (app) => http.createServer((request, result) => {
    let req = new Request(request);
    let res = new Response(result);

    if (request.method === 'POST') {
        request.on('data', chunk => {
            req.parseBody(chunk.toString());
            app.dispatch(req, res);
        });
    } else {
        app.dispatch(req, res);
    }
});

module.exports = { createApp, createServer };
