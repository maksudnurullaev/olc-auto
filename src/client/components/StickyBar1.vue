<template>
    <div class="sticky">
        <input type="text" v-model="globals.car.carID" @keyup="uppercase" placeholder="Номер авто" />
        <input type="submit" value="Обновить" @click="updateCar" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { wsGetCarImages } from '../components/js/axiosws';
import { useGlobalStore } from '../stores/globals';


const globals = useGlobalStore();

function uppercase() {
    if (globals.car.carID) {
        globals.car.carID = globals.car.carID.toUpperCase().replace(/[^0-9A-Z]/gi, '');
    }
}

function updateCar(){
    wsGetCarImages(globals);
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>