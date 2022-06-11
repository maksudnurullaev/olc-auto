<template>
    <div class="sticky">
        <template v-if="globals.roleAsKpp">
            <input type="submit" @click="switchCamera" v-if="globals.roleAsKpp" :value="getCameraBtnTitle()" />
            |
            История ({{ globals.car.infosByDates.length }}):
            <select v-model="globals.car.forDate" @change="showCarInfos4Date()">
                <option :value="commonFormateDate()">Сегодня ({{ todayInfos() }})</option>
                <template v-for="carInfoDate in globals.car.infosByDates">
                    <option v-if="carInfoDate.date_ymd != commonFormateDate()" :value="carInfoDate.date_ymd">
                        {{ carInfoDate.date_ymd }} ({{ carInfoDate.records }})
                    </option>
                </template>
            </select> <!-- button @click="showCarInfos4Date()">Показать</button -->
            <template v-if="globals.camera.isComponentOpen">
                |
                <input type="radio" id="AutoIn" name="inOrOut" v-model="globals.car.state" value="In"
                    checked="true" /><label for="AutoIn">Въезд</label>
                <input type="radio" id="AutoOut" name="inOrOut" v-model="globals.car.state" value="Out" /><label
                    for="AutoOut">Выезд</label>
                | Камеры:
                <input type="submit" value="Въезда" @click="getOutCameraImage('192.168.4.150')"
                    v-if="globals.car.state == 'In'" />
                <input type="submit" value="Выезда" @click="getOutCameraImage('192.168.4.151')"
                    v-if="globals.car.state == 'Out'" />
            </template>
        </template>
    </div>
</template>

<script setup>
import { commonFormateDate } from '../../utils/common.js';
import { wsGetCameraImage, wsGetCarInfos4Date } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function showCarInfos4Date() {
    wsGetCarInfos4Date(globals);
}

function todayInfos() {
    let _today = commonFormateDate();
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
    return (globals.camera.isComponentOpen ? 'Офомление' : 'Фотографии');
}

function getOutCameraImage(ip) {
    wsGetCameraImage(ip, globals);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>