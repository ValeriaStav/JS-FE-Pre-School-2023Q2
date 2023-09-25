const player = document.querySelector(".player");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const title = document.querySelector(".title");
const track = document.querySelector(".track");
const background = document.querySelector(".background");
const cover = document.querySelector(".cover-img");
const imgSrc = document.querySelector(".img-src");
const audio = document.querySelector(".audio");
const currentTime = document.querySelector(".currentTime");
const durationTime = document.querySelector(".durationTime");
const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");

// Track's name and title

const tracks = ["Bones", "Young And Beautiful", "Save Your Tears"];
const titles = ["Imagine Dragons", "Lana Del Rey", "The Weeknd"];

// Default track

let trackIndex = 0;

// Init

function loadTrack(song) {
    title.innerHTML = titles[trackIndex];
    track.innerHTML = '"' + song + '"';
    audio.src = `assets/audio/${song}.mp3`;
    background.src = `assets/img/background1.jpg`;
    cover.src = `assets/img/cover${trackIndex + 1}.jpg`;
}

loadTrack(tracks[trackIndex]);

// Play

function playTrack() {
    player.classList.add("play");
    background.src = `assets/img/background${trackIndex + 1}.jpg`;
    cover.src = `./assets/img/cover${trackIndex + 1}.jpg`;
    imgSrc.src = `./assets/svg/icons8-pause-64.png`;
    audio.play();
}

// Pause

function pauseTrack() {
    player.classList.remove("play");
    imgSrc.src = "./assets/svg/icons8-play-64.png";

    audio.pause();
}

playBtn.addEventListener("click", () => {
    const isPlaying = player.classList.contains("play");
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

// Prev track

function prevTrack() {
    trackIndex--;

    if (trackIndex < 0) {
        trackIndex = tracks.length - 1;
    }

    loadTrack(tracks[trackIndex]);
    playTrack();
}

prevBtn.addEventListener("click", prevTrack);

// Next track

function nextTrack() {
    trackIndex++;

    if (trackIndex > tracks.length - 1) {
        trackIndex = 0;
    }

    loadTrack(tracks[trackIndex]);
    playTrack();
}

nextBtn.addEventListener("click", nextTrack);

// Time functions

function formatTime(time) {
    const min = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
    const sec = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
    return `${min}:${sec}`;
}

function setTime() {
    currentTime.innerText = formatTime(audio.currentTime);
    if (audio.duration) {
        durationTime.innerText = formatTime(audio.duration);
    }
}

audio.addEventListener("timeupdate", setTime);

// Progress bar

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTime.innerText = currentTime;
}

audio.addEventListener("timeupdate", updateProgress);

// Set progress

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

progressContainer.addEventListener("click", setProgress);

// Autoplay

audio.addEventListener("ended", nextTrack);

// Console

console.log(`1. Вёрстка +10:
✅ вёрстка аудиоплеера: есть кнопка Play/Pause, кнопки "Вперёд" и "Назад" для пролистывания аудиотреков, прогресс-бар, отображается название и автор трека +5
✅ в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5

2. Кнопка Play/Pause +10
✅ есть кнопка Play/Pause, при клике по которой можно запустить или остановить проигрывание аудиотрека +5
✅ внешний вид и функционал кнопки Play/Pause изменяется в зависимости от того, проигрывается ли в данный момент аудиотрек +5

3. При кликах по кнопкам "Вперёд" и "Назад" переключается проигрываемый аудиотрек. Аудиотреки пролистываются по кругу - после последнего идёт первый +10

4. При смене аудиотрека меняется изображение - обложка аудиотрека +10

5. Прогресс-бар отображает прогресс проигрывания текущего аудиотрека. При перемещении ползунка вручную меняется текущее время проигрывания аудиотрека +10

6. Отображается продолжительность аудиотрека и его текущее время проигрывания +10

7. Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
✅ высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо

Score: 70 / 70`);
