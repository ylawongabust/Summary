import { toastEl } from './doms';

let messageCounter = 0;
let playingID = null;

/**
 * @param {Object} opts
 * @param {'myself'|'global'|'private'} opts.role
 * @param {string} opts.msg
 * @param {'text'|'audio'} opts.format
 * @param {number} [opts.duration]
 * @param {string} opts.username
 */
export function addLog(opts = {}) {
    const logConEl = document.createElement('div');
    logConEl.classList.add('chat-log');

    const usernameEl = document.createElement('span');
    const usernameElRoleClass = ['myself', 'global', 'private'].includes(opts?.role) ? opts.role : 'global';
    const usernameElText = opts.role === 'myself' ? opts.username + ' (You)' : opts.username;
    usernameEl.classList.add('username', usernameElRoleClass);
    usernameEl.innerText = usernameElText;
    logConEl.appendChild(usernameEl);

    if (opts.format === 'text') {
        const msgEl = document.createElement('span');
        msgEl.id = "message_" + messageCounter++;
        msgEl.classList.add('message');
        msgEl.innerText = opts.msg || '';
        logConEl.appendChild(msgEl);
        return logConEl;
    }
    else if (opts.format === 'audio') {
        let audioBlob = new Blob([opts.msg], { type: 'audio/mp3' }); // 格式為mp3
        const audioUrl = URL.createObjectURL(audioBlob);
        let audio = new Audio(audioUrl);

        // 語音長度
        const line = document.createElement('div');
        line.classList.add("recording");

        let minutes, seconds;
        minutes = Math.floor((opts.duration % (1000 * 60 * 60)) / (1000 * 60));
        if ((opts.duration % (1000 * 60) / 1000) < 10) {
            seconds = Math.ceil((opts.duration % (1000 * 60)) / 1000);
        }
        else if (Math.ceil((opts.duration % (1000 * 60)) / 1000) === 60) {
            seconds = 0;
            minutes += 1;
        }
        else {
            seconds = Math.ceil((opts.duration % (1000 * 60)) / 1000)
        }

        line.innerHTML = `${minutes}:${seconds < 10? "0" + seconds: seconds}`;

        // 播放按鈕
        const voiceEl = document.createElement('button');
        voiceEl.id = "message_" + messageCounter++;
        voiceEl.classList.add('message');
        voiceEl.classList.add('audio');
        voiceEl.onclick = e => {

            // 暫停播放
            if (voiceEl.classList.contains('playing')) {
                console.log("Stop playing recording");
                playingID = null;
                audio.pause();
                voiceEl.classList.remove("playing");
            }

            // 開始播放
            else {
                console.log("Playing recording");

                // 沒有播放中的語音
                if (playingID === null) {
                    playingID = voiceEl.id;
                    audio.play();
                    voiceEl.classList.add('playing');
                }

                // 需要暫停播放中的語音
                else {
                    document.getElementById(playingID).click();
                    playingID = voiceEl.id;
                    audio.play();
                    voiceEl.classList.add('playing');
                }
            }

            // 播放完
            audio.onended = function () {
                console.log("Finish playing recording")
                playingID = null;
                voiceEl.classList.remove("playing");
            }
        }

        line.appendChild(voiceEl);
        logConEl.appendChild(line);
        return logConEl;
    }
}

/**
 * @param {Object} opts
 * @param {'global'|'private'} opts.role
 * @param {string} opts.msg
 * @param {'text'|'audio'} opts.format
 * @param {number} opts.duration
 * @param {string} opts.username
 * @param {number} [delay=1500]
 */
export function toastLog(opts = {}, delay = 1500) {
    toastEl.innerHTML = '';

    const el = addLog(opts);
    el.style.transition = `opacity ${delay / 1000}s`;
    toastEl.appendChild(el);

    return setTimeout(() => {
        toastEl.innerHTML = '';
    }, delay);
}

/**
 *
 * @param {NodeJS.Timeout} timeout
 */
export function clearToast(timeout) {
    toastEl.innerHTML = '';
    clearTimeout(timeout);
}
