import defineAbilityFor from '../../casl/defineAbility';

const caslUtils = require("../../casl/utils")
const abilityDefault = defineAbilityFor(caslUtils.LEVEL_NOT_REGISTERED);
const abilityRegistered = defineAbilityFor(caslUtils.LEVEL_REGISTERED);
const abilityAs1C = defineAbilityFor(caslUtils.LEVEL_1C);
const abilityAsKpp = defineAbilityFor(caslUtils.LEVEL_KPP);
const abilityAsAdmin = defineAbilityFor(caslUtils.LEVEL_ADMIN);

describe("Test casl:", () => {
    test(" ... as not registered", () => {
        expect(abilityDefault.can('do', 'as_not_registered')).toEqual(true);
        expect(abilityDefault.can('do', 'as_registered')).toEqual(false);
    })
    test(" ... as registered", () => {
        expect(abilityRegistered.can('do', 'as_not_registered')).toEqual(true);
        expect(abilityRegistered.can('do', 'as_registered')).toEqual(true);
        expect(abilityRegistered.can('do', 'as_1c')).toEqual(false);
    })
    test(" ... as 1C operator", () => {
        expect(abilityAs1C.can('do', 'as_not_registered')).toEqual(true);
        expect(abilityAs1C.can('do', 'as_registered')).toEqual(true);
        expect(abilityAs1C.can('do', 'as_1c')).toEqual(true);
        expect(abilityAs1C.can('do', 'as_kpp')).toEqual(false);
    })
    test(" ... as KPP operator", () => {
        expect(abilityAsKpp.can('do', 'as_not_registered')).toEqual(true);
        expect(abilityAsKpp.can('do', 'as_registered')).toEqual(true);
        expect(abilityAsKpp.can('do', 'as_1c')).toEqual(true);
        expect(abilityAsKpp.can('do', 'as_kpp')).toEqual(true);
        expect(abilityAsKpp.can('do', 'as_admin')).toEqual(false);
    })
    test(" ... as Administrator", () => {
        expect(abilityAsAdmin.can('do', 'as_not_registered')).toEqual(true);
        expect(abilityAsAdmin.can('do', 'as_registered')).toEqual(true);
        expect(abilityAsAdmin.can('do', 'as_1c')).toEqual(true);
        expect(abilityAsAdmin.can('do', 'as_kpp')).toEqual(true);
        expect(abilityAsAdmin.can('do', 'as_admin')).toEqual(true);
    })
})
