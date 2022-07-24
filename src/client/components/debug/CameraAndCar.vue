<template>
  <pre>
Camera current state:
 globals.camera.isComponentOpen: {{ globals.camera.isComponentOpen }}
 globals.camera.isCameraOpen: {{ globals.camera.isCamersOpen }}

Current car state:
 globals.car.current_number: {{ globals.car.current_number }} 
 globals.car.forDate: {{ globals.car.forDate }} 
 globals.car.infoCurrentId: {{ globals.car.infoCurrentId }} 
 globals.car.form.isNew: {{ globals.car.form.isNew }} 
 globals.car.infos.length: {{ globals.car.infos.length }} 
 globals.car.infosByDates.length: {{ globals.car.infosByDates.length }} 
  </pre>
  <div>
    <ul>
      <li v-for="[n, v] in Object.entries(globals.car.infoCurrent)">{{ n }}: {{ v ? v.toString().trim().length : 0
      }}
      </li>
    </ul>
  </div>
</template>

<script setup >
import { useGlobalStore } from '../../stores/globals';
const globals = useGlobalStore();
</script>
