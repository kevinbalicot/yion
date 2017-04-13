## Modules

<dl>
<dt><a href="#module_Application">Application</a></dt>
<dd><p>Core module of yion</p>
</dd>
<dt><a href="#module_Compose">Compose</a></dt>
<dd><p>Queue handler for middlewares</p>
</dd>
<dt><a href="#module_yion">yion</a></dt>
<dd><p>Yion module</p>
</dd>
<dt><a href="#module_Link">Link</a></dt>
<dd><p>Link module</p>
</dd>
<dt><a href="#module_Middleware">Middleware</a></dt>
<dd><p>Middleware module</p>
</dd>
<dt><a href="#module_Request">Request</a></dt>
<dd><p>Request module</p>
</dd>
<dt><a href="#module_Response">Response</a></dt>
<dd><p>Response module</p>
</dd>
<dt><a href="#module_Route">Route</a></dt>
<dd><p>Route module</p>
</dd>
</dl>

<a name="module_Application"></a>

## Application
Core module of yion

**Example**  
```js
const { createApp } = require('yion');

const app = createApp();
app.get('/home', (req, res) => res.send('hello world'));
```

* [Application](#module_Application)
    * [Application#use(callback)](#exp_module_Application--Application+use) ⇒ <code>Application</code> ⏏
    * [Application#link(pattern, target)](#exp_module_Application--Application+link) ⇒ <code>Application</code> ⏏
    * [Application#get(pattern, callback)](#exp_module_Application--Application+get) ⇒ <code>Application</code> ⏏
    * [Application#post(pattern, callback)](#exp_module_Application--Application+post) ⇒ <code>Application</code> ⏏
    * [Application#delete(pattern, callback)](#exp_module_Application--Application+delete) ⇒ <code>Application</code> ⏏
    * [Application#put(pattern, callback)](#exp_module_Application--Application+put) ⇒ <code>Application</code> ⏏
    * [Application#patch(pattern, callback)](#exp_module_Application--Application+patch) ⇒ <code>Application</code> ⏏
    * [Application#dispatch(req, res)](#exp_module_Application--Application+dispatch) ⏏

<a name="exp_module_Application--Application+use"></a>

### Application#use(callback) ⇒ <code>Application</code> ⏏
Add middleware

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| callback | <code>Callable</code> | 

<a name="exp_module_Application--Application+link"></a>

### Application#link(pattern, target) ⇒ <code>Application</code> ⏏
Add link middleware (usefull for asset, like js and css files)

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | what you use into html file (into link or script tags) |
| target | <code>string</code> | filepath where there are files |

<a name="exp_module_Application--Application+get"></a>

### Application#get(pattern, callback) ⇒ <code>Application</code> ⏏
Add GET listener middleware

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| callback | <code>Callback</code> |  |

<a name="exp_module_Application--Application+post"></a>

### Application#post(pattern, callback) ⇒ <code>Application</code> ⏏
Add POST listener middleware

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| callback | <code>Callback</code> |  |

<a name="exp_module_Application--Application+delete"></a>

### Application#delete(pattern, callback) ⇒ <code>Application</code> ⏏
Add DELETE listener middleware

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| callback | <code>Callback</code> |  |

<a name="exp_module_Application--Application+put"></a>

### Application#put(pattern, callback) ⇒ <code>Application</code> ⏏
Add PUT listener middleware

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| callback | <code>Callback</code> |  |

<a name="exp_module_Application--Application+patch"></a>

### Application#patch(pattern, callback) ⇒ <code>Application</code> ⏏
Add PATCH listener middleware

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| callback | <code>Callback</code> |  |

<a name="exp_module_Application--Application+dispatch"></a>

### Application#dispatch(req, res) ⏏
Dispatch a request to middlewares queue

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 

<a name="module_Compose"></a>

## Compose
Queue handler for middlewares

**Example**  
```js
const compose = require('./compose');

const middlewares = [() => {}, ...];

compose(req, res, middlewares)();
```
<a name="exp_module_Compose--module.exports"></a>

### module.exports(req, res, middlewares) ⇒ <code>Callable</code> ⏏
**Kind**: Exported function  
**Returns**: <code>Callable</code> - next  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 
| middlewares | <code>Array.&lt;Callable&gt;</code> | 

<a name="module_yion"></a>

## yion
Yion module

**Example**  
```js
const { createApp, createServer } = require('yion');

const app = createApp();
const server = createServer(app);

app.get('/', (req, res) => {
   res.set('Content-Type', 'text/html; charset=utf-8').send('Hello world!');
});

server.listen(8080);
```

* [yion](#module_yion)
    * [createApp()](#exp_module_yion--createApp) ⇒ <code>Application</code> ⏏
    * [createServer(app, [plugins])](#exp_module_yion--createServer) ⇒ <code>HttpServer</code> ⏏

<a name="exp_module_yion--createApp"></a>

### createApp() ⇒ <code>Application</code> ⏏
**Kind**: Exported function  
<a name="exp_module_yion--createServer"></a>

### createServer(app, [plugins]) ⇒ <code>HttpServer</code> ⏏
**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| app | <code>Application</code> |  | 
| [plugins] | <code>Array</code> | <code>[]</code> | 

<a name="module_Link"></a>

## Link
Link module

**Example**  
```js
const Link = require('yion/lib/link');

const link = new Link('/js', __dirname + '/public/js');
[ ... ]
link.process(req, res);
```

* [Link](#module_Link)
    * [Link](#exp_module_Link--Link) ⇐ <code>Middleware</code> ⏏
    * [Link#_validPattern(url)](#exp_module_Link--Link+_validPattern) ⇒ <code>string</code> \| <code>null</code> ⏏
    * [Link#process(req, res, next, [...args])](#exp_module_Link--Link+process) ⏏

<a name="exp_module_Link--Link"></a>

### Link ⇐ <code>Middleware</code> ⏏
**Kind**: Exported class  
**Extends**: <code>Middleware</code>  
<a name="exp_module_Link--Link+_validPattern"></a>

### Link#_validPattern(url) ⇒ <code>string</code> \| <code>null</code> ⏏
**Kind**: Exported function  
**Access**: protected  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="exp_module_Link--Link+process"></a>

### Link#process(req, res, next, [...args]) ⏏
**Kind**: Exported function  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 
| next | <code>Callback</code> | 
| [...args] | <code>Array</code> | 

<a name="module_Middleware"></a>

## Middleware
Middleware module


* [Middleware](#module_Middleware)
    * [Middleware](#exp_module_Middleware--Middleware) ⏏
    * [Middleware#process(req, res, next, [...args])](#exp_module_Middleware--Middleware+process) ⏏

<a name="exp_module_Middleware--Middleware"></a>

### Middleware ⏏
**Kind**: Exported class  
<a name="exp_module_Middleware--Middleware+process"></a>

### Middleware#process(req, res, next, [...args]) ⏏
**Kind**: Exported function  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 
| next | <code>Callback</code> | 
| [...args] | <code>Array</code> | 

<a name="module_Request"></a>

## Request
Request module


* [Request](#module_Request)
    * [Request](#exp_module_Request--Request) ⏏
    * [Request#parseBody(chunk)](#exp_module_Request--Request+parseBody) ⏏
    * [Request#has(key)](#exp_module_Request--Request+has) ⇒ <code>boolean</code> ⏏
    * [Request#get(key)](#exp_module_Request--Request+get) ⇒ <code>\*</code> ⏏

<a name="exp_module_Request--Request"></a>

### Request ⏏
**Kind**: Exported class  
<a name="exp_module_Request--Request+parseBody"></a>

### Request#parseBody(chunk) ⏏
Light body parser

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| chunk | <code>string</code> | 

<a name="exp_module_Request--Request+has"></a>

### Request#has(key) ⇒ <code>boolean</code> ⏏
Check if request has parameter or attribute

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="exp_module_Request--Request+get"></a>

### Request#get(key) ⇒ <code>\*</code> ⏏
Get parameter or attribute if exists

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_Response"></a>

## Response
Response module


* [Response](#module_Response)
    * [Response](#exp_module_Response--Response) ⏏
    * [Response#status(code, [message])](#exp_module_Response--Response+status) ⇒ <code>Response</code> ⏏
    * [Response#set(key, value)](#exp_module_Response--Response+set) ⇒ <code>Response</code> ⏏
    * [Response#write(message, [encoding])](#exp_module_Response--Response+write) ⇒ <code>Response</code> ⏏
    * [Response#send(data, [encoding])](#exp_module_Response--Response+send) ⏏
    * [Response#sendFile(filepath, filename, [mimetype], [attachment])](#exp_module_Response--Response+sendFile) ⏏
    * [Response#json(data, [encoding])](#exp_module_Response--Response+json) ⏏
    * [Response#redirect(location, [code])](#exp_module_Response--Response+redirect) ⏏

<a name="exp_module_Response--Response"></a>

### Response ⏏
**Kind**: Exported class  
<a name="exp_module_Response--Response+status"></a>

### Response#status(code, [message]) ⇒ <code>Response</code> ⏏
Set response status code

**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| code | <code>number</code> \| <code>string</code> |  | 
| [message] | <code>string</code> | <code>null</code> | 

<a name="exp_module_Response--Response+set"></a>

### Response#set(key, value) ⇒ <code>Response</code> ⏏
Set response header

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| value | <code>string</code> | 

<a name="exp_module_Response--Response+write"></a>

### Response#write(message, [encoding]) ⇒ <code>Response</code> ⏏
Write into response body

**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| message | <code>string</code> |  | 
| [encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 

<a name="exp_module_Response--Response+send"></a>

### Response#send(data, [encoding]) ⏏
Set response body and lock it

**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| data | <code>\*</code> | <code></code> | 
| [encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 

<a name="exp_module_Response--Response+sendFile"></a>

### Response#sendFile(filepath, filename, [mimetype], [attachment]) ⏏
Attach file at response

**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| filepath | <code>string</code> |  | 
| filename | <code>string</code> |  | 
| [mimetype] | <code>string</code> | <code>&quot;&#x27;text/plain&#x27;&quot;</code> | 
| [attachment] | <code>boolean</code> | <code>true</code> | 

<a name="exp_module_Response--Response+json"></a>

### Response#json(data, [encoding]) ⏏
Add json into response body

**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| data | <code>Object</code> \| <code>Array</code> |  | 
| [encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 

<a name="exp_module_Response--Response+redirect"></a>

### Response#redirect(location, [code]) ⏏
Make response a redirection

**Kind**: Exported function  

| Param | Type | Default |
| --- | --- | --- |
| location | <code>string</code> |  | 
| [code] | <code>number</code> | <code>301</code> | 

<a name="module_Route"></a>

## Route
Route module


* [Route](#module_Route)
    * [Route](#exp_module_Route--Route) ⇐ <code>Middleware</code> ⏏
    * [Route#_validPattern(url, req)](#exp_module_Route--Route+_validPattern) ⇒ <code>boolean</code> ⏏
    * [Route#process(req, res, next, [...args])](#exp_module_Route--Route+process) ⏏

<a name="exp_module_Route--Route"></a>

### Route ⇐ <code>Middleware</code> ⏏
**Kind**: Exported class  
**Extends**: <code>Middleware</code>  
<a name="exp_module_Route--Route+_validPattern"></a>

### Route#_validPattern(url, req) ⇒ <code>boolean</code> ⏏
**Kind**: Exported function  
**Access**: protected  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| req | <code>Request</code> | 

<a name="exp_module_Route--Route+process"></a>

### Route#process(req, res, next, [...args]) ⏏
**Kind**: Exported function  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 
| next | <code>Callback</code> | 
| [...args] | <code>Array</code> | 

