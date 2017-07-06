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

You can use regexp like this

```javascript
app.get('/article/:id([0-9]{2})', (res, res) => {
    let id = req.params.id;
});
```

And of course both

```javascript
app.get('/article/:id([0-9]{2})/:name', (res, res) => {
    let id = req.params.id;
    let name = req.params.name;
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

Every thing is a middleware

```js
app.get('/', (req, res, next) => {
    next({ foo: 'bar' });
});

app.get('/', (req, res, next, foo) => {
    res.send(foo); // 'bar'
});
```

### Assets

```javascript
app.link('/css', __dirname + '/styles');
app.link('/js', __dirname + '/js');
app.link('/img', __dirname + '/images');
```

Now you can type into HTML file

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="/css/main.css">
        <script type="text/javascript" src="/js/main.js"></script>
    </head>
</html>
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
    handle: (req, res, app, next) => {
        app.moment = (date) => moment(date);

        next(); // use next callback to call next plugin

        // don't use app.dispatch(), because other plugins need to be launched
    }
};
```

And into your Yion application

```js
app.get('/what-time-is-it', (req, res, app) => {
    res.send(app.moment().format());
});
```

#### Plugins :

* `yion-body-parser` : Body parser [https://www.npmjs.com/package/yion-body-parser](https://www.npmjs.com/package/yion-body-parser)
* `yion-pug` : Pug plugin (add `res.render(filename, data)`) [https://www.npmjs.com/package/yion-pug](https://www.npmjs.com/package/yion-pug)
* `yion-oauth` : Oauth2 plugin [https://www.npmjs.com/package/yion-oauth](https://www.npmjs.com/package/yion-oauth)

### Documentations and API Reference

You can see documentations [here](https://github.com/kevinbalicot/yion/blob/master/docs/documentations.md). Full API reference [here](https://kevinbalicot.github.io/yion/#api). Also see [yion websie](https://kevinbalicot.github.io/yion/)

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
 * `res.json(data, encoding = 'utf-8')` : send json response
 * `res.redirect(location, code = 301)` : send redirect response
 * `res.sendFile(filepath, filename, mimetype = "text/plain", attachment = true)` : Send file
