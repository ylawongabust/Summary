import { Room } from '@colyseus/core';
import { MyRoomState, Player } from './schema/MyRoomState';
import * as filter from './English/Filter';
import fs from 'fs';
import { clearInterval } from 'timers';

export class MyRoom extends Room {
    maxClients = 4;

    /**
     * @type {Array} chatList
     */
    chatList = []

    /**
     * 獲取最新5條聊天記錄給新用戶
     * @param {*} client 
     * @returns 
     */
    getChatListToNewPlayer(client) {
        const returnChatList = [];
        const RETURN_LENGTH = 5;

        if (this.chatList.length) {
            for (let index = this.chatList.length - 1; index >= 0 && returnChatList.length < RETURN_LENGTH; index--) {
                const c = this.chatList[index];

                const modifiedChat =
                {
                    type: c.type,
                    msg: c.msg || '',
                    format: c.format,
                    duration: c?.duration ?? 0.0,
                    sessionId: c.sessionId,
                }

                // global message
                if (c.type === 'global') {
                    returnChatList.unshift(modifiedChat);
                }
                // private message
                else if (c.targetSessionId == client.sessionId) {
                    returnChatList.unshift(modifiedChat);
                } else continue;
            }
        }
        return returnChatList;
    }

    onCreate(options) {
        this.setState(new MyRoomState());

        // 獲取用戶列表
        this.onMessage('get-users', (client) => {
            const result = [];
            this.clients.forEach((c) => {
                result.push({
                    sid: c.sessionId,
                });
            });
            client.send('get-users', result);
        });

        // 文字聊天（公/私）
        this.onMessage(
            'chating',
            /**
             * @param {*} client
             * @param {Object} obj
             * @param {'private'|'global'} obj.type
             * @param {string} obj.msg
             * @param {string|''} [obj.sid]
             */
            (client, obj = {}) => {
                try {
                    if (!obj?.type) {
                        return;
                    }

                    /**
                     * {Object} chat
                     * @property {'private'|'global'} type
                     * @property {string} msg
                     * @property {'text'|'audio'} format
                     * @property {string} sessionId
                     * @property {string|''} targetSessionId
                    */
                    const chat = {
                        type: obj.type,
                        msg: obj.msg || '',
                        format: 'text',
                        sessionId: client.sessionId,
                        targetSessionId: obj.sid,
                    };
                    this.chatList.push(chat);

                    let modifiedChat =
                    {
                        type: chat.type,
                        msg: chat.msg,
                        format: chat.format,
                        sessionId: chat.sessionId,
                    }

                    if (obj.type === 'private') {
                        const targetClient = this.clients.find((v) => v.sessionId === obj?.sid);
                        targetClient &&
                            targetClient.send('chat', modifiedChat);
                    } else {
                        this.broadcast('chat', modifiedChat, { except: client });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        );

        // 錄音中
        this.onMessage('recording', (client, _) => {
            const player = this.state.players.get(client.sessionId);

            // 錄音中
            player.pushing = true;
        });

        this.onMessage(
            'audio_transfer',

            /**
             * @param {*} client
             * @param {Object} obj
             * @param {'private'|'global'} obj.type
             * @param {string} obj.msg
             * @param {number} obj.duration
             * @param {string|''} obj.targetSessionId
             */
            (client, obj = {}) => {
                try {
                    if (!obj?.type) {
                        return;
                    }

                    // 過濾語音
                    let time = new Date();
                    let filteredAudio;
                    let fileName = `${client.sessionId}-${time.getFullYear()}${time.getMonth()}${time.getDate()}-${time.getHours()}${time.getMinutes()}${time.getSeconds()}${time.getMilliseconds()}`

                    // buffer轉回.webm
                    fs.writeFileSync(`./src/rooms/English/recordings/${fileName}.webm`, new Buffer.from(obj.msg));

                    // .webm轉.wav 16kHz sample rate
                    // filter.convertAudio(`./src/rooms/English/recordings/${fileName}.webm`, `./src/rooms/English/recordings/${fileName}_processed.webm`)
                    // .then(() => {
                    //     return new Promise((resolve) => {
                    //         setTimeout(() => {
                    //             resolve();
                    //         }, 500);
                    //     });
                    // })

                    // // 產生文字記錄
                    // .then(() => {
                    //     return new Promise((resolve) => {
                    //         const checkTranscript = setInterval(() => {

                    //             // 看看有沒有.wav
                    //             // 每150ms檢查一次
                    //             if (fs.existsSync(`./src/rooms/English/recordings/${fileName}.wav`))
                    //             {
                    //                 // 產生文字記錄
                    //                 filter.generateTranscript(`./src/rooms/English/recordings/${fileName}.wav`);
                    //                 clearInterval(checkTranscript);
                    //                 resolve();
                    //             }
                    //         }, 150);
                    //     });
                    // })

                    // .then(() => {
                    //     return new Promise((resolve) => {
                    //         const checkTranscript = setInterval(() => {

                    //             // 看看有沒有文字記錄
                    //             // 每150ms檢查一次
                    //             if (fs.existsSync(`./src/rooms/English/recordings/${fileName}.wav.json`))
                    //             {
                    //                 // 過濾語音
                    //                 filter.filterWords(`./src/rooms/English/recordings/${fileName}.wav`, `./src/rooms/English/recordings/${fileName}_processed.mp3`)
                    //                 clearInterval(checkTranscript);
                    //                 resolve();
                    //             }
                    //         }, 150);
                    //     });
                    // })

                    new Promise((resolve) => {
                        const checkAudio = setInterval(() => {

                            // 看看有沒有已過濾的語音
                            // 每150ms檢查一次
                            if (fs.existsSync(`./src/rooms/English/recordings/${fileName}.webm`)) {
                                // 準備buffer
                                filteredAudio = toArrayBuffer(fs.readFileSync(`./src/rooms/English/recordings/${fileName}.webm`));
                                if (filteredAudio.length > 0) {

                                    /**
                                     * {Object} chat
                                     * @property {'private'|'global'} type
                                     * @property {ArrayBuffer|string} msg
                                     * @property {'audio'|'text'} format
                                     * @property {number} duration - audio duration in ms
                                     * @property {string} sessionId
                                     * @property {string} targetSessionId
                                     */
                                    const chat = {
                                        type: obj.type,
                                        msg: filteredAudio || '',
                                        format: 'audio',
                                        duration: obj.duration,
                                        sessionId: client.sessionId,
                                        targetSessionId: obj?.sid,
                                    };

                                    this.chatList.push(chat);

                                    let modifiedChat =
                                    {
                                        type: chat.type,
                                        msg: chat.msg,
                                        format: chat.format,
                                        duration: chat.duration,
                                        sessionId: chat.sessionId,
                                    }

                                    if (obj.type === 'private') {
                                        const targetClient = this.clients.find((v) => v.sessionId === obj?.sid);
                                        targetClient &&
                                            targetClient.send('audio', modifiedChat);
                                    } else {
                                        this.broadcast('audio', modifiedChat, { except: client });
                                    }
                                    // console.log("Finished sending data to client");
                                    clearInterval(checkAudio);
                                    resolve();
                                }
                            }
                        }, 150);
                    })
                    .then(() => {
                        return new Promise((resolve) => {
                            const removeAudio = setInterval(() => {
                                if (fs.existsSync(`./src/rooms/English/recordings/${fileName}.webm`)) {
                                    fs.unlinkSync(`./src/rooms/English/recordings/${fileName}.webm`);
                                    clearInterval(removeAudio);
                                    resolve();
                                }
                            }, 150);
                        });
                    })

                } catch (error) {
                    console.log("Error catch: " + error);
                }
            }
        );
    }

    onJoin(client, options) {
        console.log(client.sessionId, 'joined!');
        this.broadcast('joined', {
            sid: client.sessionId,
        });
        this.state.players.set(client.sessionId, new Player());
        client.send('chat_list', this.getChatListToNewPlayer(client));
    }

    onLeave(client, consented) {
        console.log(client.sessionId, 'left!');
        this.broadcast('left', {
            sid: client.sessionId,
        });
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}



function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return view;
}