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
            <button @click="globals.setNewIoInfosFormData()"
                style="margin-left: 3px;">Добавить</button>
        </fieldset>
        <fieldset v-if="globals.car.infoCurrentId || globals.car.form.isNew">
            <legend>Информация о въезде/выезде транспорта</legend>
            <template v-if="globals.car.form.transportTypes.length">
                Тип транспорта:<br />
                <select v-model="globals.car.infoCurrent.ttype_id" @change="changeTransportType()">
                    <option disabled value="0">Выберите один из вариантов</option>
                    <option v-for="tt in globals.car.form.transportTypes" :value="tt.id">
                        {{ tt.name + (tt.code_length ? ('/' + tt.code_length) : '') }}
                    </option>
                </select><br />
                Код груза:<br />
                <input type="text" v-model="globals.car.infoCurrent.code" placeholder="Код" />
                <img src="../assets/icons/correct.png" v-if="globals.car.form.codeSize && validCode()" />
                <br />
                <template v-if="globals.car.form.codeSize && !validCode()">
                    <sup style="color:red;">Минимальне количество символов кода: {{ globals.car.form.codeSize
                    }}</sup><br />
                </template>
            </template>
            Время въезда:<br />
            <input type="datetime-local" v-model="globals.car.infoCurrent.in_datetime" disabled /><br />
            Время выезда:<br />
            <input type="datetime-local" v-model="globals.car.infoCurrent.out_datetime" disabled /><br />
            Телефон контрагента:<br />
            <input ref="code" type="text" v-model="globals.car.infoCurrent.contragent"
                placeholder="Телефон контрагента" /><br />
            Телефон водителя:<br />
            <input ref="code" type="text" v-model="globals.car.infoCurrent.driver_phone"
                placeholder="Телефон водителя" /><br />
            Комментарий:<br />
            <textarea id="w3review" name="w3review" rows="4" cols="50"
                v-model="globals.car.infoCurrent.comment"></textarea><br />

            <button @click="setInState()" :disabled="globals.car.infoCurrent.in_datetime">Оформить въезд</button>
            <button @click="setOutState()"
                :disabled="globals.car.infoCurrent.out_datetime || (!globals.car.infoCurrent.in_datetime && !globals.car.infoCurrent.out_datetime)">Оформить
                выезд</button>
        </fieldset>
    </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, onMounted, ref } from 'vue';
import { wsGetCarInfos4Date, wsGetCarInfosDates, wsGetTransportTypes } from '../axios/ws'
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

// function setNewFormData() {
//     globals.car.infoCurrentId = -1;
//     globals.car.infoCurrent = inOutInfoDefaults;
//     // globals.car.infoCurrentOld = resources.inOutInfoDefaults;
// }

function changeFormData() {
    globals.setCarInfoID(globals.car.infoCurrentId);
    // changeTransportType();
}

const inOutInfoDefaults = {
    // mandatory fields to insert
    car_number: null,
    date_ymd: null,
    ttype_id: 0,
    code: "",
    in_datetime: null,
    // mandatory field to update
    out_datetime: null,
    // ... other fields
    contragent: null,
    driver_phone: null,
    comment: null
}

function getNow() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

function validCode() {
    if (!globals.car.form.codeSize) {
        return true;
    }
    return globals.car.infoCurrent.code.trim().length >= globals.car.form.codeSize;
}

function changeTransportType() {
    globals.car.form.codeSize = globals.car.form.codeLengthLimits[globals.car.infoCurrent.ttype_id];
}

function setInState() {
    if (!globals.car.current_number) {
        alert('Нет номера авто!');
        return;
    }
    if (!globals.car.infoCurrent.ttype_id) {
        alert('Выберите тип транспорта!');
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
            console.log(pn, ': ', infoCurrent[pn]);
        }
    }

    console.log("Insert for car", globals.car.current_number, " new info!");
    axios.post(globals.getWebServiceURL + url2Add, postData).then((response) => {
        if (response.data.result) {
            wsGetCarInfosDates(globals);
            // globals.getAllCarsList();
            globals.cars.push(car_number)
            wsGetCarInfos4Date(globals).then(() => {
                // set  globals.car.infoCurrentId
                for (let index = 0; index < globals.car.infos.length; index++) {
                    const info = globals.car.infos[index];
                    if (info.in_datetime == postData.in_datetime) {
                        globals.car.infoCurrentId = info.id;
                        return;
                    }
                }
            });

            console.log(url2Add, ' insert success!');
        } else {
            globals.car.infoCurrent.in_datetime = null; // restore state of access to update
            console.warn(url2Add, 'insert failed!', response.data.message);
        }
    });
}

// function getCurrentOldInfo() {
//     if (!globals.car.infoCurrentId || globals.car.infoCurrentId == -1) {
//         console.warn("Nothing to update for car's info records!");
//         return null;
//     }
//     for (let index = 0; index < globals.car.infos.length; index++) {
//         const info = globals.car.infos[index];
//         if (globals.car.infoCurrentId == info.id) {
//             return info;
//         }
//     }
//     return null;
// }

function setOutState() {
    globals.car.infoCurrent.out_datetime = getNow()

    const car_number = globals.car.current_number,
        infoId = globals.car.infoCurrentId;
    axios.post(globals.getWebServiceURL + `cars/${car_number}/infos/${infoId}`).then((response) => {
        if (response.data.result) {
            const infOld = response.data.car.info;
            const infoCurrent = globals.car.infoCurrent;
            console.log("Update for car", globals.car.current_number, "info with id", globals.car.infoCurrentId);
            let postData = {};
            for (const pn in infoCurrent) {
                if (infoCurrent[pn] != infOld[pn]) {
                    postData[pn] = infoCurrent[pn];
                    console.log(pn, ': ', infoCurrent[pn]);
                }
            }
            // cars/TESTCAR34/update/info/93
            let url2Update = `cars/${car_number}/update/info/${infoId}`;
            axios.post(globals.getWebServiceURL + url2Update, postData).then((response) => {
                if (response.data.result) {
                    console.log(url2Update, ' update success!');
                } else {
                    globals.car.infoCurrent.out_datetime = null; // restore state of access to update
                    console.warn(url2Update, 'update failed!', response.data.message);
                }
            });
        }
    });
}

onMounted(() => {
    wsGetTransportTypes(globals);
    // changeTransportType();
});

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