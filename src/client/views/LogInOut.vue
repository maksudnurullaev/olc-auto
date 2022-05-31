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
        <div style="margin-left: 10px;">
          <p>
            <u>Текущий пользователь:</u> <strong>{{ globals.user.id }}</strong>
          </p>
          <p>
            <u>Роль:</u> <strong>{{ globals.user.role }}</strong>
          </p>
          <input type="submit" style="padding: 5px 10px" @click="logout" value="Выход">
          <hr />
          <input type="submit" style="padding: 5px 10px" value="Смена пароля">
          <hr />
          <input type="submit" style="padding: 5px 10px" value="Отчеты">
        </div>
  </template>
  <template v-else>
    <login />
  </template>
</template>
