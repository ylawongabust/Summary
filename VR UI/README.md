# VR UI

1. [chatbox](chatbox)

	This directory stores the icons used in the UI.

2. [SVG](SVG)

	This directory stores all the emoji SVGs needed and the .txt files contain lists of SVG file names that will be used in this UI.

3. [fonts](fonts)

	This directory contains some possible candidates for Chinese font in the UI. 

4. [emoji_retriever.py](emoji_retriever.py)

	This program automatically extracts emoji PNGs from [https://emojipedia.org/microsoft/windows-11-23H2](https://emojipedia.org/microsoft/windows-11-23H2) and [https://emojipedia.org/microsoft/windows-11-22H2](https://emojipedia.org/microsoft/windows-11-22H2). Then, the PNGs will be fine-tuned and converted to SVGs.

5. [index.html](index.html), [script.js](script.js)

	This is the UI. 

	#### Usage
	```
	cd VR\ UI/
	npx vite
	```

	Open [http://localhost:5173/](http://localhost:5173/).
