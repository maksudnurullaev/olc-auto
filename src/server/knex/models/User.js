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
                relation: Model.ManyToManyRelation,
                modelClass: Roles,
                join: {
                    from: 'user_roles.id',
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

module.exports = User;
