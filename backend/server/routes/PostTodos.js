'use strict';

const TodoSchemas = require('../validation/TodoSchemas');

function PostTodos(server){
    server.route({
        method: 'POST',
        path: '/todos',
        options: {
            description: 'Returns a json object representing the created to-do item',
            tags: ['api', 'todo'],
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                const result = await server.db.add(request.payload);

                return result;
            },            
            validate: {
                payload: TodoSchemas.postRequest()
            },
            response: {
                schema: TodoSchemas.postResponse(),
                failAction: async function(request, h, err){
                    console.log(`failed post todos because: ${err}`);
                    return h.response("Bad Request").code(400);
                }
            }
        }
    });
};

module.exports = PostTodos;