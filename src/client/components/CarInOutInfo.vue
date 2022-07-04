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
            <button :disabled="!globals.roleAsKpp || globals.car.forDate !== ymdFormateDate()"
                @click="globals.setNewIoInfosFormData()" style="margin-left: 3px;">Добавить</button>
        </fieldset>
        <fieldset v-if="globals.car.infoCurrentId || globals.car.form.isNew">
            <legend>Информация о въезде/выезде транспорта</legend>
            Организация:<br />
            <select disabled v-model="globals.car.infoCurrent.org">
                <option v-for="org in getOrgs4Select()" :value="org.key">{{ org.title }}</option>
            </select><br />
            КПП:<br />
            <select disabled v-model="globals.car.infoCurrent.kpp">
                <option v-for="org in getOrgKpps4Select(globals.location.org)" :value="org.key">{{ org.title }}</option>
            </select><br />
            <template v-if="globals.car.form.transportTypes.length">
                Тип транспорта:<br />
                <select :disabled="!globals.roleAsKpp" v-model="globals.car.infoCurrent.ttype_id"
                    @change="changeTransportType()">
                    <option disabled value="0">Выберите один из вариантов</option>
                    <option v-for="tt in globals.car.form.transportTypes" :value="tt.id">
                        {{ tt.name + (tt.code_length ? ('/' + tt.code_length) : '') }}
                    </option>
                </select><br />
                Код груза:<br />
                <input :disabled="!globals.roleAsKpp" type="text" v-model="globals.car.infoCurrent.code"
                    placeholder="Код" />
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
            <input :disabled="!globals.roleAsKpp" ref="code" type="text" v-model="globals.car.infoCurrent.contragent"
                placeholder="Телефон контрагента" /><br />
            Телефон водителя:<br />
            <input :disabled="!globals.roleAsKpp" type="text" v-model="globals.car.infoCurrent.driver_phone"
                placeholder="Телефон водителя" /><br />
            Комментарий:<br />
            <textarea :disabled="!globals.roleAsKpp" id="w3review" name="w3review" rows="4" cols="50"
                v-model="globals.car.infoCurrent.comment"></textarea><br />
            <template v-if="globals.roleAsKpp">
                <button @click="setInState()" :disabled="globals.car.infoCurrent.in_datetime">Оформить въезд</button>
                <button @click="setOutState()"
                    :disabled="globals.car.infoCurrent.out_datetime || (!globals.car.infoCurrent.in_datetime && !globals.car.infoCurrent.out_datetime)">Оформить
                    выезд</button>
            </template>
            <template v-else-if="globals.user.role === '1c'">
                <input type="checkbox" id="is_sent_to_1c" v-model="globals.car.infoCurrent.is_sent_to_1c">
                <label for="is_sent_to_1c">Данные{{ globals.car.infoCurrent.is_sent_to_1c ? ' ' : ' не ' }}заведены в
                    1С</label><br />
                <button @click="update1cState()">Сохранить</button>
            </template>
        </fieldset>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { ymdFormateDate } from '../../utils/common';
import { wsGetCarInfos4Date, wsGetCarInfosDates, wsGetTransportTypes } from '../axios/ws'
import configOrgs from '../../utils/Organizations.json'

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();
function changeFormData() {
    globals.setCarInfoID(globals.car.infoCurrentId);
}

function getOrgs4Select() {
    const keys = Object.keys(configOrgs.orgs)
    const result = []
    keys.forEach(key => {
        const org = configOrgs.orgs[key]
        result.push({ key, title: org.description })
    });
    return result
}

function getOrgKpps4Select(org) {
    const keys = Object.keys(configOrgs.orgs[org]['kpps'])
    const result = []
    keys.forEach(key => {
        const kpp = configOrgs.orgs[org]['kpps'][key]
        result.push({ key, title: kpp.description })
    });
    return result
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

            // add car to globals if not exists yet
            if (globals.cars.indexOf(car_number) == -1) {
                globals.cars.push(car_number)
            }
            // update/set infos for car
            wsGetCarInfos4Date(globals).then(() => {
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

function update1cState() {
    const car_number = globals.car.current_number,
        infoId = globals.car.infoCurrentId;
    const filter = {
        "select": ["is_sent_to_1c"]
    }

    axios.post(globals.getWebServiceURL + `cars/${car_number}/infos/${infoId}`, filter).then((response) => {
        if (response.data.result) {
            const infOld = response.data.car.info;
            const infoCurrent = globals.car.infoCurrent;
            console.log("Update for car", globals.car.current_number, "info with id", globals.car.infoCurrentId);
            let postData = {};
            for (const pn in infOld) {
                if (infoCurrent[pn] != infOld[pn]) {
                    postData[pn] = infoCurrent[pn];
                    console.log(pn, ': ', infoCurrent[pn]);
                }
            }
            if (Object.entries(postData).length) {
                // update if necsessary
                let url2Update = `cars/${car_number}/update1c/info/${infoId}`;
                axios.post(globals.getWebServiceURL + url2Update, postData).then((response) => {
                    if (response.data.result) {
                        console.log(url2Update, ' update success!');
                    } else {
                        globals.car.infoCurrent.out_datetime = null; // restore state of access to update
                        console.warn(url2Update, 'update failed!', response.data.message);
                    }
                });

            } else {
                alert('Нет изменений в данных!');
            }
        }
    });
}

onMounted(() => {
    wsGetTransportTypes(globals);
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