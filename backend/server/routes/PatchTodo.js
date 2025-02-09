'use strict';

const TodoSchemas = require('../validation/TodoSchemas');

function PatchTodo(server){
    server.route({
        method: 'PATCH',
        path: '/todo/{id}',
        options: {
            description: 'Returns a json objects representing the edited to-do item',
            notes: ['requires a valid JWT token'],
            tags: ['api', 'todo'],
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                const result = await server.db.edit(request.params, request.payload);
                
                return result;
            },            
            validate: {
                params: TodoSchemas.patchRequestParams(),
                payload: TodoSchemas.patchRequestPayload()
            },
            response: {
                schema: TodoSchemas.patchResponse(),
                failAction: async function(request, h, err){
                    console.log(`failed patch todo because: ${err}`);
                    return h.response("Bad Request").code(400);
                }
            }
        }
    });
};

module.exports = PatchTodo;