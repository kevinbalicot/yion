const { createServer, createApp } = require('./index');
const bodyparser = require('yion-body-parser');

const plugins = [bodyparser];
const app = createApp();
const server = createServer(app);

app.use((req, res, next) => {
    console.log(req.body);

    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 1000);
    }).then(() => next());
});

app.get('/', (req, res, next) => {
    next({ message: 'Hello world!' });
});

app.get('/', (req, res, next, message) => {
    res.json(message);
});

app.post('/', (req, res) => {
    res.json(req.body);
});

/**
 * Send file with fieldname "file"
 * If you want to test the send file feature, please install yion-bodyparser plugin
 */
app.post('/file', (req, res) => {
    if (!req.body.file) {
        return res.status(500).send();
    }

    const file = req.body.file;
    res.sendFile(file.filepath, file.filename, file.mimetype);
});

const port = process.env.NODE_PORT || 8080;
server.listen(port);
console.log(`🌏  Server start on port ${port}`);
