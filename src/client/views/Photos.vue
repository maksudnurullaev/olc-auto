<template>
  <splitpanes class="default-theme">
    <pane size="35">
      <strong>Поиск</strong>
      <StickyBar1 />
      <div class="buttons" v-if="globals.cars.length && !globals.camera.isComponentOpen">
        <button @click="setCarID(car)" v-for="car in globals.cars">{{ car }}</button>
      </div>
    </pane>
    <pane size="65">
        <strong>Идентификационный номер приема: {{ globals.car.current_number }}</strong>
        <StickyBar2 />
        <WebCam2 v-if="globals.camera.isComponentOpen" />
        <CarInOutInfo v-else />
        <div id="container" v-if="globals.car.infoCurrentId">
          <image-thumbnails :photos="globals.car.photos" v-if="globals.car.photos.length"/>
        </div>
         <div v-else-if="!globals.car.current_number" class="center"><h3>Необходимо выполнить поиск и выбрать номер машины!</h3></div>
         <pre v-if="globals.debugMode">
          {{ globals }}
         </pre>
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
import { wsGetCarInfosByDates, wsGetCarInfosForDate } from "../axios/ws";
import { ymdFormateDate } from "../../utils/common";

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

import { useRoute } from 'vue-router';
const route = useRoute(); 

import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  // wsCheckLogin(globals);
  globals.car.current_number = route.params.receptionId || '';                      //|| ''; // 'test';
  if( globals.car.current_number ){
    setCarID(globals.car.current_number);
  }
  console.warn("route.query['receptionId']: " + route.params.receptionId );    //['receptionId']);
});

function setCarID(car) {
  globals.car.current_number = car;
  globals.car.forDate = ymdFormateDate();
  wsGetCarInfosByDates(globals);
  // reset old data
  // globals.car.infos = [];
  // globals.car.photos = [];
}

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
  border: 3px solid red;
  text-align: center;
}
</style>
