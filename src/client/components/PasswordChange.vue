<template>
    <div class="content">
        <fieldset>
            <legend>Смена пароля:</legend>
            <!-- Login Form -->
            <form @submit.prevent="changePassword">
                <input type="password" id="password" placeholder="Пароль" v-model="userData.password1">&nbsp;<img
                    src="../assets/icons/correct.png" v-if="validPasswordLength()" /><br />
                <input type="password" id="password" placeholder="Подтверждение пароля"
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

// const sendGetRequest = async () => {
//     try {
//         const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
//         console.log(resp.data);
//     } catch (err) {
//         // Handle Error Here
//         console.error(err);
//     }
// };

function changePassword() {
    console.log('Change password!');
    if (!validPasswords()) {
        alert('Некорретные данные!');
        return;
    }
    // async () => {
    // try {
    wsChangePassword({ password: userData.password1 }, globals).then((response) => {
        if (response.data.result) {
            userData.password1 = '';
            userData.password2 = '';
        }
        alert(response.data.message)
    });
    // } catch (err) {
    //     console.error(err);
    // }
    // }
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