const picker = document.getElementById('colorPicker');
const slider = document.getElementById("sizeSlider");
const topBar = document.getElementById("topBar");
const captureBtn = document.getElementById("captureBtn");
const video = document.getElementById("video");
const camWindow = document.getElementById("window");
const loaderContainer = document.getElementById("loaderContainer");
const captureButton = document.getElementById("capture");

let width = 640;
let height = 0;

let streaming = false;

function changeBgColor(color) {
  document.body.style.backgroundColor = color;
}

picker.addEventListener('input', (e) => changeBgColor(e.target.value));
picker.addEventListener('change', (e) => changeBgColor(e.target.value));

changeBgColor(picker.value);

video.setAttribute("width", width);

async function startWebcam() {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia not supported");
        return;
    }

    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream;
            loaderContainer.style.display = "none";
            video.play();
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });
}

function changeVideoSize() {
    height = video.videoHeight / (video.videoWidth / width);

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    camWindow.style.width = width;
    camWindow.style.height = height;
    //camMessage.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    startWebcam();
});

video.addEventListener("canplay", (event) => {

    if (!streaming) {
        changeVideoSize();
        streaming = true;
    }
});

slider.addEventListener("input", (event) => {

    width = event.target.value;

    if (width >= 640) {
        let scale = 1.25 * width/640;
        let btnScale = width/640;
        topBar.style.fontSize = `${scale}rem`;
        captureBtn.style.scale = btnScale;
    } else {
        topBar.style.fontSize = "1rem";
        captureBtn.style.scale = 1;
    }

    console.log(camWindow.clientWidth, camWindow.clientHeight);

    changeVideoSize();
});

captureButton.addEventListener("click", () => {

    captureBtn.disabled = true;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `Miru-Cam-${Date.now()}.png`;
        a.click();

        URL.revokeObjectURL(url);

    }, "image/png");
    captureBtn.disabled = false;
});