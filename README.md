# YION

The most yionly (lighter, maybe ...) node framework.

## Installation

```
$ npm install --save yion
```

## Usage

Get started with Yion

```javascript
const { createApp, createServer } = require('yion')

const app = createApp()
const server = createServer(app)

app.get('/', ({ req, res }) => {
  res.set('Content-Type', 'text/html; charset=utf-8').send('Hello world!');
});

server.listen(8080).on('listening', () => {
  console.log('Server is running on port 8080')
})
```

### Router

 * `app.get(pattern, ...callback);`
 * `app.post(pattern, ...callback);`
 * `app.put(pattern, ...callback);`
 * `app.delete(pattern, ...callback);`
 * `app.patch(pattern, ...callback);`

#### Parameters

```javascript
app.get('/article/:id', ({ res, res }) => {
  let id = req.params.id
})
```

You can use regexp like this

```javascript
app.get('/article/:id([0-9]{2})', ({ res, res }) => {
  let id = req.params.id
})
```

And of course both

```javascript
app.get('/article/:id([0-9]{2})/:name', ({ res, res }) => {
  let id = req.params.id
  let name = req.params.name
})
```

#### Body

```javascript
const parseBody = require('yion/middlewares/parse-body')

app.post('/article', parseBody, ({ res, res }) => {
  let title = req.body.title || null
  let content = req.body.content || null
})
```
Note : The body parser is very simple, it parse only `x-www-form-urlencoded` and JSON data. Please see `bodyParser` plugin for more features

#### Queries

```javascript
// GET /articles?order=title&direction=asc

app.get('/article', ({ res, res }) => {
  let order = req.query.order || 'created_at'
  let direction = req.query.direction || 'desc'
})
```

### Middlewares

```javascript
app.use(({ req, res }, next) => {
  // do stuff

  next()
})
```
You can pass arguments to next middleware.

```javascript
app.use(({ req, res }, next) => {
  // do stuff
    
  next('foo', { foo: 'bar' })
})

app.get('/', ({ req, res }, next, arg1, arg2) => {
  console.log(arg1) // 'foo'
  console.log(arg2) // { foo: 'bar' }

  // do stuff
})
```

Every thing is a middleware

```js
app.get('/', ({ req, res }, next) => {
  next({ foo: 'bar' })
})

app.get('/', ({ req, res }, next, foo) => {
  res.send(foo) // 'bar'
})
```

And you can compose middlewares into middleware

```javascript
app.get(
  '/admin',
  ({ req, res }, next) => {
    const session = getSession(req)

    next(session)
  },
  ({ req, res }, next, session) => {
    res.send(`Hello ${session.username}!`)
  }
)
```

### Assets

```javascript
app.link('/css', __dirname + '/styles')
app.link('/js', __dirname + '/js')
app.link('/img', __dirname + '/images')
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

You can add header at response

```javascript
const cache = { 'Cache-Control': 'public, max-age=600' }

app.link('/css', __dirname + '/styles') // no cache
app.link('/js', __dirname + '/js', cache) // add cache control
app.link('/img', __dirname + '/images', cache) // add cache control
```

### Plugins

Example with `body-parser` plugin [https://github.com/boutdecode/body-parser](https://github.com/boutdecode/body-parser)

```javascript
const { createApp, createServer } = require('yion')
const bodyParser = require('@boutdecode/body-parser')

const app = createApp()
const server = createServer(app)

use(bodyParser())

app.post('/file', ({ req, res }) => {
  if (!req.body.file) {
    return res.status(500).send()
  }

  const file = req.body.file
  res.sendFile(file.filepath, file.filename, file.mimetype)
})

server.listen(8080)
```

If you want to create a plugin, make a function to return a function.

```javascript
const myPostPlugin = () => (context, next) => {
  const {req, res, app} = context

  // make stuff

  next()
}
```

And plugin add features into application, example :

```javascript
const moment = require('moment')

const myMomentPlugin = (momentFormat) => (context, next) => {
  context.set('moment', (date) => moment(date, momentFormat))

  next(); // use next callback to call next plugin
}
```

And into your Yion application

```javascript
app.use(myMomentPlugin('YYYY-MM-DD'))

app.get('/what-time-is-it', ({ moment }) => {
  res.send(moment().format())
})
```

#### Plugins :

* `body parser` : [Body parser plugin](https://github.com/boutdecode/body-parser)
* `logger` : [Logger plugin](https://github.com/boutdecode/logger)
* `encoding` : [Encoding plugin](https://github.com/boutdecode/encoding)
* `session` : [Session plugin](https://github.com/boutdecode/session)
* `open api` : [Open API plugin](https://github.com/boutdecode/open-api)

### Documentations and API Reference

You can see documentations [here](https://github.com/kevinbalicot/yion/blob/master/docs/documentations.md). Full API reference [here](https://kevinbalicot.github.io/yion/#api). Also see [yion websie](https://kevinbalicot.github.io/yion/)
