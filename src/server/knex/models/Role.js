const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class UserRoles extends Model {
    static get tableName(){
        return 'roles';
    }

    static get relationMappings(){
        const User = require('./User');

        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'roles.id',
                    through: {
                        from: 'users_roles.roleId',
                        to: 'users_roles.userId'
                      },
                    to: 'users.id'
                }
            }
        };
    }
}

module.exports = UserRoles;