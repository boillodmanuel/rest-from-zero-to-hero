var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');

routes = [
  {
    method: 'GET',
    path: '/hours',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;
      var items = db.hours.chain().sortBy('id').slice(offset, offset + limit).value();
      var collection = new Collection(items, offset, limit, db.hours.size());
      reply(collection).code(collection.isPartial() ? 206 : 200);
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned')
        }
      },
      description: 'list hours',
      tags: ['api', 'hours'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.hours,
          206: schemas.hours,
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'hours',
          query: '{?offset,limit}',
          embedded: {
            hours: {
              path: 'items',
              href: './{item.id}'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hours/{id}',
    handler: function (request, reply) {
      reply(db.hours.getById(request.params.id) || Boom.notFound());
    },
    config: {
      validate: {
        params: {
          id: Joi.string().regex(/^h[0-9]{2}$/).required().description('hour id')
        }
      },
      description: 'get hour by id',
      tags: ['api', 'hours'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.hour,
          404: schemas.error
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};