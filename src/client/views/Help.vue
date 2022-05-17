<script setup lang="ts">
import { ref } from 'vue'
import CompTut1 from "../components/CompTut1.vue";

function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value);
}

const count = ref(0)
</script>

<template>
  <p>
    <button type="button" @click="count++">Увеличить</button> {{ count }}
    <button type="button" @click="count--">Уменьшить</button>
  </p>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <hr />
  <input type="text" @change="handleChange" />
  <hr />
  <comp-tut1 />
  <hr />
  <comp-tut1 />
  <hr />
  <comp-tut1 />
</template>