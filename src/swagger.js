const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SAMS Backend API',
      version: '1.0.0',
      description: 'School Attendance Management System API documentation',
    },
    servers: [
      {
        // relative, so "Try it out" calls whichever server the docs are opened on (localhost or Vercel)
        url: '/api',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
