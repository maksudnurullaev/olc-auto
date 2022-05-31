<template>
  <div class="f-container fixed-hf">
    <header v-if="globals.user.id">
      <router-link to="/">Настройки</router-link>
      <router-link to="/kpp">Контроль на КПП</router-link>
    </header>
    <header v-else>
      <h1>Система котроля транспорта на КПП</h1>
    </header>
    <div class="main">
      <router-view />
    </div>
    <footer>
      <a href="http://www.olc.uz" target="_blank">&copy; {{ new Date().getFullYear() }} - ТЛЦ «Orient Logistics
        Center»</a>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { wsCheckLogin } from './axios/ws';
import { useGlobalStore } from './stores/globals';
const globals = useGlobalStore();

onBeforeMount(() => {
  wsCheckLogin(globals);
});

</script>

<style scoped>
@import url("./assets/css/main.css");

header h1 {
  background-image: linear-gradient(to left, #553c9a, #b393d3);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
</style>