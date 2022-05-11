<template>
    <div class="sticky">
        <input type="text" v-model="truckNumber" @keyup="uppercase" placeholder="Номер авто" />
        <input type="submit" value="Обновить" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const truckNumber = ref("");

function uppercase() {
    if (truckNumber) {
        truckNumber.value = truckNumber.value.toUpperCase().replace(/[^0-9A-Z]/gi, '');
    }
}

</script>

<style scoped>
@import '../css/sticky.css';
</style>