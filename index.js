const http = require('http');

const Request = require('./lib/request');
const Response = require('./lib/response');
const Application = require('./lib/application');

const defaultPlugin = {
    handle: (req, res, app) => {
        const request = req.original;

        if (request.method === 'POST') {
            request.on('data', chunk => req.parseBody(chunk.toString()));
            request.on('end', () => app.dispatch(req, res));
        } else {
            app.dispatch(req, res);
        }
    }
}

const createApp = () => new Application();
const createServer = (app, plugins = []) => http.createServer((request, result) => {
    console.time('request-time');

    result.on('finish', () => {
        if (!res.matched && !res.end) res.status(404, 'Not found').send('Not found');
        console.log(`${new Date()} - ${req.ip} - ${req.method} ${req.url} => ${res.original.statusCode} : ${res.original.statusMessage}`);
        console.timeEnd('request-time');
    });

    let req = new Request(request);
    let res = new Response(result);

    if (0 === plugins.length) {
        plugins = [defaultPlugin];
    }

    plugins.forEach(plugin => plugin.handle(req, res, app));
});

module.exports = { createApp, createServer };
