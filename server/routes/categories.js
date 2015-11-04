var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');

routes = [
  {
    method: 'GET',
    path: '/categories',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;
      var items = db.categories.chain().sortBy('id').slice(offset, offset + limit).value();
      var collection = new Collection(items, offset, limit, db.categories.size());
      reply(collection).code(collection.isPartial() ? 206 : 200);
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned')
        }
      },
      description: 'list categories',
      tags: ['api', 'categories'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.categories,
          206: schemas.categories,
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'categories',
          query: '{?offset,limit}',
          embedded: {
            categories: {
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
    path: '/categories/{id}',
    handler: function (request, reply) {
      reply(db.categories.getById(request.params.id) || Boom.notFound());
    },
    config: {
      validate: {
        params: {
          id: Joi.string().required().description('category id')
        }
      },
      description: 'get category by id',
      tags: ['api', 'categories'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.category,
          404: schemas.error
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};