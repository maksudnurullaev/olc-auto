<template>
    <fieldset>
        <legend>Фотографии</legend>
        <p>Нажмите на картинку чтобы увеличить</p>
        <a v-for="photo in props.photos" target="_blank" :href="photo.imageUrl">
            <img :src="photo.imageUrl" :alt="photo.created_at" style="width:150px" :class="getImageClass(photo.url)"
                :title="photo.created_at">
        </a>
    </fieldset>
</template>

<script setup>
import { onMounted } from 'vue';
import { getImageClass } from '../../utils/common';

const props = defineProps(['photos'])

onMounted(() => {
    console.log("Thumbtail photos:", props.photos.length)
})

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
    /* padding: 1em 1.5em 1.3em 1.5em; */
}
</style>