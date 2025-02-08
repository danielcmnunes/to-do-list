'use strict';

const AuthSchemas = require('../validation/AuthSchemas');
const Authentication = require('../auth/Authentication');

function PostUsers(server){
    server.route({
        method: 'POST',
        path: '/users',
        options: {
            description: 'creates a new account with the given user details',
            tags: ['api', 'auth'],
            auth: false,
            handler: async (request, h) => {
                const result = await server.db.register(request.payload);
                
                const response = {};

                if(result && result.username){
                    const username = request.payload.username;
                    response.username = username,
                    response.token = await Authentication.generateToken(username);
                }

                return response;
            },
            validate: {
                payload: AuthSchemas.registerRequest()
            },
            response: {
                schema: AuthSchemas.registerResponse(),
                failAction: async function(request, h, err){
                    console.log(`failed post users because: ${err}`);
                    return h.response("Bad Request").code(400);
                }
            }
        }
    });
};

module.exports = PostUsers;