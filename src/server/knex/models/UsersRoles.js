const knex = require('../knex');
const { Model } = require('objection');
Model.knex(knex);

class UsersRoles extends Model {
    static get tableName(){
        return 'users_roles';
    }

}
module.exports = UsersRoles;
