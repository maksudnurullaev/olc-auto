<template>
    <div class="content">
        <fieldset>
            <legend>Журнал записей ({{ globals.car.infos.length }}):</legend>
            <template v-if="globals.car.infos.length">
                Запись от:
                <select v-model="globals.car.infoCurrentId" @change="changeFormData()">
                    <option disabled value="0">Выберите запись</option>
                    <option v-for="info in globals.car.infos" :value="info.id">{{ info.in_datetime }}</option>
                </select>
            </template>
            <button :disabled="globals.car.forDate !== ymdFormateDate()"
                @click="globals.setNewIoInfosFormData()" style="margin-left: 3px;">Добавить</button>
        </fieldset>
        <fieldset v-if="globals.car.infoCurrentId || globals.car.form.isNew" :disabled="globals.car.infoCurrent.in_datetime">
            <legend>Комментарий:</legend>
            <textarea id="w3review" :disabled="!globals.car.current_number" name="w3review" rows="4" cols="50"
                v-model="globals.car.infoCurrent.comment"></textarea><br />
                <button @click="saveRecord()" v-if="!globals.car.infoCurrent.in_datetime">Сохранить</button>
        </fieldset>
    </div>
</template>

<script setup>
import axios from 'axios';
// import { onMounted } from 'vue';
import { ymdFormateDate, isDevMode } from '../../utils/common';
import { wsGetCarInfosForDate, wsGetCarInfosByDates, wsGetTransportTypes } from '../axios/ws'

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

const devMode = isDevMode();

function changeFormData() {
    globals.setCarInfoID(globals.car.infoCurrentId);
}

function getNow() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

function saveRecord() {
    if (!globals.car.current_number) {
        alert('Нет идентификационных данных!');
        return;
    }

    globals.car.infoCurrent.in_datetime = getNow()
    const car_number = globals.car.current_number;
    const infoCurrent = globals.car.infoCurrent;
    let url2Add = `cars/${car_number}/add/info`;
    let postData = {};
    for (const pn in infoCurrent) {
        if (infoCurrent[pn]) {
            postData[pn] = infoCurrent[pn];
            devMode && console.log(pn, ': ', infoCurrent[pn]);
        }
    }

    devMode && console.log("Insert for car", globals.car.current_number, " new info!");
    axios.post(globals.getWebServiceURL + url2Add, postData).then((response) => {
        if (response.data.result) {
            wsGetCarInfosByDates(globals);

            // add car to globals if not exists yet
            if (globals.cars.indexOf(car_number) == -1) {
                globals.cars.push(car_number)
            }
            // update/set infos for car
            wsGetCarInfosForDate(globals).then(() => {
                for (let index = 0; index < globals.car.infos.length; index++) {
                    const info = globals.car.infos[index];
                    if (info.in_datetime == postData.in_datetime) {
                        globals.car.infoCurrentId = info.id;
                        return;
                    }
                }
            });
            devMode && console.log(url2Add, ' insert success!');
        } else {
            globals.car.infoCurrent.in_datetime = null; // restore state of access to update
            console.warn(url2Add, 'insert failed!', response.data.message);
        }
    });
}

// onMounted(() => {
//     wsGetTransportTypes(globals);
// });

</script>

<style scoped>
div.content input {
    margin-right: 3px;
    margin-top: 3px;
}

div.content button {
    margin-right: 3px;
    margin-top: 3px;
}
</style>