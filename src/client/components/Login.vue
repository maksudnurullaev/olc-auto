<template>
    <div class="content">
        <fieldset>
            <legend>Вход</legend>
            <!-- Login Form -->
            <form @submit.prevent="login">
                <input type="text" id="login" class="fadeIn second" name="login" placeholder="Пользователь"
                    v-model="userData.id"><br />
                <input type="password" id="password" class="fadeIn third" name="login" placeholder="Пароль"
                    v-model="userData.password"><br />
                <input type="submit" class="fadeIn fourth" value="Вход">
            </form>
        </fieldset>
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
div.content input {
    margin-right: 3px;
    margin-top: 3px;
}
</style>