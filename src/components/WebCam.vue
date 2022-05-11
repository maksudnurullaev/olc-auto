<template>
    <div class="web-camera-container">

        <div v-if="!_data.isCameraOpen" class="camera-button">
            <select ref="videoList"  :disabled="Object.keys(_data.cameras).length <= 1">
                <option v-for="(value, name, index) in _data.cameras " :value="value">{{ value.label }}</option>
            </select>
        </div>
        <div class="camera-button">
            <button type="button" class="button is-rounded"
                :class="{ 'is-primary': !_data.isCameraOpen, 'is-danger': _data.isCameraOpen }" @click="toggleCamera">
                <span v-if="!_data.isCameraOpen">Open Camera</span>
                <span v-else>Close Camera</span>
            </button>
        </div>

        <div v-show="_data.isCameraOpen && _data.isLoading" class="camera-loading">
            <ul class="loader-circle">
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

        <div v-if="_data.isCameraOpen" v-show="!_data.isLoading" class="camera-box"
            :class="{ 'flash': _data.isShotPhoto }">

            <div class="camera-shutter" :class="{ 'flash': _data.isShotPhoto }"></div>

            <video v-show="!_data.isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>

            <canvas v-show="_data.isPhotoTaken" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
        </div>

        <div v-if="_data.isCameraOpen && !_data.isLoading" class="camera-shoot">
            <button type="button" class="button" @click="takePhoto">
                <img src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png">
            </button>
        </div>

        <div v-if="_data.isPhotoTaken && _data.isCameraOpen" class="camera-download">
            <a id="downloadPhoto" download="my-photo.jpg" class="button" role="button" @click="downloadImage">
                Download
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import got from 'got'

const camera = ref(null);
const canvas = ref(null);
const videoList = ref(null);

const _data = reactive({
    isCameraOpen: false,
    isPhotoTaken: false,
    isShotPhoto: false,
    isLoading: false,
    link: '#',
    cameras: {}

});

onMounted(() => {
    console.log("Update device list!");
    console.log(updateDeviceList());
});

function toggleCamera() {
    if (_data.isCameraOpen) {
        _data.isCameraOpen = false;
        _data.isPhotoTaken = false;
        _data.isShotPhoto = false;
        stopCameraStream();
    } else {
        _data.isCameraOpen = true;
        createCameraElement();
    }
};

function createCameraElement() {
    _data.isLoading = true;

    const constraints = (window.constraints = {
        audio: false,
        video: true
    });


    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            _data.isLoading = false;
            camera.value.srcObject = stream;
        })
        .catch(error => {
            _data.isLoading = false;
            alert("May the browser didn't support or there is some errors.");
        });
};

function stopCameraStream() {
    let tracks = camera.value.srcObject.getTracks();

    tracks.forEach(track => {
        track.stop();
    });
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
                    _data.cameras[elem.label] = device;
                }
            });
        });
}

function takePhoto() {
    if (!_data.isPhotoTaken) {
        _data.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
            _data.isShotPhoto = false;
        }, FLASH_TIMEOUT);
    }

    _data.isPhotoTaken = !_data.isPhotoTaken;

    const context = canvas.value.getContext('2d');
    context.drawImage(camera.value, 0, 0, 450, 337.5);
    //MNK
    const dataURL = canvas.value.toDataURL("image/jpeg");
    console.log(dataURL.length);
}


function downloadImage() { // TODO: refactor
    const download = document.getElementById("downloadPhoto");
    const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
    download.setAttribute("href", canvas);
}

</script>

<style scoped lang="scss">
@import '../css/camera.scss';
</style>