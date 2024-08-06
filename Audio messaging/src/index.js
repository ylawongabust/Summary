import { Client } from 'colyseus.js';
// doms
import * as doms from './Scripts/js/doms';
import { addLog, clearToast, toastLog } from './Scripts/js/doms.Log';

// 連接server
const client = new Client('ws://localhost:2567');

// global variable
let clientRoom;

/** 
 * 計時器的variable
*/
let startTime;
let endTime;
let recording = false;

/**
 * 錄音時的data會放在這裡
 */
let audioChunks = [];

/**
 * @type {?MediaStream}
 */
let stream;
/**
 * @type {?MediaRecorder}
 */
let rec = null;

let timeout = 0;

/**
 * client的聊天紀錄
 */
let chatLogs = [];

/**
 * userList不包括自己
 */
const userList = [];
let targetUserSid = '';

let micPermission = false;

// 進入房間
client
    .joinOrCreate('my_room')
    .then((room) => {
        // 儲存房間的資料
        clientRoom = room;

        // 處理房間人員列表
        clientRoom.onMessage('get-users', (message) => {
            try {
                message?.length &&
                    message.forEach((u) => {
                        if (u.sid && !userList.includes(u.sid) && clientRoom.sessionId !== u.sid) {
                            userList.push(u.sid);
                        }
                    });
            } catch (error) {
                console.error(error);
            }
        });
        clientRoom.onMessage('joined', (message) => {
            try {
                message?.sid && !userList.includes(message.sid) && userList.push(message.sid);
                console.log(userList);
            } catch (error) {
                console.error(error);
            }
        });
        clientRoom.onMessage('left', (message) => {
            try {
                const index = userList.findIndex((v) => v === message.sid);
                if (index !== -1) {
                    userList.splice(index, 1);
                }

                if (targetUserSid === message?.sid) {
                }
            } catch (error) {
                console.error(error);
            }
        });

        clientRoom.onMessage('chat', (message) => {
            const isMe = message?.sessionId === clientRoom.sessionId;
            
            /**
             * {Object} logObj
             * @property {boolean} isMe
             * @property {'private'|'global'} type
             * @property {ArrayBuffer|string} msg
             * @property {'audio'|'text'} format
             * @property {string} sessionId
             */
            const logObj = {
                isMe,
                type: message?.type,
                msg: message?.msg,
                format: message?.format,
                sessionId: message?.sessionId,
            };
            chatLogs.push(logObj);

            // 聊天列表在關閉狀態
            if (doms.logsConEl.dataset?.status === 'close') {
                clearUserList();
                if (!isMe) {
                    clearToast(timeout);
                    timeout = toastLog({
                        role: message?.type,
                        msg: message?.msg,
                        format: message?.format,
                        username: message?.sessionId,
                    });
                }
            } 
            // 聊天列表在開啟狀態
            else {
                const role = isMe ? 'myself' : message.type;
                doms.logsEl.appendChild(addLog({ role, msg: message?.msg, format: message?.format, username: message?.sessionId}));
            }
        });

        // server傳送錄音data給client
        // 處理server發出的信息
        clientRoom.onMessage('audio', (message) => {
            const isMe = message?.sessionId === clientRoom.sessionId;
            
            /**
             * {Object} logObj
             * @property {boolean} isMe
             * @property {'private'|'global'} type
             * @property {ArrayBuffer|string} msg
             * @property {'audio'|'text'} format
             * @property {number} [duration] - audio duration in ms
             * @property {string} sessionId
             */
            const logObj = {
                isMe,
                type: message?.type,
                msg: message?.msg,
                format: message?.format,
                duration: message?.duration,
                sessionId: message?.sessionId,
            };
            chatLogs.push(logObj);

            console.log("語音大小 (receiver): " + message.msg.byteLength / 1024 + " KB");

            // 聊天列表在關閉狀態
            if (doms.logsConEl.dataset?.status === 'close') {
                clearUserList();
                if (!isMe) {
                    clearToast(timeout);
                    timeout = toastLog({
                        role: message?.type,
                        msg: message?.msg,
                        format: message?.format,
                        duration: message?.duration,
                        username: message?.sessionId,
                    });
                }
            } 
            // 聊天列表在開啟狀態
            else {
                const role = isMe ? 'myself' : message.type;
                doms.logsEl.appendChild(addLog({ role, msg: message?.msg, format: message?.format, username: message?.sessionId, duration: message?.duration }));
            }
        });

        // 信息紀錄         
        clientRoom.onMessage('chat_list', (message) => {

            /**
             * {Array} chatList
             */
            const chatList = message;
            
            if (chatList?.length) {
                for (let i = 0; i < chatList.length; i++) {
                    
                    /**
                     * {Object} chat
                     * @property {'private'|'global'} type
                     * @property {ArrayBuffer|string} msg
                     * @property {'audio'|'text'} format
                     * @property {number} [duration] - audio duration in ms
                     * @property {string} sessionId
                     */
                    const chat = chatList[i]

                    const isMe = chat?.sessionId === clientRoom.sessionId;
                    const logObj = {
                        isMe,
                        type: chat?.type,
                        msg: chat?.msg,
                        format: chat?.format,
                        duration: chat?.duration,
                        sessionId: chat?.sessionId,
                    };

                    // 把歷史信息加到local
                    chatLogs.push(logObj);
                }
            }
        });        
        doms.sessionIdEl.innerText = room.sessionId;
        console.log('session id: ' + room.sessionId);
        clientRoom.send('get-users');
    })
    .catch((e) => {
        console.error('join error', e);
        doms.sessionIdEl.innerText = '';
    });


