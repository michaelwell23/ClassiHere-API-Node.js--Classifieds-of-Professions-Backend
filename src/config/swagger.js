const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClassiHere API',
      version: '1.0.0',
      description: 'API oficial do ClassiHere',
    },
    servers: [
      {
        url: 'http://localhost:3333',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/modules/**/docs/*.js'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',

        scheme: 'bearer',

        bearerFormat: 'JWT',
      },
    },
  },
};

module.exports = swaggerJsdoc(options);
