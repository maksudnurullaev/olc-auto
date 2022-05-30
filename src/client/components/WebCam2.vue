<template>
    <div id="container" v-if="globals.camera.isComponentOpen">

        <h1>Камера</h1>

        <!--
        <button @click="openCamera" style="background: green;">Открыть камеру</button>
        <button @click="closeCamera">Закрыть камеру</button>
-->
        <!-- p>Выберите камеру!</p -->
        <div class="select">
            <label for="videoSource">Камера: </label>
            <select @change="closeCamera" ref="videoSource" v-model="globals.camera.currentCamera">
                <option value="None">Выберите камеру...</option>
                <option v-for="item in globals.camera.cameras" :value="item.id">{{ item.label }}</option>
            </select>
        </div>

        <!-- p>Click a button to call <code>getUserMedia()</code> with appropriate resolution.</p -->

        <div id="buttons" ref="resolutionsButtons" v-if="globals.camera.currentCamera != 'None'">
            Разрешение:
            <button id="qvga" @click="getMedia(qvgaConstraints)">QVGA</button>
            <button id="vga" @click="getMedia(vgaConstraints)">VGA</button>
            <button id="hd" @click="getMedia(hdConstraints)">HD</button>
            <!--
            <button id="full-hd">Full HD</button>
            <button id="televisionFourK">Television 4K (3840x2160)</button>
            <button id="cinemaFourK">Cinema 4K (4096x2160)</button>
            <button id="eightK">8K</button>
            -->
        </div>

        <div ref="videoblock" id="videoblock">
            <video @onchange="start" @click="takeSnapshot" id="gum-res-local" ref="video" playsinline autoplay></video>
            <br /><button @click="takeSnapshot">Сфотографировать</button>
        </div>

        <p ref="errormessageblock" id="errormessage"></p>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup>
import adapter from 'webrtc-adapter';
import { onMounted, ref } from 'vue';
import { wsAddCarImage } from '../axios/ws.js';

import { useGlobalStore } from '../stores/globals';
// import { constants } from 'buffer';
const globals = useGlobalStore();

const button = ref(null);
const video = ref(null);
const canvas = ref(null);
const videoblock = ref(null);
const stream = ref(null);
const resolutionsButtons = ref(null);
const constraints = {
    audio: false,
    video: true
};

// ### For video source selection
const videoSource = ref(null);
// const selectors = [videoSource];

function gotDevices(deviceInfos) {
    // // Handles being called several times to update labels. Preserve values.
    // const values = selectors.map(select => select.value);
    // // selectors.forEach(select => {
    // while (videoSource.value.firstChild) {
    //     videoSource.value.removeChild(videoSource.value.firstChild);
    // }
    // // });
    if (!globals.camera.initialized) {
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === 'videoinput') {
                // const option = document.createElement('optionF');
                const camera = {
                    id: deviceInfo.deviceId,
                    label: deviceInfo.label || `camera ${globals.camera.cameras.length + 1}`
                }
                globals.camera.cameras.push(camera);
                // option.value = deviceInfo.deviceId;
                // option.text = deviceInfo.label || `camera ${videoSource.value.length + 1}`;
                // videoSource.value.appendChild(option);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }
        globals.camera.initialized = true;
    }
    // selectors.forEach((select, selectorIndex) => {
    //     if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
    //         select.value = values[selectorIndex];
    //     }
    // });
}

onMounted(() => {
    navigator.mediaDevices.enumerateDevices(constraints).then(gotDevices).catch(handleError);
    // console.log(adapter.browserDetails);
    // videoSource.value.onchange = start;
});

function start() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    // console.log("videoSelect changed, value: " + videoSource.value.value);
    //   const audioSource = audioInputSelect.value;
    //   const videoSource = videoSelect.value;
    //   const constraints = {
    //     audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    //     video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    //   };
    //   navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

// #### Video source selection end
globals.$subscribe((mutation, state) => {
    let _payload = mutation.payload;
    console.log('mutation', mutation);
    if (_payload && _payload.camera) {
        if (!_payload.camera.isComponentOpen) {
            closeCamera();
        } else {
            navigator.mediaDevices.enumerateDevices(constraints).then(gotDevices).catch(handleError);
        }
    }
    if (mutation
        && mutation.events
        && mutation.events.key
        && mutation.events.key == 'currentCamera'
        && mutation.events.newValue == 'None') {
        closeCamera();
    }
});

