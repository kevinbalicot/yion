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

    const file = req.body.file;
    res.sendFile(file.filepath, file.filename, file.mimetype);
});

const port = process.env.NODE_PORT || 8080;
server.listen(port);
console.log(`🌏  Server start on port ${port}`);
