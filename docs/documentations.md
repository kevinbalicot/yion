## Classes

<dl>
<dt><a href="#Application">Application</a></dt>
<dd><p>Core module of yion</p>
</dd>
<dt><a href="#Link">Link</a></dt>
<dd><p>Link module</p>
</dd>
<dt><a href="#Middleware">Middleware</a></dt>
<dd></dd>
<dt><a href="#Route">Route</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#parseBody">parseBody</a></dt>
<dd><p>Light body parser</p>
</dd>
<dt><a href="#has">has</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if request has parameter or attribute</p>
</dd>
<dt><a href="#get">get</a> ⇒ <code>*</code></dt>
<dd><p>Get parameter or attribute if exists</p>
</dd>
<dt><a href="#status">status</a> ⇒ <code>Response</code></dt>
<dd><p>Set response status code</p>
</dd>
<dt><a href="#set">set</a> ⇒ <code>Response</code></dt>
<dd><p>Set response header</p>
</dd>
<dt><a href="#send">send</a></dt>
<dd><p>Set response body and lock it</p>
</dd>
<dt><a href="#sendFile">sendFile</a></dt>
<dd><p>Attach file at response</p>
</dd>
<dt><a href="#json">json</a></dt>
<dd><p>Add json into response body</p>
</dd>
<dt><a href="#redirect">redirect</a></dt>
<dd><p>Make response a redirection</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createApp">createApp()</a></dt>
<dd><p>Yion module</p>
</dd>
<dt><a href="#createServer">createServer(...apps)</a> ⇒ <code>Server</code></dt>
<dd></dd>
</dl>

<a name="Application"></a>

## Application
Core module of yion

**Kind**: global class  

