import { defineAbility } from '@casl/ability'

const caslUtils = require('./utils')

export default (role) => defineAbility((can) => {
  const _role = role || 0
  // by default
  can('do', 'as_not_registered')

  if (_role >= caslUtils.LEVEL_REGISTERED) {
    can('do', 'as_registered')
  }

  if (_role >= caslUtils.LEVEL_1C) {
    can('do', 'as_1c')
  }

  if (_role >= caslUtils.LEVEL_KPP) {
    can('do', 'as_kpp')
  }

  if (_role >= caslUtils.LEVEL_ADMIN) {
    can('do', 'as_admin')
  }
})
