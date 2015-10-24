var Path = require('path');
var low = require('lowdb');
var db = low(Path.join(__dirname, '../data/db.json'));

var speakers = db('speakers');
var sessions = db('sessions');
var categories = db('categories');
var hours = db('hours');

routes = [
  {
    method: 'GET',
    path: '/sessions',
    handler: function (request, reply) {
      reply([{id: "antoine"}, {id: "manu"}]);
    },
    config: {
      description: 'list sessions',
      notes: 'pagination enabled',
      tags: ['sessions']
    }
  },
  {
    method: 'POST',
    path: '/sessions',
    handler: function (request, reply) {
      reply([{id: "antoine"}, {id: "manu"}]).code(201);
    },
    config: {
      description: 'add sessions',
      tags: ['sessions']
    }
  },
  {
    method: 'GET',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id});
    },
    config: {
      description: 'get session by id',
      tags: ['sessions']
    }
  },
  {
    method: 'PUT',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id});
    },
    config: {
      description: 'update session',
      tags: ['sessions']
    }
  },
  {
    method: 'DELETE',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id}).code(204);
    },
    config: {
      description: 'delete session',
      tags: ['sessions']
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};