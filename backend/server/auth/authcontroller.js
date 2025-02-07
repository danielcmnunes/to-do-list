const Joi = require('joi');

const JoiSchemas = require('../validation/authschemas')

class AuthController {}

AuthController.login = async function(database, payload){
    const request_schema = JoiSchemas.loginRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    } 

    const result = await database.login(validation.value);

    const response_schema = JoiSchemas.loginResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

AuthController.logout = async function(database, payload){
    const request_schema = JoiSchemas.logoutRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    } 

    const result = await database.logout(validation.value);

    const response_schema = JoiSchemas.logoutResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
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

AuthController.details = async function(database, payload){
    const request_schema = JoiSchemas.detailsRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    } 

    const result = await database.get(validation.value);

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
    
    const result = await database.get(validation.value);

    const response_schema = JoiSchemas.editResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

module.exports = AuthController