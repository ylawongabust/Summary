from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time, os
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image


parent_name = ["/Quirky Series - Arctic Animals Vol.2 v1.4", "/Quirky Series - Farm Animals Vol.2 v1.4", "/Quirky Series - Forest Animals Vol.2 v1.4", "/Quirky Series - Pet Animals Vol.2 v1.4", "/Quirky Series - Safari Animals Vol.2 v1.4"]

for names in parent_name:
    file_name = "YOUR_PATH" + names + "/3D Files/GLTF"

    count = 0
    for glb in os.listdir(file_name):   # glb is the filename
        if (os.path.splitext(glb)[-1] != ".glb"): continue

        driver = webdriver.Chrome()

        # open the website
        driver.get("https://gltf-viewer.donmccurdy.com")

        file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
        file_input.send_keys(os.path.join(file_name, glb))

        dropout_menu = driver.find_element(By.XPATH, "/html/body/main/div[1]/div/div[2]/div/ul/li[1]/div/ul/li[1]")
        dropout_menu.click()

        time.sleep(1)
        text_box = driver.find_element(By.XPATH, "/html/body/main/div[1]/div/div[2]/div/ul/li[1]/div/ul/li[9]/div/div/input")

        text_box.click()
        text_box.send_keys(Keys.COMMAND, "a")
        time.sleep(1)
        text_box.send_keys(Keys.DELETE)
        time.sleep(0.5)
        text_box.send_keys("#ffffff", Keys.ENTER)
        time.sleep(1.5)

        dropout_menu = driver.find_element(By.XPATH, "/html/body/main/div[1]/div/div[2]/div/div")
        dropout_menu.click()
        time.sleep(1)
        image_path = 'YOUR_PATH'+os.path.splitext(glb)[0]+".png"
        
        element = driver.find_element(By.TAG_NAME, 'canvas')
        element.screenshot(image_path)
        
        # driver.save_screenshot(image_path)
        
        img = Image.open(image_path)
        img_crop = img.crop((100,50,600,550))
        img_crop = img_crop.resize((120,120))
        img_crop.save(image_path)
        # close the browser
        driver.quit()
        count += 1