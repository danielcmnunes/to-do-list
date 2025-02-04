const knex = require('knex');

class DatabaseWrapper {
    constructor(){        
        const knexConfig = require('../../db/knexfile');
        console.log(`knex configuration type: ${process.env.NODE_ENV}`);
        this.db = knex(knexConfig[process.env.NODE_ENV]);
    }

    async add(_description){
        try {            
            const result = await this.db('items').insert({ 
                state: 'INCOMPLETE',
                description: _description, 
                createdAt: this.db.fn.now(),
                completedAt: null
            });
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getById(id){
        try {
            const result = await this.db.select('*').from('items').where('id', id);
            return result;            
        } catch (error) {            
            return [];
        };
    }

    async get(state, field){
        //TODO: hide incompleted when order by completed_at?
        try {
            if(state === 'ALL'){
                const items = await this.db.select('*').from('items').orderBy(field);
                return items; 
            } else {
                const items = await this.db.select('*').from('items').where('state', state).orderBy(field);
                return items;
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }

}

module.exports = DatabaseWrapper


