<template>
    <div class="sticky">
        <input type="radio" id="AutoIn" name="inOrOut" v-model="globals.car.state" value="In" checked="true" /><label
            for="AutoIn">Въезд</label>
        <input type="radio" id="AutoOut" name="inOrOut" v-model="globals.car.state" value="Out" /><label
            for="AutoOut">Выезд</label>
        | Камеры:
        <input type="submit" value="Въезда" @click="getOutCameraImage('192.168.4.150')" v-if="globals.car.state == 'In'" />
        <input type="submit" value="Выезда" @click="getOutCameraImage('192.168.4.151')" v-if="globals.car.state == 'Out'" />
        <input type="submit" @click="switchCamera" :value="getCameraBtnTitle()" />
        |
        История:
        <select name="History" v-model="globals.car.forDate">
            <option :value="commonFormateDate()">Сегодня</option>
        </select>
    </div>
</template>

<script setup>
import { commonFormateDate } from '../../utils/common.js';
import { wsGetCameraImage } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function switchCamera() {
    globals.$patch({ camera: { isComponentOpen: !globals.camera.isComponentOpen } });
    // globals.camera.isComponentOpen = !globals.camera.isComponentOpen;
    console.log("Show camera component: " + globals.camera.isComponentOpen);
}

function getCameraBtnTitle() {
    return (globals.camera.isComponentOpen ? 'Выкл.' : 'Вкл.') + " камеру планшета";
}

function getOutCameraImage(ip){
    wsGetCameraImage(ip, globals);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>