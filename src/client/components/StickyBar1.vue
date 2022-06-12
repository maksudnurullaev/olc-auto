<template>
    <div class="sticky">
        <input type="text" v-model="globals.car.search_number" @input="uppercase" placeholder="Номер авто" />
        <input type="submit" value="Поиск" @click="updateCar" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { wsGetCarInfosDates, wsGetCarInfos4Date } from '../axios/ws';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function uppercase() {
    if (globals.car.search_number) {
        globals.car.search_number = globals.car.search_number.toUpperCase().replace(/[^0-9A-Z]/gi, '');
    }
}

function updateCar() {
    // if (globals.car.search_number.length > 4) {
    //     wsGetCarInfosDates(globals);
    //     wsGetCarInfos4Date(globals);
    // } else {

    let urLike = 'cars/like/' + globals.car.search_number
    axios.post(globals.getWebServiceURL + urLike).then((response) => {
        if (response.data.result) {
            globals.cars = [] // clear cars array
            const cars = response.data.cars
            for (let index = 0; index < cars.length; index++) {
                const car = cars[index]
                globals.cars.push(car.number)
            }
        } else {
            console.warn(response.data.message)
            if (globals.car.search_number.length > 4) {
                globals.car.current_number = globals.car.search_number
                // globals.car.current_number = car;
                globals.car.forDate = ymdFormateDate();
                wsGetCarInfosDates(globals);
                wsGetCarInfos4Date(globals);
            }
        }
    })

    // }
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>