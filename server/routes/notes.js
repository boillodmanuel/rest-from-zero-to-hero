var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');
var _ = db.db._;

var getNotes = function (offset, limit, session) {
  var query = db.notes.chain();
  if (session) {
    query = query.where({ 'session': session });
  }
  var total = query.size().value();
  var items = query.slice(offset, offset + limit).value();
  return new Collection(items, offset, limit, total);
} ;

routes = [
  {
    method: 'GET',
    path: '/notes',
    handler: function (request, reply) {
      var collection = getNotes(request.query.offset, request.query.limit, request.query.session);
      reply(collection).code(collection.isPartial() ? 206 : 200);
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned'),
          session: Joi.string().regex(/^s[0-9]+$/).description('session')
        }
      },
      description: 'list notes',
      tags: ['api', 'notes'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.notes,
          206: schemas.notes,
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'notes',
          query: '{?offset,limit,session}',
          embedded: {
            notes: {
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
    path: '/notes',
    handler: function (request, reply) {
      var note = db.notes.insert(request.payload);
      reply(note).code(201).header('Location', '/notes/' + note.id);
    },
    config: {
      validate: {payload: schemas.note},
      description: 'note session',
      tags: ['api', 'notes'],
      response: {
        schema: schemas.error,
        status: {
          201: schemas.note,
          400: schemas.validationError
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/sessions/{id}/notes',
    handler: function (request, reply) {
      var collection = getNotes(request.query.offset, request.query.limit, request.params.id);
      reply(collection).code(collection.isPartial() ? 206 : 200);
    },
    config: {
      validate: {
        params: {
          id: Joi.string().regex(/^s[0-9]+$/).description('session')
        },
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned')
        }
      },
      description: 'list notes',
      tags: ['api', 'notes'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.notes,
          206: schemas.notes,
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'notes',
          query: '{?offset,limit,session}',
          embedded: {
            notes: {
              path: 'items',
              href: './{item.id}',
              embedded: {
                session: {
                  path: 'session',
                  href: '/sessions/{item}'
                }
              }
            }
            //embedded: {
            //notes: {
            //  path: 'items',
            //  href: './{item.id}'
            //}
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/sessions/{id}/notes',
    handler: function (request, reply) {
      request.payload.session = request.params.id;
      var note = db.notes.insert(request.payload);
      reply(note).code(201).header('Location', '/notes/' + note.id);
    },
    config: {
      validate: {
        params: {
          id: Joi.string().regex(/^s[0-9]+$/).required().description('session id')
        },
        payload: schemas.sessionNote
      },
      description: 'note session',
      tags: ['api', 'sessions'],
      response: {
        schema: schemas.error,
        status: {
          201: schemas.note,
          400: schemas.validationError
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: function (request, reply) {
      reply(db.notes.getById(request.params.id) || Boom.notFound());
    },
    config: {
      validate: {
        params: {
          id: Joi.string().required().description('note id')
        }
      },
      description: 'get note by id',
      tags: ['api', 'notes'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.note,
          404: schemas.error
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};