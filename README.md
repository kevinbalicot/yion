# YION

The most yionly (lighter, maybe ...) node framework.

## Installation

```
$ npm install --save yion
```

## Usage

Bootstrap

```javascript
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

```javascript
app.get('/article/:id', (res, res) => {
    let id = req.params.id;
});
```

#### Body

```javascript
app.post('/article', (res, res) => {
    let title = req.body.title || null;
    let content = req.body.content || null;
});
```
Note : The body parser is very simple, it parse only `x-www-form-urlencoded` data. Please see [https://www.npmjs.com/package/yion-body-parser](https://www.npmjs.com/package/yion-body-parser) for more features

#### Queries

```javascript
// GET /articles?order=title&direction=asc

app.get('/article', (res, res) => {
    let order = req.query.order || 'created_at';
    let direction = req.query.direction || 'desc';
});
```

### Middlewares

```javascript
app.use((req, res, next) => {
    // do stuff

    next();
});
```
You can pass arguments to next middleware.

```javascript
app.use((req, res, next) => {
    // do stuff

    next('foo', { foo: 'bar' });
});

app.get('/', (req, res, next, arg1, arg2) => {
    console.log(arg1); // 'foo'
    console.log(arg2); // { foo: 'bar' }

    // do stuff
});
```

### Assets

```javascript
app.link('/css', __dirname + '/styles');
app.link('/js', __dirname + '/js');
app.link('/img', __dirname + '/images');
```

### Plugins

```javascript
const { createApp, createServer } = require('yion');
const bodyparserPlugin = require('yion-body-parser');

const app = createApp();
const server = createServer(app, [bodyparserPlugin]);

app.post('/file', (req, res) => {
    if (!req.body.file) {
        return res.status(500).send();
    }

    const file = req.body.file;
    res.sendFile(file.filepath, file.filename, file.mimetype);
});

server.listen(8080);
```

If you want to create a plugin, make a simple object with a `handle` function.

There are 2 types of plugin :

Plugin handles POST/GET request, example (⚠️  type has to be `post`):
```js
const myPostPlugin = {
    type: 'post',
    handle: (req, res, app) => {
        const request = req.original; // get Node Request
        if (request.method === 'POST') {
            // make stuff
        }

        app.dispatch(req, res); // dispatch request, plugins loop stop
    }
};
```

And plugin add features into application, example :

```js
const moment = require('moment');

const myMomentPlugin = {
    type: 'whatever',
    handle: (req, res, app) => {
        req.moment = (date) => moment(date);
        // don't use app.dispatch(), because other plugins need to be launched
    }
};
```

#### Plugins :

* `yion-body-parser` : Body parser [https://www.npmjs.com/package/yion-body-parser](https://www.npmjs.com/package/yion-body-parser)
* `yion-pug` : Pug plugin (add `res.render(filename, data)`) [https://www.npmjs.com/package/yion-pug](https://www.npmjs.com/package/yion-pug)

### API Reference

#### Factories

* `createApp()` : create a new application
* `createServer(app, [])` : create a new server with an application and an array of plugins (optional)

#### Request

 * `req.has(key)` : check if there are parameter or attribute with `key`
 * `req.get(key)` : get value of parameter or attribute with `key`

#### Response

 * `res.status(code, message = null)` : change HTTP status
 * `res.set(key, value)` : set HTTP header
 * `res.write(message, encoding = 'utf-8')` : add content into HTTP response body
 * `res.send(data = null, encoding = 'utf-8')` : send response
 * `res.json(data)` : send json response
 * `res.redirect(location, code = 301)` : send redirect response
 * `res.sendFile(filepath, filename, mimetype = "text/plain", attachment = true)` : Send file
