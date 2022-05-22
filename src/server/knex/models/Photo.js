const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class Photo extends Model {
    static get tableName(){
        return 'photos';
    }

    static get relationMappings(){
        const Car = require('./Car');

        return {
            car: {
                relation: Model.BelongsToOneRelation,
                modelClass: Car,
                join: {
                    to: 'cars.id',
                    from: 'photos.car_id'
                }
            }
        };
    }

}

module.exports = Photo;