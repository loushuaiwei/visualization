from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import selenium.common.exceptions
import urllib.request
import json
import csv
import time
import re
import random

"""
商品ID  标题  价格  参数信息  评价数  好评度  热点评论词
"""

class JdSpider_HUAWEI_info():

    def open_file(self,filePath):
        self.fd = open(filePath,'w',encoding='utf-8',newline='')

    def open_browser(self):
        chrome_dirver = r"chromedriver.exe"
        self.driver = webdriver.Chrome(executable_path=chrome_dirver)
        self.driver.implicitly_wait(10)
        self.wait = WebDriverWait(self.driver,10)

    def init_variable(self):
        self.data = zip()
        self.url = 'https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&wq=shouji&pvid=2a0bc2db62494b8fa7812652a9e9cd6e'

    # 获取cookie，更换请求头
    def update_header(self,link):
        # 获取cookie
        cookie = ''
        for elem in self.driver.get_cookies():  # 记录相关的Cookie
            # elem 为 dict类型
            cookie += elem["name"] + "=" + elem["value"] + ";"
        self.headers['Cookie'] = cookie
        self.headers['Referer'] = link
        # 随机获取一个请求头
        self.headers['User-agent'] = random.choice(self.user_agent)

    def get_page_source(self,commentURL):
        req = urllib.request.Request(commentURL, None, self.headers)
        response = urllib.request.urlopen(req)
        comm = response.read().decode("gbk", 'ignore')
        comm = str(comm)
        start = comm.find('(') + 1
        comm = comm[start:-2]
        # print(comment)
        content = json.loads(comm)
        return content

    def parse_page_H(self):
        try:
            skus = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH,'//li[@class="gl-item"]')))
            skus = [item.get_attribute('data-sku') for item in skus]
            print('商品ID')
            print(skus)
            titles = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH,'//div[@class="gl-i-wrap"]/div[4]/a/em')))
            titles = [item.text for item in titles]
            print('标题')
            print(titles)
            prices = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, '//strong[@data-done="1"]/i')))
            prices = [item.text for item in prices]
            print('价格')
            print(prices)


            comments = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, '//div[@class="p-commit"]/strong/a')))
            commentCountStrs = [item.text for item in comments]
            print('评论数')
            print(commentCountStrs)

            shops = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, '//div[@class="p-shop"]/span/a')))
            shopInfos = [item.text for item in shops]
            print('店铺')
            print(shopInfos)

            icons = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, '//div[@class="p-icons"]/i')))
            iconInfos = [item.text for item in icons]
            print('来源')
            print(iconInfos)

            self.data = zip(skus,titles,prices,commentCountStrs,shopInfos,iconInfos)
        except selenium.common.exceptions.TimeoutException:
            print('parse_page: TimeoutException')
            self.count += 1
            self.turn_page(self.count)
            self.parse_page_H()
        except selenium.common.exceptions.StaleElementReferenceException:
            print('parse_page: StaleElementReferenceException')
            self.driver.refresh()

    def turn_page(self,count):
        self.url = 'https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=shouji&s=52&click=0'
        self.url = self.url + '&page=' + str(count)
        self.driver.get(self.url)


    def write_to_file(self):
        writer = csv.writer(self.fd)
        for item in self.data:
            writer.writerow(item)

    def close_file(self):
        self.fd.close()

    def close_browser(self):
        self.driver.quit()

    def crawl_H(self):
        self.open_file('data/phone_info.csv')
        self.open_browser()
        self.init_variable()
        print('开始爬取手机信息')
        self.driver.get(self.url)
        time.sleep(1)
        self.driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
        time.sleep(2)
        self.count = 1
        while self.count < 3:
            print('正在爬取第 ' + str(self.count) + ' 页......')
            self.parse_page_H()
            self.write_to_file()
            self.turn_page(self.count + 1)
            self.count += 1
        self.close_file()
        self.close_browser()
        print('手机结束爬取')

if __name__ == '__main__':
    spider = JdSpider_HUAWEI_info()
    spider.crawl_H()