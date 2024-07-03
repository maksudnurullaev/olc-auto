<template>
    <div class="web-camera-container" v-if="globals.camera.isComponentOpen">

        <div v-if="!globals.camera.isCameraOpen" class="camera-button">
            <select ref="videoList" :disabled="Object.keys(globals.camera.cameras).length <= 1">
                <option v-for="(value, name, index) in globals.camera.cameras " :value="value">{{ value.label }}
                </option>
            </select>
        </div>

        <div class="camera-button">
            <button type="button" class="button is-rounded"
                :class="{ 'is-primary': !globals.camera.isCameraOpen, 'is-danger': globals.camera.isCameraOpen }"
                @click="toggleCamera">
                <span v-if="!globals.camera.isCameraOpen">Open Camera</span>
                <span v-else>Close Camera</span>
            </button>
        </div>

        <div v-show="globals.camera.isCameraOpen && globals.camera.isLoading" class="camera-loading">
            <ul class="loader-circle">
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

        <div v-if="globals.camera.isCameraOpen" v-show="!globals.camera.isLoading" class="camera-box"
            :class="{ 'flash': globals.camera.isShotPhoto }">

            <div class="camera-shutter" :class="{ 'flash': globals.camera.isShotPhoto }"></div>

            <video v-show="!globals.camera.isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>

            <canvas v-show="globals.camera.isPhotoTaken" id="photoTaken" ref="canvas" :width="450"
                :height="337.5"></canvas>
        </div>

        <div v-if="globals.camera.isCameraOpen && !globals.camera.isLoading" class="camera-shoot">
            <input type="submit" @click="takePhoto" value="Сохранить" />
        </div>
    </div>
    <!--
    <pre>
        globals.camera.isComponentOpen: {{ globals.camera.isComponentOpen }}
    </pre>
    -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useGlobalStore } from '../stores/globals';
import { isDevMode } from '../../utils/common';
const globals = useGlobalStore();

const camera = ref(null);
const canvas = ref(null);
const videoList = ref(null);

watch(globals.camera.isComponentOpen, (newValue, oldValue) => {
    isDevMode() && console.log('(newValue, oldValue)', (newValue, oldValue));
});

globals.$subscribe((mutation, state) => {
    let _payload = mutation.payload;
    if (_payload && _payload.camera)
        if (!_payload.camera.isComponentOpen) {
            closeCamera();
        }
})

onMounted(() => {
    isDevMode() && console.log("Update device list!");
    isDevMode() && console.log(updateDeviceList());
});

function toggleCamera() {
    if (globals.camera.isCameraOpen) {
        closeCamera();
    } else {
        openCamera();
    }
};

function closeCamera() {
    globals.camera.isCameraOpen = false;
    globals.camera.isPhotoTaken = false;
    globals.camera.isShotPhoto = false;
    stopCameraStream();
}

function openCamera() {
    globals.camera.isLoading = true;

    const constraints = (window.constraints = {
        audio: false,
        video: true
    });


    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            globals.camera.isLoading = false;
            camera.value.srcObject = stream;
            globals.camera.isCameraOpen = true;
        })
        .catch(error => {
            globals.camera.isLoading = false;
            alert("May the browser didn't support or there is some errors.");
        });
};

function stopCameraStream() {
    if (camera.value.srcObject) {
        let tracks = camera.value.srcObject.getTracks();

        tracks.forEach(track => {
            track.stop();
        });
    }
};


function updateDeviceList() {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            // audioList.innerHTML = "";
            videoList.innerHTML = "";

            devices.forEach(device => {
                let elem = document.createElement("option");
                let [kind, type, direction] = device.kind.match(/(\w+)(input|output)/i);

                elem.innerHTML = device.label + " (" + direction + ")";
                elem.value = device.label;
                if (type === "video") {
                    // videoList.value.appendChild(elem);
                    globals.camera.cameras[elem.label] = device;
                }
            });
        });
}

function takePhoto() {
    if (!globals.camera.isPhotoTaken) {
        globals.camera.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
            globals.camera.isShotPhoto = false;
        }, FLASH_TIMEOUT);
    }

    globals.camera.isPhotoTaken = !globals.camera.isPhotoTaken;

    const context = canvas.value.getContext('2d');
    context.drawImage(camera.value, 0, 0, 450, 337.5);
    //MNK
    const dataURL = canvas.value.toDataURL("image/jpeg");
    isDevMode() && console.log(dataURL.length);
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.post(globals.getWebServiceURL + "base64Jpeg2File", {
        dataURL: dataURL,
        carNumber: 'AD1221XS',
        carState: globals.car.state
    })
        .then(function (response) {
            globals.addCarImage(response.data.image);
            isDevMode() && console.log(response.data.image);
        })
        .catch(function (error) {
            console.error(error);
        });
}

</script>

<style scoped lang="scss">
@import '../assets/css/camera.scss';
</style>