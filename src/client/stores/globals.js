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
                search_number: '',
                current_number: '',
                forDate: commonFormateDate(),
                infos: [],
                infosByDates: [],
                infoCurrentId: 0,
                infoCurrent: {
                    // mandatory fields to insert
                    car_number: null,
                    date_ymd: null,
                    ttype_id: 0,
                    code: "",
                    in_datetime: null,
                    // mandatory field to update
                    out_datetime: null,
                    // ... other fields
                    contragent: null,
                    driver_phone: null,
                    comment: null,
                    is_sent_to_1c: 0
                }
            },
            cars: [],
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
        setCarInfoID(id) {
            console.log('setCarInfoID:', id);
            this.car.infoCurrentId = id;
            if (!id) { return; }
            for (let index = 0; index < this.car.infos.length; index++) {
                const info = this.car.infos[index];
                if (info.id == id) {
                    this.car.infoCurrent = info;
                    return;
                }
            }
        },
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