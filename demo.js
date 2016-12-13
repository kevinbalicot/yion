const { createServer, createApp } = require('./index');
const fs = require('fs');

const app = createApp();
const server = createServer(app);

app.use((req, res, next) => {
    console.log(req.body);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

/**
 * Send file with fieldname "file"
 */
app.post('/', (req, res) => {
    if (!req.body.file) {
        return res.status(500).send();
    }

    res.set('Content-Type', req.body.file.mimetype);
    res.set('Content-Length', req.body.file.length);
    res.send(req.body.file.data);
});

const port = process.env.NODE_PORT || 8080;
server.listen(port);
console.log(`🌏  Server start on port ${port}`);
