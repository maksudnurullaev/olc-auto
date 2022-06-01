const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class UserRoles extends Model {
    static get tableName(){
        return 'user_roles';
    }

    static get relationMappings(){
        const User = require('./User');

        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'user.id',
                    through: {
                        from: 'users_roles.userId',
                        to: 'users_roles.roleId'
                      },
                    to: 'user_roles.id'
                }
            }
        };
    }
}

module.exports = UserRoles;