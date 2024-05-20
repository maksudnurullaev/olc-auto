<template>
    <div class="sticky">
        <input type="text" v-model="globals.carSearchNumber" @input="uppercase" placeholder="Поиск"
            v-on:keyup.enter="findCars" />
        <input type="submit" value="Поиск" @click="findCars" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { ymdFormateDate } from '../../utils/common';
import { wsGetCarInfosDates, wsGetCarInfos4Date } from '../axios/ws';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function uppercase() {
    if (globals.carSearchNumber) {
        globals.carSearchNumber = globals.carSearchNumber.toUpperCase().replace(/[^0-9A-Z]/gi, '');
    }
}

function findCars() {
    if (!globals.carSearchNumber) {
        alert('Нет номера авто!')
        return
    }

    let urLike = 'cars/like/' + globals.carSearchNumber
    axios.post(globals.getWebServiceURL + urLike).then((response) => {
        if (response.data.result && response.data.cars && response.data.cars.length) {
            globals.cars = [] // update global cars if found 
            const cars = response.data.cars
            for (let index = 0; index < cars.length; index++) {
                const car = cars[index]
                globals.cars.push(car.number)
            }
        } else {
            console.warn(response.data.message);
            if (globals.carSearchNumber.length > 4) {
                globals.car.current_number = globals.carSearchNumber;
                // globals.car.current_number = car;
                globals.car.forDate = ymdFormateDate();
                wsGetCarInfosDates(globals);
                //wsGetCarInfos4Date(globals);
            }
        }
    })

    // }
}

</script>

<style scoped>
@import '../assets/css/sticky.css';
</style>