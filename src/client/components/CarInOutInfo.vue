<template>
    <div class="content">
        <fieldset>
            <legend>Журнал записей ({{ globals.car.infos.length }}):</legend>
            <template v-if="globals.car.infos.length">
                Запись от:
                <select v-model="globals.car.infoCurrentId" @change="setFormData()">
                    <option v-if="globals.car.infos.length > 1" disabled value="0">Выберите Запись</option>
                    <option v-for="info in globals.car.infos" :value="info.id">{{ info.in_datetime }}</option>
                </select>
            </template>
            <button v-if="globals.car.current_number.length > 4" style="margin-left: 3px;">Добавить</button>
        </fieldset>
        <fieldset v-if="globals.car.infos.length && globals.car.infoCurrentId">
            <legend>Информация о въезде/выезде транспорта</legend>
            <template v-if="resources.transportTypes.length">
                Тип транспорта:<br />
                <select v-model="globals.car.infoCurrent.ttype_id" @change="updateTransportType">
                    <option disabled value="0">Выберите один из вариантов</option>
                    <option v-for="tt in resources.transportTypes" :value="tt.id">
                        {{ tt.name + (tt.code_length ? ('/' + tt.code_length) : '') }}
                    </option>
                </select><br />
                Код груза:<br />
                <input type="text" v-model="globals.car.infoCurrent.code" placeholder="Код" />
                <img src="../assets/icons/correct.png" v-if="resources.codeSize && validCode()" />
                <br />
                <template v-if="resources.codeSize && !validCode()">
                    <sup style="color:red;">Минимальне количество символов кода: {{ resources.codeSize
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

            <button @click="setInState()">Оформить въезд</button>
            <button @click="setOutState()">Оформить выезд</button>
        </fieldset>
    </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, onMounted, ref } from 'vue';
import { wsGetTransportTypes } from '../axios/ws'
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

function setFormData() {
    globals.setCarInfoID(globals.car.infoCurrentId)
}

const resources = reactive({
    selectedInfoID: 0,
    inOutInfoDefaults: {
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
    },
    transportTypes: [],
    codeLengthLimits: {},
    codeSize: 0
});

function getNow() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

function validCode() {
    if (!resources.codeSize) {
        return true;
    }
    return globals.car.infoCurrent.code.trim().length >= resources.codeSize;
}

function updateTransportType() {
    resources.codeSize = resources.codeLengthLimits[globals.car.infoCurrent.ttype_id];
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

    globals.car.infoCurrent.car_number = globals.car.current_number;
    globals.car.infoCurrent.in_datetime = getNow()
    globals.car.infoCurrent.date_ymd = globals.car.forDate;
    axios.post(globals.getWebServiceURL + "addInOutInfos", globals.car.infoCurrent).then(function (response) {
        if (response.data.result) {
            // pageResources.roles = response.data.roles;
            // response.data.roles.forEach((role) => {
            //     pageResources.rolesMap[role.id] = role.description;
            // })
            alert('Информация добавлена!');
        } else {
            alert('Ошибка!');
        }
    });
}

function setOutState() {
    globals.car.infoCurrent.out_datetime = getNow()
}

onMounted(() => {
    wsGetTransportTypes(globals, resources);
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