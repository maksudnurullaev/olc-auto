<template>
    <div class="content">
        <fieldset>
            <legend>Список пользователей:</legend>
            <button @click="updateList()">Загрузить список пользователей</button>
            <ul v-for="(user, userIndex) in resources.users">
                <li><strong>{{ user.id }}</strong></li>
                <ul>
                    <li v-if="user.roles[0]"><strong>Роль:</strong> {{ user.roles[0].desc }}</li>
                    <li v-if="user.phone"><strong>Мобильный номер:</strong> {{ user.phone }}</li>
                    <li v-if="user.description"><strong>Описание:</strong> {{ user.description }}</li>
                    <li v-if="userIndex != resources.editUserIndex"><button
                            @click="editUser(userIndex)">Редактировать</button></li>
                </ul>
                <template v-if="resources.editUserIndex == userIndex">

                    <fieldset>
                        <legend>Данные пользователя:</legend>
                        <template v-if="userData.id != 'admin'">
                            <input type="text" placeholder="Имя пользователя" v-model="userData.id"
                                :read_only="userData.id == 'admin'" />&nbsp;<img src="../assets/icons/correct.png"
                                v-if="validUserId()" /><br />
                            <input type="password" id="password1" placeholder="Пароль"
                                v-model="userData.password1">&nbsp;<img src="../assets/icons/correct.png"
                                v-if="validPasswordLength()" /><br />
                            <input type="password" id="password2" placeholder="Подтверждение пароля"
                                v-model="userData.password2">&nbsp;<img src="../assets/icons/correct.png"
                                v-if="validPasswords()" /><br />
                        </template>
                        <input type="text" placeholder="Телефон" v-model="userData.phone" @input="acceptNumber" /><br />
                        Описание:<br />
                        <textarea id="w3review" name="w3review" rows="4" cols="50"
                            v-model="userData.description"></textarea><br />
                        <input v-if="validAll(user.id)" type="submit" value="Обновить"
                            @click="updateUser(user.id, userIndex)">
                        <button @click="editUser(-1)">Отмена</button>
                    </fieldset>

                </template>
            </ul>
        </fieldset>
    </div>
</template>

<script setup>

import { reactive } from 'vue';
import { wsGetAllUsers, wsUpdateUser } from '../axios/ws';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();
const resources = reactive({ users: [], editUserIndex: -1 });
const userData = reactive({ id: '', password1: '', password2: '', phone: '', description: '', rowid: '' });

function editUser(userIndex) {
    if (userIndex != -1) {
        resources.editUserIndex = userIndex;
        setUserData(resources.users[userIndex]);
    }
    else {
        resources.editUserIndex = -1;
        setUserData();
    }
}

function setUserData(user) {
    if (!user) {
        userData.id = '';
        userData.password2 = '';
        userData.password1 = '';
        userData.phone = '';
        userData.description = '';
        userData.rowid = '';
    } else {
        userData.id = user.id;
        userData.password2 = '';
        userData.password1 = '';
        userData.phone = user.phone || '';
        userData.description = user.description || '';
        userData.rowid = user.rowid;
    }
}

function updateList() {
    wsGetAllUsers(globals, resources);
};

function acceptNumber() {
    var x = userData.phone.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
    userData.phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
}

function validUserId() {
    if (userData.id.trim().length < 6) {
        return false;
    }
    for (let index = 0; index < resources.users.length; index++) {
        const user = resources.users[index];
        if (user.rowid != userData.rowid && user.id == userData.id) {
            console.warn("Пользователь [" + user.id + "] в базе уже существует!");
            return false;
        }
    }
    return true;
}

function validPasswordLength() {
    return userData.password1.trim().length >= 6;
}

function validPasswords() {
    return validPasswordLength() && (userData.password1.trim() === userData.password2)
}

function validAll(userId) {
    if (userId == 'admin') {
        return true;
    }
    if (userData.password1 || userData.password2) {
        return validPasswords() && validUserId();
    }
    return validUserId();
}

function updateUser(userId, userIndex) {
    if (!validAll(userId)) {
        alert('Некорретные данные!');
        return;
    }

    let oldUser = resources.users[resources.editUserIndex];
    let _userData = { rowid: oldUser.rowid }

    if (userData.password1) {
        _userData.password = userData.password1;
        _userData.id = userData.id;
    }

    if (oldUser.phone != userData.phone) {
        _userData.phone = userData.phone;
    }

    if (oldUser.description != userData.description) {
        _userData.description = userData.description;
    }

    wsUpdateUser(_userData, globals).then((response) => {
        if (response.data.result) {
            let newUser = response.data.user[0];
            resources.users[userIndex].id = newUser.id;
            resources.users[userIndex].phone = newUser.phone;
            resources.users[userIndex].description = newUser.description;
            // clear password fields
            userData.password1 = '';
            userData.password2 = '';
        }
        alert(response.data.message)
    });
}

</script>

<style scoped>
@import url("../assets/css/main.content.css");
</style>