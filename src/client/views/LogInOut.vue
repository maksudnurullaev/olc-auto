<script setup>
import { reactive } from 'vue';
import Login from "../components/Login.vue";
import { wsLogout } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();
const userData = reactive({ id: '', password: '' });

function logout() {
  wsLogout(globals);
}
</script>

<template>
  <template v-if="globals.user.id">
    <div class="content">
      <fieldset>
        <legend>Авторизация</legend>
        <p>
          <u>Текущий пользователь:</u> <strong>{{ globals.user.id }}</strong>
        </p>
        <p>
          <u>Текущая роль:</u> <strong>{{ globals.user.role }}</strong>
        </p>
        <input type="submit" style="padding: 5px 10px" @click="logout" value="Выход">
        <input type="submit" style="padding: 5px 10px" value="Смена пароля">
      </fieldset>
    </div>
    <div class="content">
      <fieldset>
        <legend>Действия</legend>
        <input type="submit" style="padding: 5px 10px" value="Отчеты">
      </fieldset>
    </div>
  </template>
  <template v-else>
    <login />
  </template>
</template>

<style scoped>
div.content input {
  margin-right: 3px;
  margin-top: 3px;
}
</style>