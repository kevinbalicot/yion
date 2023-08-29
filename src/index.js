const http = require('http');
const { Server } = require('http');

const wrapRequest = require('./request');
const wrapResponse = require('./response');
const Application = require('./application');

const defaultPlugin = {
    handle: (req, res, app) => {
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                req.parseBody(body);
                app.dispatch(req, res);
            });
        } else {
            app.dispatch(req, res);
        }
    }
};

const pluginsComposer = (plugins, req, res, app) => {
    let next = defaultPlugin.handle.bind(defaultPlugin, req, res, app);
    plugins = plugins.slice();

    let i = plugins.length;
    while (i--) {
        next = plugins[i].handle.bind(plugins[i], req, res, app, next);
    }

    return next;
};

/**
 * Yion module
 *
 * @example
 * const { createApp, createServer } = require('yion');
 *
 * const app = createApp();
 * const server = createServer(app);
 *
 * app.get('/', (req, res) => {
 *    res.set('Content-Type', 'text/html; charset=utf-8').send('Hello world!');
 * });
 *
 * server.listen(8080);
 */

/**
 * @return {Application}
 */
const createApp = () => new Application();

/**
 * @param {Application} app
 * @param {array} [plugins=[]]
 *
 * @return {Server}
 */
const createServer = (app, plugins = []) => {
    const server = http.createServer();

    server.on('request', (request, response) => {
        const req = wrapRequest(request);
        const res = wrapResponse(response);
        const startTime = performance.now();

        res.on('finish', () => {
            const endTime = performance.now();
            console.log(`${new Date()} - ${req.ip} - ${req.method} ${req.uri} => ${res.statusCode} : ${res.statusMessage} ${(endTime - startTime).toFixed(2)}ms`);
        });

        try {
            pluginsComposer(plugins, req, res, app)();
        } catch (error) {
            res.status(500).send(`${error.name} : ${error.message} \n ${error.stack}`);
        }
    });

    return server;
};

module.exports = { createApp, createServer };
