const knex = require('./knex');
const { Model } = require('objection');
// const knexConfig = require('../knexfile.js');
// const knex = Knex(knexConfig);
Model.knex(knex);

class Photos extends Model {
    static get tableName(){
        return 'photos';
    }

    static get relationMappings(){
        const Cars = require('./Cars');

        return {
            car: {
                relation: Model.BelongsToOneRelation,
                modelClass: Cars,
                join: {
                    to: 'cars.id',
                    from: 'photos.car_id'
                }
            }
        };
    }

}

module.exports = Photos;