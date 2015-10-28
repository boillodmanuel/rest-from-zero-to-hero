var Hapi = require('hapi');
var Path = require('path');
var Assets = require('./assets');

var server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'assets')
      }
    }
  }
});

server.connection({
  port: 3000,
  routes: {
    cors: true,
    validate: {
      options: {
        abortEarly: false
      }
    }
  }
});

server.register(
  [
    {
      register: require('good'),
      options: {
        reporters: [{
          reporter: require('good-console'),
          events: {
            response: '*',
            log: '*'
          }
        }]
      }
    },
    {
      register: require('hapi-routes'),
      options: {dir: 'routes'}
    },
    require('vision'),
    require('inert'),
    {
      register: require('hapi-swaggered'),
      options: {
        info: {
          title: 'REST - From zero to hero',
          description: 'Devfest Nantes 2015',
          version: '1.0'
        },
        produces: [ 'application/json', 'application/hal+json' ]
      }
    },
    {
      register: require('hapi-swaggered-ui'),
      options: {
        title: 'Devfest Nantes API',
        path: '/docs'
      }
    },
    {
      register: require('halacious'),
      options: {
        mediaTypes: ['application/hal+json'],
        apiPath: ''
      }
    },
    Assets
  ], function (err) {
    if (err) {
      throw err; // something bad happened loading the plugin
    }

    server.start(function () {
      server.log('info', 'Server running at: ' + server.info.uri);
    });
  }
);