const Joi = require('joi');

//TODO: description max length

class AuthSchemas {
    /**
     * LOGIN
     */
    static loginRequest(){
        return Joi.object({
            username: 
                Joi.string()
                .max(64)
                .required(),

            password: 
                Joi.string()
                .max(64)
                .required()
        }).label('Login Request');
    }

    static loginResponse(){
        return Joi.object({  
            username: 
                Joi.string()
                .max(64)
                .required(),

            token: 
                Joi.string()
                .required()
        }).label('Login Response');
    }


    /**
     * LOGOUT
     */
    static logoutRequest(){
        return Joi.object({ 
            username: 
                Joi.string()
                .max(64)
                .required(),
                               
            token: 
                Joi.string()
                .required()
        }).label('Logout Request');
    }

    static logoutResponse(){
        return true;
    }



    /**
     * REGISTER
     */
    static registerRequest(){
        return Joi.object({                
            username: 
                Joi.string()
                .max(64)
                .required(),
            password: 
                Joi.string()
                .max(64)
                .required(),
            email: 
                Joi.string()
                .max(256)
                .required()
        }).label('Register Request');
    }

    static registerResponse(){
        return Joi.object({                
            username: 
                Joi.string()
                .max(64)
                .required(),
            token: 
                Joi.string()
                .required()
        }).label('Register Response');
    }


    /**
     * DETAILS
     */

    static detailsResponse(){
        return Joi.object({                
            username: 
                Joi.string()
                .max(64)
                .required(),
            email: 
                Joi.string()
                .max(256)
                .required()
        }).label('Details Response');
    }


    /**
     * EDIT
     */
    static editRequest(){
        return Joi.object({
            email: 
                Joi.string()
                .max(256)
                .required()
                .optional(),
            password: 
                Joi.string()
                .max(64)
                .optional()
        }).label('Edit Request');
    }

    static editResponse(){
        return Joi.object({                
            username: 
                Joi.string()
                .max(64)
                .required(),
            email: 
                Joi.string()
                .max(256)
                .required()
        }).label('Edit Response');
    }
}

module.exports = AuthSchemas;