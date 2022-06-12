<template>
  <splitpanes class="default-theme">
    <pane size="35">
      <strong>Номер авто</strong>
      <sticky-bar-1 />
      <div class="buttons" v-if="globals.cars.length">
        <button @click="setCarID(car)" v-for="car in globals.cars">{{ car }}</button>
      </div>
      <pre name="4debugger">
  globals.car.current_number: {{ globals.car.current_number }} 
  globals.car.forDate: {{ globals.car.forDate }} 
  globals.car.infoCurrentId: {{ globals.car.infoCurrentId }} 
  globals.car.infos.length: {{ globals.car.infos.length }} 
  globals.car.infosByDates.length: {{ globals.car.infosByDates.length }} 
      </pre>
      <div>
        <ul>
          <li v-for="[n,v] in Object.entries(globals.car.infoCurrent)">{{ n }}: {{ v ? v.toString().trim().length : 0 }}</li>
        </ul>
      </div>
    </pane>
    <pane size="65">
      <template v-if="globals.car.current_number">
        <strong>Данные по грузу и авто №: {{ globals.car.current_number }}</strong>
        <sticky-bar-2 />
        <template v-if="globals.roleAsKpp">
          <web-cam-2 v-if="globals.camera.isComponentOpen" />
          <CarInOutInfo v-else />
        </template>
        <image-thumbnails />
      </template>
      <div class="center" v-else>
        <h3>Необходимо выбрать номер машины или выполнить поиск!</h3>
      </div>
    </pane>
  </splitpanes>
</template>

<script setup >

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import StickyBar1 from "../components/StickyBar1.vue";
import StickyBar2 from "../components/StickyBar2.vue";
import WebCam2 from "../components/WebCam2.vue";
import CarInOutInfo from "../components/CarInOutInfo.vue";
import ImageThumbnails from "../components/ImageThumbnails.vue"

import { useGlobalStore } from '../stores/globals';
import { onMounted } from "vue";
import axios from "axios";
import { wsGetCarInfosDates, wsGetCarInfos4Date } from "../axios/ws";
import { commonFormateDate } from "../../utils/common";
const globals = useGlobalStore();

function setCarID(car) {
  globals.car.current_number = car;
  globals.car.forDate = commonFormateDate();
  wsGetCarInfosDates(globals);
  wsGetCarInfos4Date(globals);
}

function updateCarList() {
  const filter = {
    "select": ["number"]
  }

  axios.post('/cars', filter).then((response) => {
    const cars = response.data.cars;
    for (let index = 0; index < cars.length; index++) {
      const car = cars[index];
      globals.cars.push(car.number)

    }
    // console.log(cars);
  });
};

onMounted(() => {
  if (!globals.cars.length) {
    updateCarList();
  }
})

</script>

<style scoped>
.splitpanes__pane {
  overflow: auto;
}

button {
  margin-right: 3px;
  margin-top: 3px;
}

.buttons {
  padding-left: 3px;
}

.center {
  margin: 10px 10px;
  padding: 10px 10px;
  border: 3px solid green;
  text-align: center;
}
</style>
