const knex = require('../knex')
const { Model } = require('objection')
Model.knex(knex)

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get relationMappings () {
    const Role = require('./Role')

    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'users_roles.userId',
            to: 'users_roles.roleId'
          },
          to: 'roles.id'
        }
      }
    }
  }
}

module.exports = User