function handlerFunction(stream) {
    // 錄音機
    const options = {
        audioBitsPerSecond: 64000, // bitrate: 64kbps
        numChannels:1,
      };
    
    rec = new MediaRecorder(stream, options);

    rec.ondataavailable = (e) => {
        // 儲存錄音的data
        audioChunks.push(e.data);
    };

    rec.onstop = async (e) => {
        try {
            if ((endTime - startTime) < 250) {
                alert("錄音時間太短！");
                return;
            }
            const type = targetUserSid ? 'private' : 'global';
            
            audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            audioBlob.arrayBuffer().then( (msg) => {
                console.log("語音大小 (sender): " + msg.byteLength / 1024 + " KB");
                clientRoom.send('audio_transfer', { type, msg, duration: (endTime - startTime), sid: targetUserSid});
                
                const logObj = {
                    isMe: true,
                    type: type,
                    msg: msg,
                    format: 'audio',
                    duration: (endTime - startTime),
                    sessionId: clientRoom.sessionId,
                };
                chatLogs.push(logObj);

                if (doms.logsConEl.dataset?.status === 'close') {
                    clearUserList();
                } 
                // 聊天列表在開啟狀態
                else {
                    doms.logsEl.appendChild(addLog({ role: 'myself', msg: msg, format: 'audio', username: clientRoom.sessionId, duration: (endTime - startTime)}));
                }

                cancelTargetUser();
            });
        } catch (error) {
            console.log(error);
        } finally {
            audioChunks = []; // 清空数据
        }
    };
}

// 語音按鈕（開始錄音）
doms.sendVoiceBtnEl.addEventListener('pointerdown', () => {
    try {
        // 檢查mic權限
        navigator.permissions.query({ name: 'microphone' })
        .then((permissionStatus) => {
            // 有mic權限
            if (permissionStatus.state === 'granted') {
                micPermission = true;
                streamFunc = async () => {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true})

                    if (stream instanceof MediaStream && rec === null) {

                        handlerFunction(stream);
            
                        doms.sendVoiceBtnEl.classList.add('active');
                        
                        // 時間器
                        doms.chatInputEl.disabled = true;
                        const timer = document.createElement("div");
                        timer.id = "timer"
                        timer.classList.add("flex-1", "h-5", "mx-[10px]", "bg-[#fff0]", "rounded-[10px]", "text-white", "p-2", "font-sans", "text-sm", "items-center", "flex")

                        doms.chatInputEl.parentNode.replaceChild(timer, doms.chatInputEl);
            
                        clientRoom.send('recording');
                        startTime = new Date();
                        console.log('Start recording');
                        rec.start(); // 開始錄音
                        recording = true;
            
                        let x = setInterval(function () {
                            let now = new Date();
                            let distance = now - startTime;
                    
                            // 顯示時間
                            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                            timer.innerHTML = `${minutes}:${seconds<10?"0"+seconds:seconds}`;
            
                            if (!recording) {
                                clearInterval(x);
                            }
                        }, 200);
                    }
                }
                streamFunc();  
            } 

            // 沒有mic權限
            else {  
                alert('麥克風權限尚未授予。');
                micPermission = false;

                // 請求mic權限
                navigator.mediaDevices.getUserMedia({ audio: true})
                // .then((_) => {
                //     console.log('Microphone permission granted.')
                // })
                .catch((_) => {
                    alert('找不到合適的麥克風。')
                });
            }
        })
        .catch((error) => {
            console.error('Error checking microphone permission:', error);
        });
    } catch (error) {
        console.error(error);
        doms.sendVoiceBtnEl.classList.remove('active');
    }
});

// 語音按鈕（結束錄音）
doms.sendVoiceBtnEl.addEventListener('pointerup', () => {
    // 沒有mic權限
    if (!micPermission) 
    {
        return;
    }
    // 解決錄音過短報錯的問題
    const elementPresent = setInterval(() => {
        if (document.getElementById("timer") && rec)
        {
            doms.sendVoiceBtnEl.classList.remove('active');
            
            // 顯示text box
            doms.chatInputEl.disabled = false;
            document.getElementById("timer").parentNode.replaceChild(doms.chatInputEl, document.getElementById("timer"));
            endTime = new Date();
            rec.stop(); // 結束錄音
            console.log('End recording');
            rec = null;
            stream = null;
            recording = false;
            
            clearInterval(elementPresent);
        }
    }, 100);  
});

