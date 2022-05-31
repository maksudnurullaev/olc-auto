const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class UserRoles extends Model {
    static get tableName(){
        return 'user_roles';
    }

    static get relationMappings(){
        const Roles = require('./UserRoles');

        return {
            car: {
                relation: Model.BelongsToOneRelation,
                modelClass: Roles,
                join: {
                    to: 'users.id',
                    from: 'user_roles.user_id'
                }
            }
        };
    }

}

module.exports = UserRoles;