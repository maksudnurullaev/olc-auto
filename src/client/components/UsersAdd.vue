<template>
    <div class="content">
        <fieldset>
            <legend>Добавить пользователя:</legend>
            <input type="text" placeholder="Имя пользователя" v-model="userData.id" />&nbsp;<img
                src="../assets/icons/correct.png" v-if="validUserId()" /><br />
            <input type="password" id="password1" placeholder="Пароль" v-model="userData.password1">&nbsp;<img
                src="../assets/icons/correct.png" v-if="validPasswordLength()" /><br />
            <input type="password" id="password2" placeholder="Подтверждение пароля"
                v-model="userData.password2">&nbsp;<img src="../assets/icons/correct.png"
                v-if="validPasswords()" /><br />
            <input type="text" placeholder="Телефон" v-model="userData.phone" @input="acceptNumber" /><br />
            Описание:<br />
            <textarea id="w3review" name="w3review" rows="4" cols="50" v-model="userData.description"></textarea><br />
            <input v-if="validAll()" type="submit" value="Добавить пользователя" @click="addUser()">
        </fieldset>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { wsAddUser } from '../axios/ws';

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

const userData = reactive({ id: '', password1: '', password2: '', phone: '', description: '' });

function addUser() {
    if (!validAll()) {
        alert('Некорретные данные!');
        return;
    }
    let _userData = { id: userData.id, password: userData.password1 };
    if (userData.phone) {
        _userData.phone = userData.phone;
    }
    if (userData.description) {
        _userData.description = userData.description;
    }
    wsAddUser(_userData, globals).then((response) => {
        // if (response.data.result) {
        //     userData.id = '';
        //     userData.password2 = '';
        //     userData.password1 = '';
        //     userData.phone = '';
        //     userData.description = '';
        // }
        alert(response.data.message)
    });
}

function acceptNumber() {
    var x = userData.phone.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
    userData.phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
}

function validUserId() {
    return userData.id.trim().length >= 6;
}

function validPasswordLength() {
    return userData.password1.trim().length >= 6;
}

function validPasswords() {
    return validPasswordLength() && (userData.password1.trim() === userData.password2)
}

function validAll() {
    return validPasswords() && validUserId();
}

</script>

<style scoped>
@import url("../assets/css/main.content.css");
</style>