// function handleSuccess(stream) {
//     window.stream = stream; // make stream available to browser console
//     video.value.srcObject = stream;
// }

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function takeSnapshot() {
    if (!globals.car.carID) {
        alert('Нет номера авто!');
        return;
    }

    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    canvas.value.getContext('2d').drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);

    const dataURL = canvas.value.toDataURL("image/jpeg");
    console.log(dataURL.length);
    let myPostData = {
        dataURL: dataURL,
        carNumber: globals.car.carID,
        carState: globals.car.state
    }
    wsAddCarImage(myPostData, globals);
};

// function openCamera() {
//     navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
// }

function closeCamera() {
    if (video.value.srcObject) {
        let tracks = video.value.srcObject.getTracks();

        tracks.forEach(track => {
            track.stop();
        });
    }
    videoblock.value.style.display = 'none';
}

function getMedia(constraints) {
    globals.camera.isCameraOpen = false;
    if (stream.value) {
        stream.value.getTracks().forEach(track => {
            track.stop();
        });
    }

    if (globals.camera.currentCamera == 'None') {
        alert('Выберите камеру!');
        return;
    }

    constraints.video.deviceId = globals.camera.currentCamera;
    // console.log('constraints:', constraints);
    // showDebugMessage(JSON.stringify(constraints));

    // clearErrorMessage();
    videoblock.value.style.display = 'none';
    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotStream)
        .catch(e => {
            errorMessage('getUserMedia', e.message, e.name);
        });
}

function gotStream(mediaStream) {
    stream.value = window.stream = mediaStream; // stream available to console
    video.value.srcObject = mediaStream;

    let messagebox = errormessageblock.value;
    messagebox.style.display = 'none';

    videoblock.value.style.display = 'block';

    const track = mediaStream.getVideoTracks()[0];
    const constraints = track.getConstraints();
    console.log('Result constraints: ' + JSON.stringify(constraints));

    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    globals.camera.isCameraOpen = true;
}

// Error functions
const errormessageblock = ref(null);

// function showDebugMessage(message) {
//     let messagebox = errormessageblock.value;
//     messagebox.innerText = message;
//     messagebox.style.display = 'block';
// }

function errorMessage(who, what, when) {
    let messagebox = errormessageblock.value;
    const message = who + ': ' + (what ? what : '') + (when ? when : '');

    messagebox.innerText = "Ошибка, детализация в логах!";
    messagebox.style.display = 'block';
    console.log(message);
}

// function clearErrorMessage() {
//     let messagebox = errormessageblock.value;
//     messagebox.style.display = 'none';
// }

// Video quality:
const qvgaConstraints = {
    video: { width: { exact: 320 }, height: { exact: 240 } }
};

const vgaConstraints = {
    video: { width: { exact: 640 }, height: { exact: 480 } }
};

const hdConstraints = {
    video: { width: { exact: 1280 }, height: { exact: 720 } }
};

/** For future release!
const fullHdConstraints = {
    video: { width: { exact: 1920 }, height: { exact: 1080 } }
};

const televisionFourKConstraints = {
    video: { width: { exact: 3840 }, height: { exact: 2160 } }
};

const cinemaFourKConstraints = {
    video: { width: { exact: 4096 }, height: { exact: 2160 } }
};

const eightKConstraints = {
    video: { width: { exact: 7680 }, height: { exact: 4320 } }
};
 */
</script>

<style scoped>
@import '../assets/css/webcam2.css';

button {
    margin: 0 10px 20px 0;
    min-width: 90px;
}

div#buttons {
    margin: 0 0 1em 0;
}

div#container {
    max-width: 100%;
}

#errormessage {
    display: none;
    /* font-size: 300%; */
    color: red;
}

#videoblock {
    display: none;
}

p#dimensions {
    height: 1em;
    margin: 0 0 1.5em 0;
}

video {
    background: none;
    height: auto;
    width: auto;
}
</style>