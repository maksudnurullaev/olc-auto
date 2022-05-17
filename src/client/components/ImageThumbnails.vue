<template>
    <div id="container" v-if="globals.car.images.length > 0">
        <p>Нажмите на картинку чтобы увеличить</p>

        <a v-for="imageURL in globals.car.images" target="_blank" :href="globals.getWebServiceURL + imageURL">
            <img :src="globals.getWebServiceURL + imageURL" alt="" style="width:150px" :class="getImageClass(imageURL)">
        </a>
    </div>
    <!-- 
    Show Camera: {{ globals.camera.isCameraOpen }} <br />
    Images count: {{ globals.car.images.length }} <br />
    -->
</template>

<script setup>
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function getImageClass(fileName){
    if (fileName){
        var result = fileName.match(/.*-(.*).jpeg/);
        return (result[1]);    
    }
    return 'NaN';
};


</script>

<style scoped>
img {
    border: 2px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 150px;
    margin-right: 3px;
    margin-top: 3px;
}

img.In {
    border: 2px solid green;
}

img.Out {
    border: 2px solid blue;
}


img:hover {
    box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}

div#container {
    margin: 0 auto 0 auto;
    /* max-width: 60em; */
    padding: 1em 1.5em 1.3em 1.5em;
}
</style>