* [Application](#Application)
    * [.use(callback)](#Application+use) ⇒ [<code>Application</code>](#Application)
    * [.link(pattern, target, [headers])](#Application+link) ⇒ [<code>Application</code>](#Application)
    * [.get(pattern, ...callbacks)](#Application+get) ⇒ [<code>Application</code>](#Application)
    * [.post(pattern, ...callbacks)](#Application+post) ⇒ [<code>Application</code>](#Application)
    * [.delete(pattern, ...callbacks)](#Application+delete) ⇒ [<code>Application</code>](#Application)
    * [.put(pattern, ...callbacks)](#Application+put) ⇒ [<code>Application</code>](#Application)
    * [.patch(pattern, ...callbacks)](#Application+patch) ⇒ [<code>Application</code>](#Application)
    * [.group(prefix)](#Application+group) ⇒ <code>Group</code>
    * [.process(context, next, [...args])](#Application+process)

<a name="Application+use"></a>

### application.use(callback) ⇒ [<code>Application</code>](#Application)
Add middleware

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Application+link"></a>

### application.link(pattern, target, [headers]) ⇒ [<code>Application</code>](#Application)
Add link middleware (useful for asset, like js and css files)

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pattern | <code>string</code> |  | what you use into html file (into link or script tags) |
| target | <code>string</code> |  | filepath where there are files |
| [headers] | <code>Object</code> | <code>{}</code> | add headers at response |

<a name="Application+get"></a>

### application.get(pattern, ...callbacks) ⇒ [<code>Application</code>](#Application)
Add GET listener middleware

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| ...callbacks | <code>Array.&lt;function()&gt;</code> |  |

<a name="Application+post"></a>

### application.post(pattern, ...callbacks) ⇒ [<code>Application</code>](#Application)
Add POST listener middleware

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| ...callbacks | <code>Array.&lt;function()&gt;</code> |  |

<a name="Application+delete"></a>

### application.delete(pattern, ...callbacks) ⇒ [<code>Application</code>](#Application)
Add DELETE listener middleware

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| ...callbacks | <code>Array.&lt;function()&gt;</code> |  |

<a name="Application+put"></a>

### application.put(pattern, ...callbacks) ⇒ [<code>Application</code>](#Application)
Add PUT listener middleware

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| ...callbacks | <code>Array.&lt;function()&gt;</code> |  |

<a name="Application+patch"></a>

### application.patch(pattern, ...callbacks) ⇒ [<code>Application</code>](#Application)
Add PATCH listener middleware

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | the route pattern |
| ...callbacks | <code>Array.&lt;function()&gt;</code> |  |

<a name="Application+group"></a>

### application.group(prefix) ⇒ <code>Group</code>
Add Group listener

**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>string</code> | the route prefix |

<a name="Application+process"></a>

### application.process(context, next, [...args])
**Kind**: instance method of [<code>Application</code>](#Application)  

| Param | Type |
| --- | --- |
| context | <code>Object</code> | 
| next | <code>function</code> | 
| [...args] | <code>Array</code> | 

<a name="Link"></a>

## Link
Link module

**Kind**: global class  

* [Link](#Link)
    * [new Link(pattern, target, [headers])](#new_Link_new)
    * [._validPattern(url)](#Link+_validPattern) ⇒ <code>string</code> \| <code>null</code>
    * [._getContentType(ext)](#Link+_getContentType) ⇒ <code>string</code>
    * [.process(context, next, [...args])](#Link+process)

<a name="new_Link_new"></a>

### new Link(pattern, target, [headers])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pattern | <code>string</code> |  | what you use into html file (into link or script tags) |
| target | <code>string</code> |  | filepath where there are files |
| [headers] | <code>Object</code> | <code>{}</code> | add headers at response |

**Example**  
```js
const Link = require('yion/lib/link');

const link = new Link('/js', __dirname + '/public/js');
[ ... ]
link.process(req, res);
```
<a name="Link+_validPattern"></a>

### link.\_validPattern(url) ⇒ <code>string</code> \| <code>null</code>
**Kind**: instance method of [<code>Link</code>](#Link)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="Link+_getContentType"></a>

### link.\_getContentType(ext) ⇒ <code>string</code>
**Kind**: instance method of [<code>Link</code>](#Link)  

| Param | Type |
| --- | --- |
| ext | <code>string</code> \| <code>null</code> | 

<a name="Link+process"></a>

### link.process(context, next, [...args])
**Kind**: instance method of [<code>Link</code>](#Link)  

| Param | Type |
| --- | --- |
| context | <code>Object</code> | 
| next | <code>function</code> | 
| [...args] | <code>array</code> | 

<a name="Middleware"></a>

## Middleware
**Kind**: global class  

* [Middleware](#Middleware)
    * [new Middleware(callback)](#new_Middleware_new)
    * [.process(context, next, [...args])](#Middleware+process)

<a name="new_Middleware_new"></a>

### new Middleware(callback)

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Middleware+process"></a>

### middleware.process(context, next, [...args])
**Kind**: instance method of [<code>Middleware</code>](#Middleware)  

| Param | Type |
| --- | --- |
| context | <code>Object</code> | 
| next | <code>function</code> | 
| [...args] | <code>Array</code> | 

<a name="Route"></a>

## Route
**Kind**: global class  

* [Route](#Route)
    * [new Route(method, pattern, callbacks)](#new_Route_new)
    * [._validPattern(url, req)](#Route+_validPattern) ⇒ <code>boolean</code>
    * [.process(context, next, [...args])](#Route+process)

<a name="new_Route_new"></a>

### new Route(method, pattern, callbacks)

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | the request method |
| pattern | <code>string</code> | the route pattern |
| callbacks | [<code>Array.&lt;Middleware&gt;</code>](#Middleware) |  |

<a name="Route+_validPattern"></a>

### route.\_validPattern(url, req) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| req | <code>Request</code> | 

<a name="Route+process"></a>

### route.process(context, next, [...args])
**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type |
| --- | --- |
| context | <code>Object</code> | 
| next | <code>function</code> | 
| [...args] | <code>array</code> | 

<a name="parseBody"></a>

## parseBody
Light body parser

**Kind**: global variable  

| Param | Type |
| --- | --- |
| chunk | <code>string</code> | 

<a name="has"></a>

## has ⇒ <code>boolean</code>
Check if request has parameter or attribute

**Kind**: global variable  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="get"></a>

## get ⇒ <code>\*</code>
Get parameter or attribute if exists

**Kind**: global variable  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="status"></a>

## status ⇒ <code>Response</code>
Set response status code

**Kind**: global variable  

| Param | Type | Default |
| --- | --- | --- |
| code | <code>number</code> \| <code>string</code> |  | 
| [message] | <code>string</code> \| <code>null</code> | <code>null</code> | 

<a name="set"></a>

## set ⇒ <code>Response</code>
Set response header

**Kind**: global variable  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| value | <code>string</code> | 

<a name="send"></a>

## send
Set response body and lock it

**Kind**: global variable  

| Param | Type | Default |
| --- | --- | --- |
| data | <code>\*</code> |  | 
| [encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 
| [callback] | <code>function</code> \| <code>null</code> | <code></code> | 

<a name="sendFile"></a>

## sendFile
Attach file at response

**Kind**: global variable  

| Param | Type | Default |
| --- | --- | --- |
| filepath | <code>string</code> |  | 
| filename | <code>string</code> |  | 
| [mimetype] | <code>string</code> | <code>&quot;&#x27;text/plain&#x27;&quot;</code> | 
| [attachment] | <code>boolean</code> | <code>true</code> | 
| [callback] | <code>function</code> \| <code>null</code> | <code></code> | 

<a name="json"></a>

## json
Add json into response body

**Kind**: global variable  

| Param | Type | Default |
| --- | --- | --- |
| data | <code>Object</code> \| <code>Array</code> |  | 
| [encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 
| [callback] | <code>function</code> \| <code>null</code> | <code></code> | 

<a name="redirect"></a>

## redirect
Make response a redirection

**Kind**: global variable  

| Param | Type | Default |
| --- | --- | --- |
| location | <code>string</code> |  | 
| [code] | <code>number</code> | <code>301</code> | 
| [callback] | <code>function</code> \| <code>null</code> | <code></code> | 

<a name="createApp"></a>

## createApp()
Yion module

**Kind**: global function  
**Example**  
```js
const { createApp, createServer } = require('yion')

const app = createApp()
const server = createServer(app)

app.get('/', (req, res) => {
   res.set('Content-Type', 'text/html; charset=utf-8').send('Hello world!')
})

server.listen(8080)
```
<a name="createServer"></a>

## createServer(...apps) ⇒ <code>Server</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| ...apps | [<code>Application</code>](#Application) \| <code>Array.&lt;Api&gt;</code> | 

