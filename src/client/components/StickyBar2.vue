<template>
    <div class="sticky">
        Режим
        <input :disabled="!globals.roleAsKpp || !globals.car.infoCurrentId" type="submit" @click="switchCamera" :value="getCameraBtnTitle()" />
        |
        <template v-if="globals.camera.isComponentOpen">
            Камеры/Режим:
            <input type="radio" id="AutoIn" name="inOrOut" v-model="globals.car.state" value="In"
                checked="true" /><label for="AutoIn">Въезд</label>
            <input type="radio" id="AutoOut" name="inOrOut" v-model="globals.car.state" value="Out" /><label
                for="AutoOut">Выезд</label>
            <input type="submit" value="Фото" style="margin-left: 6px;" @click="getStreetCameraImage('192.168.4.150')"
                v-if="globals.car.state == 'In'" />
            <input type="submit" value="Фото" style="margin-left: 6px;" @click="getStreetCameraImage('192.168.4.151')"
                v-if="globals.car.state == 'Out'" />
        </template>
        <template v-else>
            История ({{ globals.car.infosByDates.length }}):
            <select v-model="globals.car.forDate" @change="showCarInfos4Date()">
                <option :value="ymdFormateDate()">Сегодня ({{ todayInfos() }})</option>
                <template v-for="carInfoDate in globals.car.infosByDates">
                    <option v-if="carInfoDate.date_ymd != ymdFormateDate()" :value="carInfoDate.date_ymd">
                        {{ carInfoDate.date_ymd }} ({{ carInfoDate.records }})
                    </option>
                </template>
            </select>
        </template>
    </div>
</template>

<script setup>
import { ymdFormateDate } from '../../utils/common.js';
import { wsGetStreetCameraImage, wsGetCarInfos4Date } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function showCarInfos4Date() {
    wsGetCarInfos4Date(globals);
}

function todayInfos() {
    let _today = ymdFormateDate();
    for (let index = 0; index < globals.car.infosByDates.length; index++) {
        const infoDate = globals.car.infosByDates[index];
        if (infoDate.date_ymd == _today) {
            return infoDate.records;
        }
    }
    return 0;
}

function switchCamera() {
    globals.$patch({ camera: { isComponentOpen: !globals.camera.isComponentOpen } });
    // globals.camera.isComponentOpen = !globals.camera.isComponentOpen;
    console.log("Show camera component: " + globals.camera.isComponentOpen);
}

function getCameraBtnTitle() {
    return (globals.camera.isComponentOpen ? 'Данные' : 'Камеры');
}

function getStreetCameraImage(ip) {
    wsGetStreetCameraImage(ip, globals);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>