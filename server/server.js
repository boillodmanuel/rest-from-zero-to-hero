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

server.connection({port: 3000});

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
      require('lout'),
      Assets
    ], function (err) {
      if (err) {
        throw err; // something bad happened loading the plugin
      }

      server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
      });
    });