// 選中用戶
function updateTargetUser(sid) {
    cancelTargetUser();
    targetUserSid = sid;
    const cancelIconEl = document.createElement('i');
    cancelIconEl.classList.add('cancel-icon', 'w-4', 'h-4', 'active');
    cancelIconEl.onclick = cancelTargetUser;
    const el = document.createElement('span');
    el.innerText = sid;
    el.classList.add('text-sm', 'select-none', 'px-1');
    doms.targetUserEl.append(cancelIconEl, el);
}
// 取消選中
function cancelTargetUser() {
    doms.targetUserEl.innerHTML = '';
    targetUserSid = '';
}
// 更新用戶列表（ui）
function updateUserListEls() {
    clearUserList();
    setLogsDisplay(false);
    if (userList.length) {
        doms.showUserListBtnEl.dataset.status = 'open';
        doms.userListEl.classList.remove('hidden');
        userList.forEach((sid) => {
            if (sid === clientRoom?.sessionId) {
                return;
            }
            const btnEl = document.createElement('span');
            btnEl.classList.add('hover:bg-[#0004]', 'px-1', 'cursor-pointer', 'text-[0.75rem]', 'select-none');
            btnEl.innerText = sid;
            btnEl.onclick = () => {
                updateTargetUser(sid);
                clearUserList();
            };

            doms.userListEl.appendChild(btnEl);
        });
    }
}
// 清空用戶列表（ui）
function clearUserList() {
    doms.showUserListBtnEl.dataset.status = 'close';
    doms.userListEl.innerHTML = '';
    doms.userListEl.classList.add('hidden');
}
doms.showUserListBtnEl.onclick = () => {
    if (doms.showUserListBtnEl.dataset.status === 'close') {
        updateUserListEls();
    } else {
        clearUserList();
    }
};

function setLogsDisplay(isDisplay = false) {
    if (isDisplay) {
        doms.logsConEl.dataset.status = 'open';
        doms.logsSubConEl.classList.remove('hidden');
        doms.logsNavEl.classList.remove('hidden');

        clearToast(timeout);
    } else {
        doms.logsConEl.dataset.status = 'close';
        doms.logsSubConEl.classList.add('hidden');
        doms.logsNavEl.classList.add('hidden');
    }
}
// 展開聊天列表
doms.showLogBtnEl.addEventListener('click', () => {
    setLogsDisplay(doms.logsConEl.dataset?.status === 'close');
    selectLogsContent(doms.tabsEl.dataset.selected);
    clearUserList();
});

/**
 * @param {'global'|'private'} type
 */
function selectLogsContent(type = 'global') {
    doms.logsEl.innerHTML = '';
    chatLogs.forEach((v) => {
        if (v.type === type) {
            const role = v.isMe ? 'myself' : v.type;
            doms.logsEl.appendChild(addLog({ role, msg: v.msg, format: v.format, username: v.sessionId, duration: v?.duration }));
        }
    });
    doms.tabsEl.dataset.selected = type;
    if (type === 'private') {
        doms.tabGlobalEl.classList.remove('active');
        doms.tabPrivateEl.classList.add('active');
    } else {
        doms.tabsEl.dataset.selected = 'global';
        doms.tabPrivateEl.classList.remove('active');
        doms.tabGlobalEl.classList.add('active');
    }
}
// 切換公私聊
doms.tabGlobalEl.addEventListener('click', () => {
    selectLogsContent('global');
});
doms.tabPrivateEl.addEventListener('click', () => {
    selectLogsContent('private');
});

// 發送信息
doms.sendtextBtnEl.onclick = () => {
    const msg = doms.chatInputEl.value;
    const type = targetUserSid ? 'private' : 'global';
    if (!msg?.trim()) {
        doms.chatInputEl.value = '';
        alert('不可發送空内容！');
    } else {
        doms.chatInputEl.value = '';
        clientRoom.send('chating', { type, msg, sid: targetUserSid });
        
        const logObj = {
            isMe: true,
            type: type,
            msg: msg,
            format: 'text',
            sessionId: clientRoom.sessionId,
        };
        chatLogs.push(logObj);

        if (doms.logsConEl.dataset?.status === 'close') {
            clearUserList();
        } 
        // 聊天列表在開啟狀態
        else {
            doms.logsEl.appendChild(addLog({ role: 'myself', msg: msg, format: 'text', username: clientRoom.sessionId}));
        }

        cancelTargetUser();
    }
};

document.addEventListener('blur', () => {
    doms.sendVoiceBtnEl.classList.remove('active');
});

// 輪詢用戶列表
setInterval(() => {
    clientRoom && clientRoom.send('get-users');
}, 5000);
