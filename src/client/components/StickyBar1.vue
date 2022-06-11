<template>
    <div class="sticky">
        <input type="text" v-model="globals.car.search_number" @input="uppercase" placeholder="Номер авто" />
        <input type="submit" value="Поиск" @click="updateCar" />
    </div>
</template>

<script setup>
import { wsGetCarInfosDates, wsGetCarInfos4Date } from '../axios/ws';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function uppercase() {
    if (globals.car.search_number) {
        globals.car.search_number = globals.car.search_number.toUpperCase().replace(/[^0-9A-Z]/gi, '');
    }
}

function updateCar() {
    globals.car.current_number = globals.car.search_number;
    wsGetCarInfosDates(globals);
    wsGetCarInfos4Date(globals);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>