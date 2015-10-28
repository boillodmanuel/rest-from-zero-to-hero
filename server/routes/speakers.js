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
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned')
        }
      },
      description: 'list speakers',
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
      validate: {
        params: {
          id: Joi.string().required().description('speaker id')
        }
      },
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
      validate: {
        payload: schemas.updateSpeaker,
        params: {
          id: Joi.string().required().description('speaker id')
        }
      },
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
      validate: {
        payload: schemas.speaker,
        params: {
          id: Joi.string().required().description('speaker id')
        }
      },
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
      validate: {
        params: {
          id: Joi.string().required().description('speaker id')
        }
      },
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