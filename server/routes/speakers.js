var Joi = require('Joi');
var Boom = require('Boom');
var Path = require('path');
var low = require('lowdb');

var db = low(Path.join(__dirname, '../data/db.json'));
db._.mixin(require('underscore-db'));

var schemas = require('../data/schemas.js');

var speakers = db('speakers');
var sessions = db('sessions');
var categories = db('categories');
var hours = db('hours');

routes = [
  {
    method: 'GET',
    path: '/speakers',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;
      var items = speakers.slice(offset, offset + limit);
      reply({
        items: items,
        size: items.length,
        total: speakers.size(),
        offset: offset,
        limit: limit
      });
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(1).max(100).default(0),
          limit: Joi.number().integer().min(1).max(100).default(10)
        }
      },
      description: 'list speakers',
      notes: '<p>This method use pagination.</p>' +
          '<p>Query parameters:' +
          '<ul>' +
          '<li>offset: offset used (default 0)</li>' +
          '<li>limit: max items returned (default 10)</li></br></p>',
      tags: ['speakers'],
      response: {
        schema: Joi.array().items(schemas.speaker),
        status: {
          500: schemas.error
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/speakers',
    handler: function (request, reply) {
      var speaker = speakers.insert(request.payload);
      reply(speaker).code(201);
    },
    config: {
      validate: { payload: schemas.speaker },
      description: 'add speakers',
      tags: ['speakers']
    }
  },
  {
    method: 'GET',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      var speaker = speakers.getById(request.params.id);
      if (speaker) {
        reply(speaker);
      } else {
        reply(Boom.notFound());
      }
    },
    config: {
      description: 'get speaker by id',
      tags: ['speakers']
    }
  },
  {
    method: 'PUT',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      var speaker = speakers.replaceById(request.params.id, request.payload);
      if (speaker) {
        reply(speaker);
      } else {
        reply(Boom.notFound());
      }
    },
    config: {
      validate: { payload: schemas.speaker },
      description: 'update speaker',
      tags: ['speakers']
    }
  },
  {
    method: 'DELETE',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      var speaker = speakers.removeById(request.params.id);
      if (speaker) {
        reply().code(204);
      } else {
        reply(Boom.notFound());
      }
    },
    config: {
      description: 'delete speaker',
      tags: ['speakers']
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};