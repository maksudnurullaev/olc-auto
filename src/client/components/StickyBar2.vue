<template>
    <div class="sticky">
        Перейти в режим:
        <input type="submit" @click="switchCamera" :value="getCameraBtnTitle()" />
        <template v-if="!globals.camera.isComponentOpen">
            |
            История ({{ globals.car.infosByDates.length }}):
            <select v-model="globals.car.forDate" @change="showCarInfos4Date()">
                <option :value="ymdFormateDate()">Сегодня ({{ todayInfos() }})</option>
                <template v-for="carInfoDate in globals.car.infosByDates">
                    <option v-if="carInfoDate.date_ymd != ymdFormateDate()" :value="carInfoDate.date_ymd">
                        {{ carInfoDate.date_ymd }} ({{ carInfoDate.records }})
                    </option>
                </template>
            </select> |
            <button @click="showCarInfos4Date()">Обновить</button>
        </template>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ymdFormateDate } from '../../utils/common.js';
import { wsGetStreetCameraImage, wsGetCarInfosForDate } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

onMounted(() => {
    if(globals.car.current_number){
        wsGetCarInfosForDate(globals);
    }
});

function isCameraModeDisabled() {
    return !globals.car.infoCurrentId
        || ymdFormateDate() !== globals.car.forDate;
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
    console.log("Show camera component: " + globals.camera.isComponentOpen);
}

function getCameraBtnTitle() {
    return (globals.camera.isComponentOpen ? 'просмотра' : 'камеры');
}

function getStreetCameraImage(ip) {
    wsGetStreetCameraImage(ip, globals);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>