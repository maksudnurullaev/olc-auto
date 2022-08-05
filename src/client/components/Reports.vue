<template>
    <div class="content">
        <fieldset>
            <legend>Отчет:</legend>
            <input type="button" value="Выполнить" style="border: 2px solid;" @click="makeReport()" />
            |
            <label for="dateFrom">От:</label>
            <input type="date" id="dateFrom" v-model="resources.dateFrom" min="2022-01-01" :max="resources.dateTo">
            <label for="dateTo">до:</label>
            <input type="date" id="dateTo" v-model="resources.dateTo" :min="resources.dateFrom" :max="ymdFormateDate()">
            |
            Лимит записей:
            <select name="limits" id="limits" v-model="resources.limits">
                <option v-for="l in [10, 100, 200, 500, 1000, 0]" :id="'limits-' + l" :value="l">{{ l ? l : 'все' }}
                </option>
            </select>
            |
            Статус по 1С:
            <select name="limits" id="limits" v-model="resources.stateOf1C">
                <option v-for="s1c in [1, 0, 99]" :id="'stateOf1C-' + s1c" :value="s1c">
                    {{ get1cStateName(s1c) }}
                </option>
            </select>

            <div v-if="resources.infos.length" style="padding: 1em;">
                <table class="styled">
                    <thead>
                        <tr>
                            <th>Номер машины</th>
                            <th>Въезд</th>
                            <th>Ответственный</th>
                            <th>Выезд</th>
                            <th>Ответственный</th>
                            <th>Код груза</th>
                            <th>Отправлено в 1С</th>
                            <th>Телефон контрагента</th>
                            <th>Телефон водителя</th>
                        </tr>
                    </thead>
                    <tr v-for="info in resources.infos">
                        <td><a :href="getFullReportURL(info)" target="_blank">{{ info.car_number }}</a>
                        </td>
                        <td>{{ info.in_datetime }}</td>
                        <td>{{ info.who_in_checked }}</td>
                        <td>{{ info.out_datetime ? info.out_datetime : '---' }}</td>
                        <td>{{ info.who_out_checked ? info.who_out_checked : '---' }}</td>
                        <td>{{ info.code ? info.code : '---' }}</td>
                        <td>{{ info.is_sent_to_1c ? 'Да' : 'Нет' }}</td>
                        <td>{{ info.contragent ? info.contragent : '---' }}</td>
                        <td>{{ info.driver_phone ? info.driver_phone : '---' }}</td>
                    </tr>
                </table>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { ymdFormateDate } from '../../utils/common';

import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

const fullReportEl = ref(null);

const resources = reactive({
    dateFrom: ymdFormateDate(),
    dateTo: ymdFormateDate(),
    limits: 10,
    infos: [],
    stateOf1C: 99,
    showFullReport: false,
    current: {
        info: null,
        photos: []
    }
})

function getFullReportURL(info) {
    if (info) {
        return '/reports/info/' + info.id
    }
    else { alert('Invalid INFO!') }
}

function get1cStateName(s1c) {
    if (s1c == 0) {
        return "не отправлено"
    } else if (s1c == 1) {
        return "отправлено"
    }
    return "нe важно"
}

function makeReport() {
    const url = `reports/infos/from/${resources.dateFrom}/to/${resources.dateTo}`
    const filters = {
        limits: resources.limits
    }
    if (resources.stateOf1C != 99) {
        filters.where = { is_sent_to_1c: resources.stateOf1C }
    }

    console.log('URL report:', url)
    console.log('URL report filters:', filters)
    axios.post(globals.getWebServiceURL + url, filters).then((response) => {
        if (response.data.result) {
            resources.infos = response.data.infos
            if (response.data.infos && response.data.infos.length == 0) {
                alert('По данным критериям нет данных!')
            }
        } else {
            console.warn(response.data.message)
        }
    });
}
</script>


<style scoped>
input {
    margin-right: 3px;
    margin-left: 3px;
}

table.styled {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

.styled th,
.styled td {
    padding: 12px 15px;
}

.styled tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}

.styled input[type=checkbox] {
    width: fit-content;
}

.styled input[type=radio] {
    width: fit-content;
}

fieldset {
    margin-bottom: 5px;
}
</style>