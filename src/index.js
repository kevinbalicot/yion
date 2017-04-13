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

/**
 * Yion module
 * @module yion
 */

/**
 * @return {Application}
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

    if (!plugins.find(plugin => plugin.type === 'post')) {
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
            plugins.forEach(plugin => {
                if (!req.dispatching) {
                    plugin.handle(req, res, app);
                }
            });
        } catch (error) {
            res.status(500).send(`${error.name} : ${error.message} \n ${error.stack}`);
        }
    });

    return server;
};

module.exports = { createApp, createServer };