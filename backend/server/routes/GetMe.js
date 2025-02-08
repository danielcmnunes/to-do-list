'use strict';

const AuthSchemas = require('../validation/AuthSchemas');

function GetMe(server){
    server.route({
        method: 'GET',
        path: '/me',
        options: {
            description: 'Returns the details of the authenticated user',
            tags: ['api', 'auth'],
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                const username = request.auth.credentials.username;

                const result = await server.db.details(username);
                
                return result;
            },            
            validate: {
                // it's a GET so it gets the username via auth credentials
                query: true
            },
            response: {
                schema: AuthSchemas.detailsResponse(),
                failAction: async function(request, h, err){
                    console.log(`failed get me because: ${err}`);
                    return h.response("Bad Request").code(400);
                }
            }
        }
    });
};

module.exports = GetMe;