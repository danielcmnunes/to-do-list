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
        }).label('Details Edit Request');
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
        }).label('Details Edit Response');
    }
}

module.exports = DetailsSchemas;