<template>
  <div class="f-container fixed-hf">
      <header> MyVet.Uz | Photos</header>
    <div class="main">
      <router-view />
    </div>
    <footer>
      <span @click="showHideSearchPanel">&copy; {{ new Date().getFullYear() }} - NMK, All rights reserved</span>
    </footer>
  </div>
</template>

<style scoped>
@import url("./assets/css/main.css");

header h1 {
  background-image: linear-gradient(to left, #553c9a, #b393d3);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
</style>

<script setup>
import { useGlobalStore } from './stores/globals';
const globals = useGlobalStore();

function showHideSearchPanel() {
  globals.showSearchPanel = !globals.showSearchPanel;
  // alert(globals.showSearchPanel);
};
</script>