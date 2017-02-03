const http = require('http');

const Request = require('./lib/request');
const Response = require('./lib/response');
const Application = require('./lib/application');

const defaultPlugin = {
    handle: (req, res, app) => {
        const request = req.original;
        if (request.method !== 'POST') {
            app.dispatch(req, res);
        }
    }
};

const defaultParseBodyPlugin = {
    handle: (req, res, app) => {
        const request = req.original;
        if (request.method === 'POST') {
            request.on('data', chunk => req.parseBody(chunk.toString()));
            request.on('end', () => app.dispatch(req, res));
        } else {
            app.dispatch(req, res);
        }
    }
};

const createApp = () => new Application();
const createServer = (app, plugins = []) => {
    const server = http.createServer();

    if (0 === plugins.length) {
        plugins = [defaultParseBodyPlugin];
    } else {
        plugins.push(defaultPlugin);
    }

    server.on('request', (request, response) => {
        console.time('request-time');
        console.log(request.url);

        response.on('finish', () => {
            console.log(`${new Date()} - ${req.ip} - ${req.method} ${req.url} => ${res.original.statusCode} : ${res.original.statusMessage}`);
            console.timeEnd('request-time');
        });

        let req = new Request(request);
        let res = new Response(response);

        try {
            plugins.forEach(plugin => plugin.handle(req, res, app));
        } catch (e) {
            console.log(e);
        }

    });

    return server;
};

module.exports = { createApp, createServer };
