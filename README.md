# YION

The most yionly node framework.

## Installation

```
$ npm install --save yion
```

## Demo

```
$ npm start
```

## Usage

Bootstrap

```node
const { createApp, createServer } = require('yion');

const app = createApp();
const server = createServer(app);

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8').send('Hello world!');
});

server.listen(8080);
```

### Router
 * `app.get(pattern, callback);`
 * `app.post(pattern, callback);`
 * `app.put(pattern, callback);`
 * `app.delete(pattern, callback);`
 * `app.patch(pattern, callback);`

#### Parameters

```node
app.get('/article/:id', (res, res) => {
    let id = req.params.id;
});
```

#### Body

```node
app.post('/article', (res, res) => {
    let title = req.body.title || null;
    let content = req.body.content || null;
});
```

#### Queries

```node
// GET /articles?order=title&direction=asc

app.get('/article', (res, res) => {
    let order = req.query.order || 'created_at';
    let direction = req.query.direction || 'desc';
});
```

### Middlewares

```node
app.use((req, res, next) => {
    // do stuff

    next();
});
```

### Assets

```node
app.link('/css', __dirname + '/styles');
app.link('/js', __dirname + '/js');
app.link('/img', __dirname + '/images');
```

### API Reference

#### Response

 * `res.status(code, message = null)` : change HTTP status
 * `res.set(key, value)` : set HTTP header
 * `res.write(message, encoding = 'utf-8')` : add content into HTTP response body
 * `res.send(data = null, encoding = 'utf-8')` : send response
 * `res.json(data)` : send json response
 * `res.redirect(location, code = 301)` : send redirect response
 * `res.sendFile(filepath, filename, mimetype = "text/plain", attachment = true)` : Send file
