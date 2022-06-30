<template>
    <div class="content">
        <fieldset>
            <legend>Настройки КПП(контрольно-пропускных пунктов):</legend>
            <ul v-if="configOrgs.orgs">
                <li v-for="(org, orgKey) in configOrgs.orgs">
                    {{ org.description }}
                    <ul v-if="org.kpps">
                        <li v-for="(kpp, kppKey) in org.kpps">
                            <input type="radio" :value="kppKey" v-model="globals.location.kpp"
                                @click="globals.location.org = orgKey" :id="[orgKey, kppKey].join('-')" />
                            <label :for="[orgKey, kppKey].join('-')">{{ kpp.description }}</label>
                            <ul v-if="kpp.cameras">
                                <li v-for="(camera, cameraKey) in kpp.cameras">
                                    [<a href="#" @click.prevent="getTestImage(orgKey, kppKey, cameraKey)">Тест</a>]
                                    {{ camera.description }}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
            <!-- <pre>
            {{ globals.location.org }} - {{ globals.location.kpp }}
            </pre> -->
        </fieldset>
        <fieldset v-if="resources.imgSrc">
            <legend>Тестирование:</legend>
            <img :src="resources.imgSrc" height="250" />
        </fieldset>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import configOrgs from '../../utils/Organizations.json'
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

const resources = reactive({ imgSrc: "" })
// const subView = reactive({ id: 'list' });

// function selectKpp(kpp){
//     globals.location.kpp = kpp
// }

function getTestImage(org, kpp, camera) {
    const url = `getStreetCameraImageV2/${org}/${kpp}/${camera}/`
    // const url = `getStreetCameraImageV2/ORG/kpp/camera/`
    console.log("Get test image from:", url)
    axios.post(globals.getWebServiceURL + url).then((response) => {
        if (response.data.result) {
            console.log(response.data.message);
            resources.imgSrc = response.data.message
        } else {
            resources.imgSrc = ""
            console.log(response.data.message);
        }
    });
}

</script>

<style scoped>
@import url("../assets/css/main.content.css");
</style>