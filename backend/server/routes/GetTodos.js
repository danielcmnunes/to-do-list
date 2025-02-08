'use strict';

const TodoSchemas = require('../validation/TodoSchemas');

function GetTodos(server){
    server.route({
        method: 'GET',
        path: '/todos',
        options: {
            description: 'Returns a json array of objects representing the to-do items',
            tags: ['api', 'todo'],
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                const username = request.auth.credentials.username;

                const result = await server.db.get(request.query, username);

                return result;
            },            
            validate: {
                query: TodoSchemas.getRequest()
            },
            response: {
                schema: TodoSchemas.getResponse(),
                failAction: async function(request, h, err){
                    console.log(`failed get todos because: ${err}`);
                    return h.response("Bad Request").code(400);
                }
            }
        }
    });
};

module.exports = GetTodos;