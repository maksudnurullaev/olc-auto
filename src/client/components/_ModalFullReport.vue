<template>
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container" v-if="props.info">

                <div class="modal-header">
                    <slot name="header">
                        <button class="modal-default-button" @click="$emit('closeFullReport')">
                            Закрыть
                        </button>
                        <h1>
                            Детальный отчет по авто: <strong>{{ props.info.car_number }}</strong>
                        </h1>
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                        <span class="columnName">Въезд: </span><span class="columnValue">{{
                                props.info.in_datetime ? props.info.in_datetime : '---'
                        }}</span><br />
                        <span class="columnName">Въезд оформил: </span><span class="columnValue">{{
                                props.info.who_in_checked ? props.info.who_in_checked : '---'
                        }}</span><br />
                        <span class="columnName">Выезд: </span><span class="columnValue">{{
                                props.info.out_datetime ? props.info.out_datetime : '---'
                        }}</span><br />
                        <span class="columnName">Выезд оформил: </span><span class="columnValue">{{
                                props.info.who_out_checked ? props.info.who_out_checked : '---'
                        }}</span><br />
                        <span class="columnName">Код груза: </span><span class="columnValue">{{ props.info.code ?
                                props.info.code : '---'
                        }}</span><br />
                        <span class="columnName">Отравлено в 1С: </span><span class="columnValue">{{
                                props.info.is_sent_to_1c ? 'Да' : 'Нет'
                        }}</span><br />
                        <span class="columnName">В 1С оформил: </span><span class="columnValue">{{
                                props.info.who_sent_to_1c ? props.info.who_sent_to_1c : '---'
                        }}</span><br />
                        <span class="columnName">Телефон контрагента: </span><span class="columnValue">{{
                                props.info.contragent ? props.info.contragent : '---'
                        }}</span><br />
                        <span class="columnName">Телефон водителя: </span><span class="columnValue">{{
                                props.info.driver_phone ? props.info.driver_phone : '---'
                        }}</span><br />
                        <span class="columnName">Комментарии: </span><span class="columnValue">{{
                                props.info.comment ? props.info.comment : '---'
                        }}</span><br />
                        <image-thumbnails :photos="getPhotos()" />
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        Сгенерировано: {{ ymdFormateDate(null, true) }}
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getImageAccessUrl } from '../../utils/common';
import ImageThumbnails from './ImageThumbnails.vue';
import { ymdFormateDate } from '../../utils/common';

const props = defineProps(['info', 'photos'])

function getPhotos() {
    let photos = []
    for (let index = 0; index < props.photos.length; index++) {
        const photo = props.photos[index];
        photos.push({
            url: photo.url,
            imageUrl: getImageAccessUrl(props.info.car_number, photo.url, props.info.date_ymd),
            created_at: photo.created_at
        })
    }
    return photos
}

</script>

<style scoped>
@import url("../assets/css/modalFullReport.css");
</style>