//const environment = (process.env.NODE_ENV || 'development').trim()
const utils = require('../../utils/utils.js')
const nodeMode = utils.getNodeMode()

console.info('Knex environment:', nodeMode)
const config = require('../../../knexfile.js')[nodeMode]
module.exports = require('knex')(config)
