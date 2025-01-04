const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'API Documentation',
    description: 'API Documentation with express-jsdoc-swagger',
  },
  baseDir: __dirname,
  filesPattern: './routes/*.js',
  swaggerUIPath: '/',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: '/v3/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
};

const setupSwagger = (app) => {
  expressJSDocSwagger(app)(options);
};

module.exports = setupSwagger;