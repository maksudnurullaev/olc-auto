const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class InOutInfo extends Model {
    static get tableName() {
        return 'in_out_infos';
    }

    static get relationMappings(){
        const Photos = require('./Photo');

        return {
            photos: {
                relation: Model.HasManyRelation,
                modelClass: Photos,
                join: {
                    from: 'in_out_infos.id',
                    to: 'photos.in_out_infos_id'
                }
            }
        };
    }
}

module.exports = InOutInfo;
