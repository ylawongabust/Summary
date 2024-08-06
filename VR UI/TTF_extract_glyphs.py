from fontTools.ttLib import TTFont
import os
import numpy as np
import matplotlib.pyplot as plt
f = open("YOUR_PATH/FILE.txt", "w")

def get_font_characters(font_path):
    count = 0
    with TTFont(font_path, fontNumber=0) as font:

        glyph_name = font.getBestCmap().get(0x1F44B)
        glyph_path = font["glyf"][glyph_name].coordinates

        cmap = font["cmap"]
        for ch, name in cmap.getBestCmap().items():
            f.write(chr(ch))
            

# Usage:
font_path = "YOUR_PATH/FONT.TTF"
get_font_characters(font_path)
