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
      reply(new Collection(items, offset, limit, db.hours.size()));
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
        schema: schemas.hours,
        status: {
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
        schema: schemas.hour,
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