import { defineStore } from 'pinia';
import { commonFormateDate } from '../../utils/common.js';
const roleAdmin = /^admin/;
const roleKpp = /^(admin|kpp)/;
const role1c = /^(admin|kpp|1c)/;
const roleRegistered = /^(admin|kpp|1c|registered)/;

export const useGlobalStore = defineStore('globals', {
    state: () => {
        return {
            user: {
                id: '',
                role: ''
            },
            car: {
                state: 'In',
                images: [],
                carID: '',
                forDate: commonFormateDate(),
            },
            camera: {
                isComponentOpen: false,
                isCameraOpen: false,
                isPhotoTaken: false,
                isShotPhoto: false,
                isLoading: false,
                link: '#',
                cameras: [],
                currentCamera: "None",
                initialized: false
            },
            showCamera: false,
            webServer: {
                dev: "http://localhost:8181/",
                prod: "???" //TODO: Fix prod server
            }
        }
    },
    actions: {
    },
    getters: {
        getWebServiceURL: (state) => '/', //state.webServer.dev,
        roleAsAdmin: (state) => {
            if (!state.user.role) { return false; }
            return roleAdmin.test(state.user.role);
        },
        roleAsKpp: (state) => {
            if (!state.user.role) { return false; }
            return roleKpp.test(state.user.role);
        },
        roleAs1c: (state) => {
            if (!state.user.role) { return false; }
            return role1c.test(state.user.role);;
        },
        roleAsRegistered: (state) => {
            if (!state.user.role) { return false; }
            return roleRegistered.test(state.user.role);
        }
    },
})