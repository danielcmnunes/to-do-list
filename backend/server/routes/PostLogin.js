'use strict';

const AuthSchemas = require('../validation/AuthSchemas');
const AuthController = require('../auth/Authentication');

function PostLogin(server){
    server.route({
        method: 'POST',
        path: '/login',
        options: {
            description: 'authenticates the user and returns a valid JWT session token',
            tags: ['api', 'auth'],
            auth: false,
            handler: async (request, h) => {
                const result = await server.db.checkUserPass(request.payload);

                const response = {};

                if(result && result.username){
                    const username = request.payload.username;
                    response.username = username,
                    response.token = await AuthController.generateToken(username);
                }

                return response;
            },
            validate: {
                payload: AuthSchemas.loginRequest()
            },
            response: {
                schema: AuthSchemas.loginResponse(),
                failAction: async function(request, h, err){
                    return h.response("Unauthorized").code(401);
                }
            }
        }
    });
};

module.exports = PostLogin;