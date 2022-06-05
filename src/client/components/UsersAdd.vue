<template>
    <div class="content">
        <fieldset>
            <legend>Добавить пользователя:</legend>
        </fieldset>
    </div>
    <div class="content subview">
        <strong>Undefined sub-component!</strong>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const subView = reactive({ id: 'list' });
</script>

<style scoped>
@import url("../assets/css/main.content.css");
</style>