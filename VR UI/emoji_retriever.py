from bs4 import BeautifulSoup
import requests
from PIL import Image
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
import aspose.words as aw
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# This html file contains the html from https://emojipedia.org/microsoft/windows-11-23H2 OR https://emojipedia.org/microsoft/windows-11-22H2
with open('YOUR_FILE.html', 'r', encoding='utf-8') as file:
    html_cont = file.read()

    
soup = BeautifulSoup(html_cont, 'html.parser')

hrefs = []

a_tags = soup.find_all('a')
counter = 0
for tag in a_tags:
	url=f"https://emojipedia.org{tag.get('href')}"
	print(url)
	chrome_options = Options()
	chrome_options.add_argument("--headless")
	chrome_options.set_capability('pageLoadStrategy', 'eager')
	with Chrome(options=chrome_options) as browser:
		wait = WebDriverWait(browser, 5)
		browser.get(url)
		
		wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "img[alt='Windows 11 22H2']")))
		browser.execute_script("window.stop();")
		# time.sleep(1.5)
		html = browser.page_source
		soup = BeautifulSoup(html, 'html.parser')

		for link in soup.find_all("img", {"alt" : "Windows 11 22H2"}):	# OR {"alt" : "Windows 11 23H2"} depends on which on version of emojis is using
				
			data = requests.get(link.get("src")).content
			with open(f"./YOUR_PATH/{counter}.png", "wb") as f:
				f.write(data)

			img = Image.open(f"./YOUR_PATH/{counter}.png")
			new_width, new_height = 90, 90  # PNGs are reduced to 90 x 90
			resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
			resized_img.save(f"./YOUR_PATH/FILENAME_{counter}.png")
			doc = aw.Document()
			builder = aw.DocumentBuilder(doc)
			shape = builder.insert_image(f"./YOUR_PATH/FILENAME_{counter}.png")
			shape.get_shape_renderer().save(f"./YOUR_PATH/FILENAME_{counter}.svg", aw.saving.ImageSaveOptions(aw.SaveFormat.SVG))
	counter += 1
