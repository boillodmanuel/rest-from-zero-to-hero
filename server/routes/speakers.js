var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');

routes = [
  {
    method: 'GET',
    path: '/speakers',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;
      var items = db.speakers.slice(offset, offset + limit);
      reply(new Collection(items, offset, limit, db.speakers.size()));
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0),
          limit: Joi.number().integer().min(1).max(100).default(10)
        }
      },
      description: 'list speakers',
      notes: '<p>This method use pagination.</p>' +
          '<p>Query parameters:' +
          '<ul>' +
          '<li>offset: offset used (default 0)</li>' +
          '<li>limit: max items returned (default 10)</li></br></p>',
      tags: ['api', 'speakers'],
      response: {
        schema: schemas.speakers,
        status: {
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'speakers',
          query: '{?offset,limit}',
          embedded: {
            speakers: {
              path: 'items',
              href: './{item.id}'
            }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/speakers',
    handler: function (request, reply) {
      var speaker = db.speakers.insert(request.payload);
      reply(speaker).code(201);
    },
    config: {
      validate: {payload: schemas.createSpeaker},
      description: 'add speakers',
      tags: ['api', 'speakers'],
      response: {
        schema: schemas.speaker,
        status: {
          400: schemas.validationError
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      reply(db.speakers.getById(request.params.id) || Boom.notFound());
    },
    config: {
      description: 'get speaker by id',
      tags: ['api', 'speakers'],
      response: {
        schema: schemas.speaker,
        status: {
          404: schemas.error
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      reply(db.speakers.replaceById(request.params.id, request.payload) || Boom.notFound());
    },
    config: {
      validate: { payload: schemas.updateSpeaker },
      description: 'update speaker',
      tags: ['api', 'speakers'],
      response: {
        schema: schemas.speaker,
        status: {
          400: schemas.validationError,
          404: schemas.error
        }
      }
    }
  },
   {
    method: 'PATCH',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      reply(db.speakers.updateById(request.params.id, request.payload) || Boom.notFound());
    },
    config: {
      validate: { payload: schemas.speaker },
      description: 'partial update speaker',
      tags: ['api', 'speakers'],
      response: {
        schema: schemas.speaker,
        status: {
          400: schemas.validationError,
          404: schemas.error
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      if (db.speakers.removeById(request.params.id)) {
        reply().code(204);
      } else {
        reply(Boom.notFound());
      }
    },
    config: {
      description: 'delete speaker',
      tags: ['api', 'speakers'],
      response: {
        status: {
          404: schemas.error
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};