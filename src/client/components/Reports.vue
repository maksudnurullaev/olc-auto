<template>
    <div class="content">
        <fieldset>
            <legend>Отчеты:</legend>
            По датам:
            <label for="dateFrom">oт:</label>
            <input type="date" id="dateFrom" v-model="resources.dateFrom" min="2022-06-06" :max="resources.dateTo">
            <label for="dateTo">до:</label>
            <input type="date" id="dateTo" v-model="resources.dateTo" :min="resources.dateFrom" :max="ymdFormateDate()">
            <input type="button" value="Отчет" @click="makeReport()" />
            <p>
                <strong>From {{ resources.dateFrom }} to {{ resources.dateTo }}</strong>
            </p>
        </fieldset>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ymdFormateDate } from '../../utils/common';


const resources = reactive({
    dateFrom: ymdFormateDate(),
    dateTo: ymdFormateDate()
})

function makeReport(){
    const url = `reports/infos/from/${resources.dateFrom}/to/${resources.dateTo}`
    console.log('URL report:', url)
}
</script>


<style scoped>
input {
    margin-right: 3px;
    margin-left: 3px;
}
</style>