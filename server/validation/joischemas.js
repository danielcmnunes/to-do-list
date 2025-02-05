const Joi = require('joi');

//TODO: description max length

class JoiSchemas {
    static genericResponse(){
        return Joi.object({
            id: 
                Joi.number()
                .integer()
                .required(),
            
            state: 
                Joi.string()
                .valid('COMPLETE')
                .valid('INCOMPLETE')
                .required(),
                
            description: 
                Joi.string()
                .max(256)
                .required(),
            
            createdAt:
                Joi.string()
                .isoDate()
                .required(),
            
            completedAt:
                Joi.alternatives()
                .try(Joi.string().isoDate(), Joi.valid(null))
                .required()
        });
    }


    /**
     * GET
     */
    static getRequest(){
        return Joi.object({            
            filter:
                Joi.string()
                .valid('ALL')
                .valid('COMPLETE')
                .valid('INCOMPLETE')
                .default('ALL'),
        
            orderBy:
                Joi.string()
                .replace('DESCRIPTION', 'description')
                .replace('CREATED_AT', 'createdAt')
                .replace('COMPLETED_AT', 'completedAt')
                .valid('description')
                .valid('createdAt')
                .valid('completedAt')
                .default('createdAt')
        });
    }

    static getResponse(){
        return Joi.array().items(JoiSchemas.genericResponse());
    }


    /**
     * POST
     */
    static postRequest(){
        return Joi.object({                
            description: 
                Joi.string()
                .max(256)
                .required()
        });
    }

    static postResponse(){
        return JoiSchemas.genericResponse();
    }


    /**
     * PATCH
     */
    static patchRequestId(){
        return Joi.object({            
            id: 
                Joi.number()
                .integer()
                .required()
        });
    }

    static patchRequestPayload(){
        return Joi.object({
            state: 
                Joi.string()
                .valid('COMPLETE','INCOMPLETE')
                .optional(),
                
            description: 
                Joi.string()
                .max(256)
                .optional()

        }).or('state', 'description');
    }

    static patchResponse(){
        return JoiSchemas.genericResponse();
    }


    /**
     * DELETE
     */

}

module.exports = JoiSchemas;