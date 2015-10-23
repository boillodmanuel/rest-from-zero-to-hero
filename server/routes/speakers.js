routes = [
  {
    method: 'GET',
    path: '/speakers',
    handler: function (request, reply) {
      reply([{id: "antoine"}, {id: "manu"}]);
    },
    config: {
      description: 'list speakers',
      notes: 'pagination enabled',
      tags: ['speakers']
    }
  },
  {
    method: 'POST',
    path: '/speakers',
    handler: function (request, reply) {
      reply([{id: "antoine"}, {id: "manu"}]).code(201);
    },
    config: {
      description: 'add speakers',
      tags: ['speakers']
    }
  },
  {
    method: 'GET',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id});
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
      reply({id: request.params.id});
    },
    config: {
      description: 'update speaker',
      tags: ['speakers']
    }
  },
  {
    method: 'DELETE',
    path: '/speakers/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id}).code(204);
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