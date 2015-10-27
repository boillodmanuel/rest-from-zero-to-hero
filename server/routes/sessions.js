var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');

routes = [
  {
    method: 'GET',
    path: '/sessions',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;
      var items = db.sessions.slice(offset, offset + limit);
      reply(new Collection(items, offset, limit, db.sessions.size()));
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0),
          limit: Joi.number().integer().min(1).max(100).default(10)
        }
      },
      description: 'list sessions',
      notes: '<p>This method use pagination.</p>' +
      '<p>Query parameters:' +
      '<ul>' +
      '<li>offset: offset used (default 0)</li>' +
      '<li>limit: max items returned (default 10)</li></br></p>',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.sessions,
        status: {
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'sessions',
          query: '{?offset,limit}',
          embedded: {
            sessions: {
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
    path: '/sessions',
    handler: function (request, reply) {
      var session = db.sessions.insert(request.payload);
      reply(session).code(201);
    },
    config: {
      validate: {payload: schemas.createSession},
      description: 'add sessions',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.session,
        status: {
          400: schemas.validationError
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      reply(db.sessions.getById(request.params.id) || Boom.notFound());
    },
    config: {
      description: 'get session by id',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.session,
        status: {
          404: schemas.error
        }
      },
      plugins: {
        hal: {
          links: {
            hour: '/hours/{hour}',
            category: '/categories/{type}'
          },
          embedded: {
            speakers: {
              path: 'speakers',
              href: '/speakers/{item}'
            }
          }
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      reply(db.sessions.replaceById(request.params.id, request.payload) || Boom.notFound());
    },
    config: {
      validate: { payload: schemas.updateSession },
      description: 'update session',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.session,
        status: {
          400: schemas.validationError,
          404: schemas.error
        }
      }
    }
  },
  {
    method: 'PATCH',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      reply(db.sessions.updateById(request.params.id, request.payload) || Boom.notFound());
    },
    config: {
      validate: { payload: schemas.session },
      description: 'partial update session',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.session,
        status: {
          400: schemas.validationError,
          404: schemas.error
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/sessions/{id}',
    handler: function (request, reply) {
      if (db.sessions.removeById(request.params.id)) {
        reply().code(204);
      } else {
        reply(Boom.notFound());
      }
    },
    config: {
      description: 'delete session',
      tags: ['api', 'sessions'],
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