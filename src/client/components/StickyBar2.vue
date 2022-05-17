<template>
    <div class="sticky">
        <input type="radio" id="AutoIn" name="inOrOut" v-model="globals.car.state" value="In" checked="true" /><label
            for="AutoIn">Въезд</label>
        <input type="radio" id="AutoOut" name="inOrOut" v-model="globals.car.state" value="Out" /><label
            for="AutoOut">Выезд</label>
        | Камеры:
        <input type="submit" value="Въезда" v-if="globals.car.state == 'In'"/>
        <input type="submit" value="Выезда" v-if="globals.car.state == 'Out'"/>
        <input type="submit" @click="switchCamera" value="Устройства" />
        |
        История:
        <select name="History" v-model="globals.car.forDate">
            <option value="_today" selected="true">Сегодня</option>
            <!-- option :value="utils.formateDate()" selected="true">Сегодня</option -->
        </select>
    </div>
</template>

<script setup>
// import { ref } from 'vue';
// import { formateDate } from './js/utils';

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();
// const utils = require('../src/components/js/utils.js');


function switchCamera() {
    globals.$patch({ camera: { isComponentOpen: !globals.camera.isComponentOpen } });
    // globals.camera.isComponentOpen = !globals.camera.isComponentOpen;
    console.log("Show camera component: " + globals.camera.isComponentOpen);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>