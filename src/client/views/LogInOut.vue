<script setup>
import { reactive } from 'vue';
import Login from "../components/Login.vue";
import { wsLogout } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
 import PasswordChange  from '../components/PasswordChange.vue';
import Reports from '../components/Reports.vue';
const globals = useGlobalStore();
// const userData = reactive({ id: '', password: '' });
const subView = reactive({ id: '' });

function logout() {
  wsLogout(globals);
}
</script>

<template>
  <template v-if="globals.user.id">
    <div class="content">
      <fieldset>
        <legend>Действия:</legend>
        <p>
          <u>Текущий пользователь:</u> <strong>{{ globals.user.id }}</strong>
        </p>
        <p>
          <u>Текущая роль:</u> <strong>{{ globals.user.role }}</strong>
        </p>
        <input type="submit" style="padding: 5px 10px" @click="logout" value="Выход">
        <input type="submit" style="padding: 5px 10px" @click="subView.id = 'passwordChange'" value="Смена пароля">
        <input type="submit" style="padding: 5px 10px" @click="subView.id = 'reports'" value="Отчеты">
      </fieldset>
    </div>
    <div v-if="subView.id" class="content subview">
      <password-change v-if="subView.id == 'passwordChange'" />
      <reports v-if="subView.id == 'reports'" />
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