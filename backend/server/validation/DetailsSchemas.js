const Joi = require('joi');

class DetailsSchemas {
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
        });
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
        });
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

module.exports = DetailsSchemas;