var Joi = require('Joi');
var Boom = require('Boom');
var _ = require('lodash');
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
      var query = db.sessions.chain();
      if (request.query.hour) {
        query = query.where({ 'hour': request.query.hour });
      }
      if (request.query.category) {
        query = query.where({ 'type': request.query.category });
      }
      var total = query.size().value();
      var items = query.slice(offset, offset + limit).value();
      reply(new Collection(items, offset, limit, total));
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned'),
          hour: Joi.string().regex(/^h[0-9]{2}$/).description('filter items by hour'),
          category: Joi.string().description('filter items by category')
        }
      },
      description: 'list sessions',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.sessions,
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'sessions',
          query: '{?offset,limit,hour,category}',
          embedded: {
            sessions: {
              path: 'items',
              href: './{item.id}',
              embedded: {
                speakers: {
                  path: 'speakers',
                  href: '/speakers/{item}'
                }
              }
            }
          },
          prepare: function (rep, next) {
            rep.link('findByHour', '/sessions{?hour}');
            rep.link('findByCategory', '/sessions{?category}');
            next();
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
        schema: schemas.error,
        status: {
          201: schemas.session,
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
      validate: {
        params: {
          id: Joi.string().regex(/^s[0-9]+$/).required().description('session id')
        }
      },
      description: 'get session by id',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.session,
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
      validate: {
        payload: schemas.updateSession,
        params: {
          id: Joi.string().regex(/^s[0-9]+$/).required().description('session id')
        }
      },
      description: 'update session',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.session,
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
      validate: {
        payload: schemas.session,
        params: {
          id: Joi.string().regex(/^s[0-9]+$/).required().description('session id')
        }
      },
      description: 'partial update session',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.session,
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
      validate: {
        params: {
          id: Joi.string().regex(/^s[0-9]+$/).required().description('session id')
        }
      },
      description: 'delete session',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.error,
        status: {
          404: schemas.error
        }
      },
      plugins: {
        'hapi-swaggered': {
          responses: {
            204: {description: 'No Content'}
          }
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};