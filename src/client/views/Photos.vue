<template>
  <splitpanes class="default-theme">
    <pane size="35">
      <strong>Поиск</strong>
      <StickyBar1 />
      <div class="buttons" v-if="globals.cars.length && !globals.camera.isComponentOpen">
        <button @click="setCarID(car)" v-for="car in globals.cars">{{ car }}</button>
      </div>
      <div name="4debugger" v-if="globals.debugMode">
        <!-- Temporary removed all debug messages -->
      </div>
    </pane>
    <pane size="65">
        <strong>Информация: {{ globals.car.current_number }}</strong>
        <StickyBar2 />
        <WebCam2 v-if="globals.camera.isComponentOpen" />
        <CarInOutInfo v-else />
        <div id="container" v-if="globals.car.infoCurrentId">
          <image-thumbnails :photos="globals.car.photos" />
        </div>
         <div v-else-if="!globals.car.current_number" class="center"><h3>Необходимо выполнить поиск и выбрать номер машины!</h3></div>
         <pre v-if="globals.debugMode">
          {{ globals.car }}
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
import { wsGetCarInfosDates, wsGetCarInfos4Date } from "../axios/ws";
import { ymdFormateDate } from "../../utils/common";

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function setCarID(car) {
  globals.car.current_number = car;
  globals.car.forDate = ymdFormateDate();
  wsGetCarInfosDates(globals);
  //wsGetCarInfos4Date(globals);
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
