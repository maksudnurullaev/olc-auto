<template>
    <div class="sticky"> Камеры:
        <input type="submit" value="Въезд" />
        <input type="submit" value="Выезд" />
        <input type="submit" @click="switchCamera" value="Устройство" />
        |
        <input type="radio" id="AutoIn" name="inOrOut" v-model="globals.car.state" value="In" checked="true" /><label
            for="AutoIn">Въезд</label>
        <input type="radio" id="AutoOut" name="inOrOut" v-model="globals.car.state" value="Out" /><label
            for="AutoOut">Выезд</label>
        |
        История:
        <select name="History">
            <option value="_today" selected="true">Сегодня</option>
        </select>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function switchCamera() {
    globals.$patch({ camera: { isComponentOpen: !globals.camera.isComponentOpen } });
    // globals.camera.isComponentOpen = !globals.camera.isComponentOpen;
    console.log("Show camera component: " + globals.camera.isComponentOpen);
}

</script>

<style scoped>
@import '../css/sticky.css';
</style>