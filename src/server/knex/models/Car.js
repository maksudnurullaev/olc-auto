const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class Car extends Model {
    static get tableName(){
        return 'cars';
    }

    static get relationMappings(){
        const Photo = require('./Photo');

        return {
            photos: {
                relation: Model.HasManyRelation,
                modelClass: Photo,
                join: {
                    from: 'cars.id',
                    to: 'photos.car_id'
                }
            }
        };
    }
}

module.exports = Car;
