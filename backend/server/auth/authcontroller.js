const Joi = require('joi');
const Jwt = require('@hapi/jwt');

const JoiSchemas = require('../validation/authschemas')

class AuthController {}

AuthController.getStrategy = function(database){
    return {
        keys: 'some_shared_secret',
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: async (artifacts, request, h) => {            
            const user = await database.getUser(artifacts.decoded.payload.user);
            if (!user) {
                return { isValid: false };
            }
            return {
                isValid: true,
                credentials: { username: artifacts.decoded.payload.user }
            };
        }
    }
};

AuthController.generateToken = async function(username){
    const token = Jwt.token.generate(
        {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            user: username,
            group: 'hapi_community'
        },
        {
            key: 'some_shared_secret',
            algorithm: 'HS512'
        },
        {
            ttlSec: 14400 // 4 hours
        }
    );
    return token;
}


AuthController.login = async function(database, payload){
    const request_schema = JoiSchemas.loginRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    }

    const result = await database.checkUserPass(validation.value);

    const response = {};

    if(result.username){
        const username = payload.username;
        response.username = username,
        response.token = await AuthController.generateToken(username);
    }
    
    const response_schema = JoiSchemas.loginResponse();
    const response_validation = response_schema.validate(response);
    return response_validation;
};

AuthController.logout = async function(database, payload){
    const request_schema = JoiSchemas.logoutRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    } 

    const result = await database.logout(validation.value);
    return result;
};

AuthController.register = async function(database, payload){
    const request_schema = JoiSchemas.registerRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    }

    const result = await database.register(validation.value);

    const response_schema = JoiSchemas.registerResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

AuthController.details = async function(database, request){
    const username = request.auth.credentials.username;

    const result = await database.details(username);

    const response_schema = JoiSchemas.detailsResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

AuthController.edit = async function(database, payload){
    const request_schema = JoiSchemas.editRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    }
    
    const result = await database.editDetails(validation.value);

    const response_schema = JoiSchemas.editResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

module.exports = AuthController