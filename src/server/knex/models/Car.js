const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class Car extends Model {
    static get tableName(){
        return 'cars';
    }

    static get relationMappings(){
        const Infos = require('./InOutInfo');

        return {
            infos: {
                relation: Model.HasManyRelation,
                modelClass: Infos,
                join: {
                    from: 'cars.number',
                    to: 'in_out_infos.car_number'
                }
            }
        };
    }
}

module.exports = Car;
