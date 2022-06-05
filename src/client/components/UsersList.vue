<template>
    <div class="content">
        <fieldset>
            <legend>Список пользователей:</legend>
            <ul v-for="user in resources.users">
                <li><strong>Пользователь:</strong> {{ user.id }}</li>
                <ul>
                    <li><button @click="editUser(user.id)">Редактировать</button></li>
                    <li v-if="user.roles[0]"><strong>Роль:</strong> {{ user.roles[0].desc }}</li>
                    <li v-if="user.description"><strong>Описание:</strong> {{ user.description }}</li>
                </ul>
            </ul>
        </fieldset>
    </div>
</template>

<script setup>

import { onMounted, reactive } from 'vue';
import { wsGetAllUsers } from '../axios/ws';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function editUser(id){
    console.log("Edit user:", id);
}

const resources = reactive({ users: [] });

onMounted(() => {
    wsGetAllUsers(globals, resources);
});

</script>
