'use strict';

const AuthSchemas = require('../validation/AuthSchemas');

function PatchMe(server){
    server.route({
        method: 'PATCH',
        path: '/me',
        options: {
            description: 'Returns the edited details of the authenticated user',
            tags: ['api', 'auth'],
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                const username = request.auth.credentials.username;

                const result = await server.db.editDetails(request.payload, username);
                
                return result;
            },
            validate: {
                payload: AuthSchemas.editRequest()
            },
            response: {
                schema: AuthSchemas.editResponse(),
                failAction: async function(request, h, err){
                    console.log(`failed patch me because: ${err}`);
                    return h.response("Bad Request").code(400);
                }
            }
        }
    });
};

module.exports = PatchMe;