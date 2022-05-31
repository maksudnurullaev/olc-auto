const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class User extends Model {
    static get tableName(){
        return 'users';
    }

    static get relationMappings(){
        const Roles = require('./UserRoles');

        return {
            roles: {
                relation: Model.HasManyRelation,
                modelClass: Roles,
                join: {
                    from: 'users.id',
                    to: 'user_roles.user_id'
                }
            }
        };
    }
}

module.exports = User;
