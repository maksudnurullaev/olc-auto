<template>
    <div class="content">
        <fieldset>
            <legend>Смена пароля:</legend>
            <!-- Login Form -->
            <form @submit.prevent="changePassword">
                <input type="password" id="password1" placeholder="Пароль" v-model="userData.password1">&nbsp;<img
                    src="../assets/icons/correct.png" v-if="validPasswordLength()" /><br />
                <input type="password" id="password2" placeholder="Подтверждение пароля"
                    v-model="userData.password2">&nbsp;<img src="../assets/icons/correct.png"
                    v-if="validPasswords()" /><br />
                <input v-if="validPasswords()" type="submit" value="Сменить пароль">
            </form>
        </fieldset>
    </div>
</template>

 <script setup>
import { reactive } from 'vue';
import { wsChangePassword } from '../axios/ws';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();
const userData = reactive({ password1: '', password2: '' });

function validPasswordLength() {
    return userData.password1.trim().length >= 6;
}

function validPasswords() {
    return validPasswordLength() && (userData.password1.trim() === userData.password2)
}

function changePassword() {
    console.log('Change password!');
    if (!validPasswords()) {
        alert('Некорретные данные!');
        return;
    }
    wsChangePassword({ userId: globals.user.id, newUserPassword: userData.password1 }, globals).then((response) => {
        if (response.data.result) {
            userData.password1 = '';
            userData.password2 = '';
        }
        alert(response.data.message)
    });
};
</script>

<style scoped>
div.content input {
    margin-right: 3px;
    margin-top: 3px;
}

div.content img {
    vertical-align: sub;
}
</style>