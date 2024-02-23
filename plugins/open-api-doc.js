const fs = require('node:fs')
const assert = require('node:assert')

let pathToSwaggerUi
try {
  pathToSwaggerUi = require.main.require('swagger-ui-dist').absolutePath()
} catch (e) {
  throw new Error(`To use openapi doc plugin, install swagger-ui-dist lib : ${e.message}`)
}

const swaggerJs = fs.readFileSync(`${pathToSwaggerUi}/swagger-ui-bundle.js`, 'utf-8')
const swaggerCss = fs.readFileSync(`${pathToSwaggerUi}/swagger-ui.css`, 'utf-8')

module.exports = (api, {apiPrefix = '/api'} = {}) => (context, next) => {
  const {req, res, app} = context

  assert.ok(app, 'Need Application')
  assert.ok(api, 'Need Api application')

  if (req.url === `${apiPrefix}/doc.json`) {
    res.setHeader('Content-Type', 'application/json');

    return res.end(JSON.stringify(api.openApi));
  }

  if (req.url === `${apiPrefix}/doc.html`) {
    res.setHeader('Content-Type', 'text/html');

    return res.end(`
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Swagger API Doc</title>
            <script>${swaggerJs}</script>
            <style>${swaggerCss}</style>
          </head>
          <body>
            <section id="swagger-container"></section>
            <script>
              SwaggerUIBundle({
                url: '${apiPrefix}/doc.json',
                dom_id: '#swagger-container',
              });
            </script>
          </body>
        </html>
    `);
  }

  next()
}