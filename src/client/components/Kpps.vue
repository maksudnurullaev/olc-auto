<template>
    <div class="content">
        <fieldset>
            <legend>Настройки КПП(контрольно-пропускных пунктов):</legend>
            <ul v-if="configOrgs.orgs">
                <li v-for="(org, orgKey) in configOrgs.orgs">
                    {{ org.description }}
                    <ul v-if="org.kpps">
                        <li v-for="(kpp, kppKey) in org.kpps">
                            {{ kpp.description }}
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
            {{ configOrgs }}
            </pre> -->
        </fieldset>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import configOrgs from '../../utils/Organizations.json'
// import UsersList from './UsersList.vue';
// import UsersAdd from './UsersAdd.vue';

const subView = reactive({ id: 'list' });

function getTestImage(org, kpp, camera) {
    console.log("Get test image for:", org, kpp, camera)
}

</script>

<style scoped>
@import url("../assets/css/main.content.css");
</style>