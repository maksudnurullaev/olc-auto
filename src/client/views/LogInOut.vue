<script setup>
import { reactive } from 'vue';
import Login from "../components/Login.vue";
import { wsLogout } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';
import PasswordChange from '../components/PasswordChange.vue';
import Reports from '../components/Reports.vue';
import Users from '../components/Users.vue';
const globals = useGlobalStore();
const subView = reactive({ id: 'passwordChange' });

function logout() {
  wsLogout(globals);
}

function isClass(id) {
  return subView.id == id;
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
        <input type="submit" style="padding: 5px 10px" @click="subView.id = 'passwordChange'"
          :class="{ selected: isClass('passwordChange') }" v-if="globals.roleAsRegistered" value="Смена пароля">
        <input type="submit" style="padding: 5px 10px" @click="subView.id = 'reports'"
          :class="{ selected: isClass('reports') }" v-if="globals.roleAs1c" value="Отчеты">
        <input type="submit" style="padding: 5px 10px" v-if="globals.roleAsAdmin" @click="subView.id = 'users'"
          :class="{ selected: isClass('users') }" value="Пользователи">
      </fieldset>
    </div>
    <div class="content subview">
      <password-change v-if="subView.id == 'passwordChange' && globals.roleAsRegistered" />
      <reports v-else-if="subView.id == 'reports' && globals.roleAs1c" />
      <users v-else-if="subView.id == 'users' && globals.roleAsAdmin" />
    </div>
  </template>
  <template v-else>
    <login />
  </template>
</template>

<style scoped>
@import url("../assets/css/main.content.css");
</style>