var _ = require('lodash');
var Path = require('path');
var Assets = exports;

var heroes = ['batman', 'superman', 'spiderman', 'starwars', 'dragonball'];

Assets.register = function (plugin, options, next) {
  plugin.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: {
      file: 'favicon.ico'
    },
    config: {
      cache: {expiresIn: 86400000, privacy: 'public'},
      plugins: {
        lout: false
      }
    }
  });
  plugin.route({
    method: 'GET',
    path: '/hero',
    handler: {
      file: {
        path: function() {
          return Path.join('heros', heroes[_.random(0, heroes.length - 1)] + ".txt");
        },
        etagMethod: false
      }
    },
    config: {
      plugins: {
        lout: false
      }
    }
  });
  next();
};

Assets.register.attributes = {
  name: 'assets'
};