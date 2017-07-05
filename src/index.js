const http = require('http');

const Request = require('./request');
const Response = require('./response');
const Application = require('./application');

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
};

const pluginsComposer = (plugins, req, res, app) => {
    let next = defaultPlugin.handle.bind(defaultPlugin, req, res, app);
    plugins = plugins.slice();

    for (let i = 0; i < plugins.length; i++) {
        if (plugins[i].type === 'post') {
            next = plugins[i].handle.bind(plugins[i], req, res, app);
            plugins.splice(i, 1);
        }
    }

    let i = plugins.length;
    while (i--) {
        next = plugins[i].handle.bind(plugins[i], req, res, app, next);
    }

    return next;
};

/**
 * Yion module
 * @module yion
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
 *
 * @alias module:yion
 */
const createApp = () => new Application();

/**
 * @param {Application} app
 * @param {Array} [plugins=[]]
 *
 * @return {HttpServer}
 *
 * @alias module:yion
 */
const createServer = (app, plugins = []) => {
    const server = http.createServer();

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
            pluginsComposer(plugins, req, res, app)();
        } catch (error) {
            res.status(500).send(`${error.name} : ${error.message} \n ${error.stack}`);
        }
    });

    return server;
};

module.exports = { createApp, createServer };
