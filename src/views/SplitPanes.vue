<template>
  <splitpanes class="default-theme">
    <pane size="35">
      <strong>Номер авто</strong>
      <sticky-bar-1 />
    </pane>
    <pane size="65">
      <strong>Фотограции</strong>
      <sticky-bar-2 />
      <web-cam />
      <image-thumbnails />
    </pane>
  </splitpanes>
</template>

<script setup >

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import ImageThumbnailsVue from "../components/ImageThumbnails.vue";
import StickyBar1 from "../components/StickyBar1.vue";
import StickyBar2 from "../components/StickyBar2.vue";
import WebCam from "../components/WebCam.vue";
import ImageThumbnails from "../components/ImageThumbnails.vue"

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();


</script>

<style scoped>
.splitpanes__pane {
  overflow: auto;
}
</style>
