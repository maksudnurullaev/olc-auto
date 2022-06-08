<template>
    <div class="content">
        <fieldset>
            <legend>Информация о въезде/выезде транспорта</legend>
            <template v-if="resources.transportTypes.length">
                Тип транспорта:<br />
                <select v-model="resources.inOutInfo.transportType" @change="updateType">
                    <option disabled value="0">Выберите один из вариантов</option>
                    <option v-for="tt in resources.transportTypes" :value="tt.id">
                        {{ tt.name + (tt.code_length ? ('/' + tt.code_length) : '') }}
                    </option>
                </select><br />
                Код груза:<br />
                <input type="text" v-model="resources.inOutInfo.code" placeholder="Код" />
                <img src="../assets/icons/correct.png" v-if="resources.codeSize && validCode()" />
                <br />
                <template v-if="resources.codeSize && !validCode()">
                    <sup style="color:red;">Минимальне количество символов кода: {{ resources.codeSize
                    }}</sup><br />
                </template>
            </template>
            Время въезда:<br />
            <input type="datetime-local" v-model="resources.inOutInfo.in_datetime" disabled /><br />
            Время выезда:<br />
            <input type="datetime-local" v-model="resources.inOutInfo.out_datetime" disabled /><br />
            Контрагент:<br />
            <input ref="code" type="text" v-model="resources.inOutInfo.contragent" placeholder="Контрагент" /><br />
            Телефон водителя:<br />
            <input ref="code" type="text" v-model="resources.inOutInfo.driver_phone"
                placeholder="Телефон водителя" /><br />
            Комментарий:<br />
            <textarea id="w3review" name="w3review" rows="4" cols="50"
                v-model="resources.inOutInfo.comment"></textarea><br />

            <button @click="setInState()">Оформить въезд</button>
            <button @click="setOutState()">Оформить выезд</button>
        </fieldset>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { wsGetTransportTypes } from '../axios/ws'
import { useGlobalStore } from '../stores/globals';
const globals = useGlobalStore();

const resources = reactive({
    inOutInfo: {
        transportType: 0,
        code: "",
        in_datetime: null,
        out_datetime: null,
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
    return resources.inOutInfo.code.trim().length >= resources.codeSize;
}

function updateType() {
    resources.codeSize = resources.codeLengthLimits[resources.inOutInfo.transportType];
}

function setInState() {
    resources.inOutInfo.in_datetime = getNow()
}

function setOutState() {
    resources.inOutInfo.out_datetime = getNow()
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