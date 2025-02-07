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
        });
    }

    static loginResponse(){
        return Joi.object({                
            token: 
                Joi.string()
                .max(256)
                .required()
        });
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
                .max(256)
                .required()
        });
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
        });
    }

    static registerResponse(){
        return Joi.object({                
            jwt: 
                Joi.string()
                .max(256)
                .required()
        });
    }


    /**
     * DETAILS
     */
    static detailsRequest(){
        return Joi.object({                
            token: 
                Joi.string()
                .max(256)
                .required()
        });
    }

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
        });
    }


    /**
     * EDIT
     */
    static editRequest(){
        return Joi.object({
            username: 
                Joi.string()
                .max(64)
                .required()
                .optional(),
            email: 
                Joi.string()
                .max(256)
                .required()
                .optional(),
            token: 
                Joi.string()
                .max(256)
                .required()
        }).or('username', 'email');
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
        });
    }
}

module.exports = AuthSchemas;