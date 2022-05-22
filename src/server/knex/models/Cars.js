const knex = require('../knex');
const { Model } = require('objection');
// const knexConfig = require('../knexfile.js');
// const knex = Knex(knexConfig);
Model.knex(knex);

class Cars extends Model {
    static get tableName(){
        return 'cars';
    }

    static get relationMappings(){
        const Photos = require('./Photos');

        return {
            photos: {
                relation: Model.HasManyRelation,
                modelClass: Photos,
                join: {
                    from: 'cars.id',
                    to: 'photos.car_id'
                }
            }
        };
    }
}

module.exports = Cars;
