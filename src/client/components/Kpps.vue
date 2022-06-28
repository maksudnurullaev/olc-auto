<template>
    <div class="content">
        <fieldset>
            <legend>Настройки всех КПП:</legend>
            <input type="submit" style="padding: 5px 10px" @click="subView.id = 'list'"
                :class="{ selected: isClass('list') }" value="Список">
            <input type="submit" style="padding: 5px 10px" @click="subView.id = 'add'"
                :class="{ selected: isClass('add') }"  value="Добавить">
        </fieldset>
    </div>
    <div class="content subview">
        <users-list v-if="subView.id == 'list'" />
        <users-add v-else-if="subView.id == 'add'" />
        <strong v-else>Undefined sub-component!</strong>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import UsersList from './UsersList.vue';
import UsersAdd from './UsersAdd.vue';

const subView = reactive({ id: 'list' });


function isClass(id) {
    return subView.id == id;
}

</script>

<style scoped>
@import url("../assets/css/main.content.css");
</style>