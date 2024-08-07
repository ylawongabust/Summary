from fontTools.ttLib import TTFont

f = open("YOUR_TEXT_FILE.txt", "w")

def get_font_characters(font_path):
    with TTFont(font_path, fontNumber=0) as font:

        cmap = font["cmap"]
        for ch, name in cmap.getBestCmap().items():
            f.write(chr(ch))


font_path = "YOUR_TTF_FILE.ttf"
get_font_characters(font_path)
