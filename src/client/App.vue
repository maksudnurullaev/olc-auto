<template>
  <div class="f-container fixed-hf">
    <header v-if="globals.roleAsRegistered">
      <router-link to="/">Настройки/Отчеты</router-link>
      <router-link v-if="globals.location.kpp && globals.roleAs1c" to="/kpp">Контроль на КПП</router-link>
    </header>
    <header v-else>
      <h1>Система котроля транспорта на КПП</h1>
    </header>
    <div class="main">
      <router-view />
      <DebugShowUserAndRoles v-if="globals.debugMode" />
    </div>
    <footer>
      &copy; {{ new Date().getFullYear() }} - NMK, All rights reserved
    </footer>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { wsCheckLogin } from './axios/ws';
import DebugShowUserAndRoles from './components/debug/UserAndRoles.vue'

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