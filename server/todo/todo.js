const Joi = require('joi');

const JoiSchemas = require('../validation/joischemas')

class Todo {}

Todo.get = async function(database, payload){
    const request_schema = JoiSchemas.getRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    } 

    const result = await database.get(validation.value);

    const response_schema = JoiSchemas.getResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

Todo.post = async function(database, payload){
    const request_schema = JoiSchemas.postRequest();
    const validation = request_schema.validate(payload);

    if(validation.error){
        return validation;
    }

    const result = database.add(validation.value);

    const response_schema = JoiSchemas.getResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

Todo.edit = async function(database, parameters, payload){
    const id_schema = JoiSchemas.patchRequestId();
    const id_validation = id_schema.validate(parameters);

    if(id_validation.error){
        return id_validation;
    }

    const payload_schema = JoiSchemas.patchRequestPayload();
    const payload_validation = payload_schema.validate(payload);

    if(payload_validation.error){
        return payload_validation;
    } 

    const id = id_validation.value.id;
    const state = payload_validation.value.state;
    const description = payload_validation.value.description;
    
    const result = database.edit(id, state, description);

    const response_schema = JoiSchemas.patchResponse();
    const response_validation = response_schema.validate(result);
    return response_validation;
};

Todo.del = async function(database, params){
    const id_schema = JoiSchemas.patchRequestId();
    const id_validation = id_schema.validate(params);

    if(id_validation.error){
        return id_validation;
    }

    const result = await database.del(id);
    return result;
}

module.exports = Todo