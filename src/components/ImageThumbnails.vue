<template>
    <h2>Thumbnail Image</h2>
    <p>Click on the image to enlarge it.</p>

    <a v-for="imageURL in globals.car.images" target="_blank" :href="globals.getWebServiceURL + imageURL">
        <img :src="globals.getWebServiceURL + imageURL" alt="" style="width:150px">
    </a>
</template>

<script setup>
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();
</script>

<style scoped>
img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 150px;
}

img:hover {
    box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}
</style>