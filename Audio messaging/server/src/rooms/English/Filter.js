const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

/**
 * 產生文字記錄
 * @param {*} outputFileDir - 文字記錄檔案名稱為 outputFileDir+".json"
 * @returns 
 */
export function generateTranscript(outputFileDir)
{
	return new Promise((resolve) => {
		
		try {
			exec(`"./src/rooms/English/main" -m "./src/rooms/English/ggml-small.en.bin" -f "${outputFileDir}" -oj --max-len 2 -bs 8 -sow -wt 0.1 -tp 0.3`, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return;
				}
			});
			resolve();
		} catch (error) {
			console.log("Error at generate transcript: " + error);
		}
	});
}

/**
 * 將.webm轉為.wav 16kHz sample rate
 * @param {string} inputFileDir - .webm
 * @param {string} outputFileDir - .wav
 * @returns 
 */
export function convertAudio(inputFileDir, outputFileDir)
{
	return new Promise((resolve) => {
		ffmpeg()
			.input(inputFileDir)
			.audioFrequency(16000)
			.audioChannels(1)
			.audioCodec("pcm_s16le")
			.output(outputFileDir)
			.on("end", async () => {
				// console.log("Finished converting audio to supporting format");
				resolve();
			})
			.on("error", (err) => {
				console.error("Error at converting audio: ", err.stack);
			})
			.run();
	});
}


/**
 * 過濾語音
 * @param {string} inputFileDir - .wav
 * @param {string} outputFileDir - .mp3
 * @returns 
 */
export function filterWords(inputFileDir, outputFileDir) {
	return new Promise((resolve) => {
		
		// 文字記錄
		const audioInfo = JSON.parse(fs.readFileSync(inputFileDir + ".json", { encoding: 'utf8', flag: 'r' }));;

		let word = '';
		let complexFilter = [];
		let counter = 0;
		let lastEndTime = 0.0;

		// 將有問題的字消音
		audioInfo.transcription.forEach(e => {
			word = e.text;

			if (checkWord(word)) {
				
				complexFilter.push(
					{
						filter: 'atrim', options: { start: lastEndTime, end: e.offsets.from / 1000 },
						inputs: `${counter}`, outputs: `${counter}`
					}
				);
				counter++;
				complexFilter.push(
					{
						filter: 'atrim', options: { start: e.offsets.from / 1000, end: e.offsets.to / 1000 },
						inputs: `${counter}`, outputs: `${counter}`
					}
				);
				complexFilter.push(
					{
						filter: 'volume', options: '0',
						inputs: `${counter}`, outputs: `${counter}`
					}
				)
				counter++;
				lastEndTime = e.offsets.to / 1000;
			}
		});

		// 需要消音
		if (counter > 0) {
			complexFilter.push(
				{
					filter: 'atrim', options: { start: lastEndTime },
					inputs: `${counter}`, outputs: `${counter}`
				}
			);
			counter++;

			let splitFilter = `asplit=${counter}`;
			let streamList = [];
			for (let i = 0; i < counter; i++) {
				splitFilter += `[${i}]`;
				streamList.push(`${i}`);
			}
			complexFilter.unshift(splitFilter);
			complexFilter.push(
				{
					filter: 'concat', options: { n: counter, v: 0, a: 1 },
					inputs: streamList, outputs: 'output'
				}
			)

			ffmpeg()
				.input(`${inputFileDir}`)
				.complexFilter(complexFilter, 'output')
				.output(`${outputFileDir}`)
				.on("end", async () => {
					// console.log('Finished profanity filtering');
					resolve();
				})
				.on("error", (err) => {
					console.error("Error (filter applied): " + err);
				})
				.run();
				resolve();
		}

		// 不需要消音
		else {
			ffmpeg()
				.input(`${inputFileDir}`)
				.output(`${outputFileDir}`)
				.on("end", async () => {
					// console.log('Finished profanity filtering');
					resolve();
				})
				.on("error", (err) => {
					console.error("Error (filter not applied): " + err);
				})
				.run();	
		}
	});
}

const wordList = JSON.parse(fs.readFileSync('./src/rooms/English/words.json', { encoding: 'utf8', flag: 'r' }));
function checkWord(word) {
	
	for (let i = 0; i < wordList.length; i++) {
		if (word.replace(/[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '').toLowerCase() == wordList[i].replace(/[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '').toLowerCase()) {
			return true;
		}
	}
	return false;
}

