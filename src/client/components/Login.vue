<template>
    <div class="wrapper fadeInDown">
        <div id="formContent">
            <!-- Icon -->
            <div class="fadeIn first" style="margin-top: 10px;">
                <img src="../assets/icons/login.png" id="icon" alt="User Icon" />
            </div>

            <!-- Tabs Titles -->
            <h2 class="active">Вход</h2>
            <!-- Login Form -->
            <form @submit.prevent="login">
                <input type="text" id="login" class="fadeIn second" name="login" placeholder="Пользователь"
                    v-model="userData.id">
                <input type="password" id="password" class="fadeIn third" name="login" placeholder="Пароль"
                    v-model="userData.password">
                <input type="submit" class="fadeIn fourth" value="Вход">
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { wsLogin } from '../axios/ws.js';
import { useGlobalStore } from '../stores/globals';

const globals = useGlobalStore();
const userData = reactive({ id: '', password: '' });

function login() {
    userData.id = userData.id.trim();
    userData.password = userData.password.trim();
    if (!userData.id || !userData.password) {
        alert('Не заполнено поле пользователя или пароля!');
        return;
    }
    wsLogin(userData, globals);
}

</script>

<style scoped>
@import url("../assets/css/login.css");
</style>