const environment = (process.env.NODE_ENV || 'development').trim()
console.log('Knex environment:', environment)
const config = require('../../../knexfile.js')[environment]
module.exports = require('knex')(config)
