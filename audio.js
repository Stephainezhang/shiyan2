// 播放按钮
var playPause = document.getElementsByClassName('playPause')[0];
var audio = document.getElementById('audioTag');
var body = document.body;
var recordImg = document.getElementById('record-img');
var beforeMusic = document.getElementsByClassName('beforeMusic')[0];
var nextMusic = document.getElementsByClassName('nextMusic')[0];
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-name')[0];
// 播放时间
var playedTime = document.getElementsByClassName('played-time')[0];
var totalTime = document.getElementsByClassName('audio-time')[0];
// 播放模式
var playMode = document.getElementsByClassName('playMode')[0];

var closeContainer = document.getElementsByClassName('close-container')[0];
var listContainer = document.getElementsByClassName('list-container')[0];
var listIcon = document.getElementById('list');

var musicLists = document.getElementsByClassName('musicLists')[0];

//音量
var volume = document.getElementsByClassName('volumn')[0];
var volumeTogger = document.getElementById('volumn-togger');

// 倍速按钮
var speed = document.getElementById('speed');
// 进度条
var progressPlay = document.getElementsByClassName('progress-play')[0];
// 歌曲名称
var musicData = [
    ['洛春赋', '25216950603张乐儿'],
    ['Yesterday', '张乐儿'],
    ['张乐儿', '杨树人'],
    ['Vision pt.II', '张乐儿'],
];
var musicId = 0;

// 初始化这些音乐
function initMusic() {
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');

    // 当音乐元数据完成加载时出发下面这个函数
    audio.onloadedmetadata = function () {
        recordImg.style.backgroundImage = `url('./img/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('./img/bg${musicId}.png')`;
        musicTitle.innerText = musicData[musicId][0];
        authorName.innerText = musicData[musicId][1];
        refreshRotate();
        totalTime.innerText = formatTime(audio.duration);
        audio.currentTime = 0;
    };
}
initMusic();

// 初始化并自动播放
function initAndPlay() {
    initMusic();
    audio.play();
    rotateRecord();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');
}

// 点击播放按钮
playPause.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        playPause.classList.remove('icon-play');
        playPause.classList.add('icon-pause');
    }
    else {
        audio.pause();
        rotateRecordStop();
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }

});

function rotateRecord() {
    recordImg.style.animationPlayState = `running`;
}
function rotateRecordStop() {
    recordImg.style.animationPlayState = `paused`;
}
function refreshRotate() {
    recordImg.classList.add(`rotate-play`);
}
// 跳转到下一首
nextMusic.addEventListener('click', function () {
    musicId++;
    if (musicId >= musicData.length) {
        musicId = 0;
    }
    initAndPlay();
});
beforeMusic.addEventListener('click', function () {
    musicId--;
    if (musicId < 0) {
        musicId = musicData.length - 1;
    }
    this;
    initAndPlay();
});
// 时间格式化
function formatTime(value) {
    var hour = parseInt(value / 3600);
    var minute = parseInt((value % 3600) / 60);
    var second = parseInt(value % 60);
    if (hour > 0) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }
    return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
}


audio.addEventListener('timeupdate', updateProgress);
// 音乐进度更新
function updateProgress() {
    playedTime.innerText = formatTime
        (audio.currentTime);
    var value = audio.currentTime / audio.duration;
    progressPlay.style.width = value * 100 + '%';
}

// 音乐模式
var modeId = 1;
playMode.addEventListener('click', function () {
    modeId++;
    if (modeId > 3) {
        modeId = 1;
    }
    playMode.style.backgroundImage = `url('img/mode${modeId}.png')`;
});
audio.addEventListener('ended', function () {
    if (modeId == 2) {
        musicId = (musicId + 1) % musicData.length;
    }
    else if (modeId == 3) {
        var oldId = musicId;
        while (true) {
            // Math.random()是在0-1之间随机数
            musicId = Math.floor(Math.random() * musicData.length);
            if (musicId != oldId) {
                break;
            }
        }
    }
    initAndPlay();
});

//记录上一次音量
var lastVolume = 70;
audio.volume = lastVolume / 100;
//音量调节
volume.addEventListener('click', setVolume);
function setVolume() {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        volumeTogger.value = lastVolume;
        audio.volumn = lastVolume / 100;
    }
    else {
        audio.muted = true;
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
    }
    updateVolumeIcon();
}
volumeTogger.addEventListener('input', updateVolume);


//音量滑动块
function updateVolume() {
    const volumeValue = volumeTogger.value / 100;
    audio.volume = volumeValue;
    if (volumeValue > 0) {
        audio.muted = false;
    }
    updateVolumeIcon();
}

//更新音量图标
function updateVolumeIcon() {
    if (audio.muted || audio.volume === 0) {
        volume.style.backgroundImage = `url('img/静音.png')`;
    }
    else {
        volume.style.backgroundImage = `url('img/音量.png')`;
    }
}

//倍速
speed.addEventListener('click', function () {
    var speedText = speed.innerText;
    if (speedText == '1.0X') {
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    }
    else if (speedText == '1.5X') {
        speed.innerText = '2.0X';
        audio.playbackRate = 2.0;
    }
    else if (speedText == '2.0X') {
        speed.innerText = '0.5X';
        audio.playbackRate = 0.5;
    }
    else if (speedText == '0.5X') {
        speed.innerText = '1.0X';
        audio.playbackRate = 1.0;
    }
});

// 列表
listIcon.addEventListener('click', function () {
    listContainer.classList.remove('list-hide');
    listContainer.classList.add('list-show');
    closeContainer.style.display = 'block';
    listContainer.style.display = 'block';
});
closeContainer.addEventListener('click', function () {
    listContainer.classList.remove('list-show');
    listContainer.classList.add('list-hide');
    closeContainer.style.display = 'none';
    // listContainer.style.display = 'none';
});


function createMusic() {
    for (let i = 0; i < musicData.length; i++) {
        let div = document.createElement('div');
        div.innerText = `${musicData[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click', function () {
            musicId = i;
            initAndPlay();
        });
    }
}
document.addEventListener('DOMContentLoaded', createMusic);
