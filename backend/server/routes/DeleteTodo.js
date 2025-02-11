'use strict';

const TodoSchemas = require('../validation/TodoSchemas');

function DeleteTodo(server){
    server.route({
        method: 'DELETE',
        path: '/todo/{id}',
        options: {
            description: 'Deletes the item with given id and returns an empty response',
            tags: ['api', 'todo'],
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                const result = await server.db.delete_(request.params);

                return result;
            },            
            validate: {
                params: TodoSchemas.deleteRequest()
            },
            response: {
                //return empty if succeeded
                schema: true,
                failAction: async function(request, h, err){
                    console.log(`failed delete todo because: ${err}`);
                    return h.response("Item not found").code(404);
                }
            }
        }
    });
};

module.exports = DeleteTodo;