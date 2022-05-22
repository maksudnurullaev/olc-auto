import { defineStore } from 'pinia';
import { commonFormateDate } from '../../utils/common.js';
export const useGlobalStore = defineStore('globals', {
    state: () => {
        return {
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
                cameras: {}
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
        getWebServiceURL: (state) => state.webServer.dev,
    },
})