import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globals', {
    state: () => {
        return {
            car: {
                state: 'In',
                images: [],
            },
            showCamera: false,
            webServer: {
                dev: "http://localhost:8181/",
                prod: "???" //TODO: Fix prod server
            }
        }
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        addCarImage(imageUrl){
            this.car.images.push(imageUrl);
        },
    },
    getters: {
        getWebServiceURL: (state) => state.webServer.dev,
    },
})