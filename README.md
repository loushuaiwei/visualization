# visualization

### (1)数据采集--京东爬虫

环境：Windows7+python3.6+Pycharm2017

目标：抓取京东商品列表页面信息：售价、评论数、商品名称-----以手机为例

---全部文章： 京东爬虫 、链家爬虫、美团爬虫、微信公众号爬虫、字体反爬、Django笔记、阿里云部署、vi\vim入门----

打开京东首页，搜索框输入‘手机’搜索，显示结果如下图。搜索结果显示一共有100页，每页有60条商品信息，抓取每件商品的售价、名称、评价数量。抓取这100页数据存入csv文件中。

一、思路分析

首先每一页有60条商品信息，但是当你打开网页的时候会发现，每次只加载前面30条信息，后面的30条信息在你下拉浏览的时候才会加载，如下图。也就是说后30条信息是动态加载的，于是我们认为每一页的信息可以分为前30条和后30条分开抓取。

前30条信息的抓取：    第一页的url如下，直接用requests.get 请求就能得到前30条商品信息。

https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&pvid=aa18c6ce55624fe0a035e154834f062e

后30条信息的抓取：既然这30条信息是动态加载，我们希望找到对应的API接口，然后构造请求来模拟浏览器。右键检查打开Chrome浏览器的开发者模式，点击Network，选择 XHR类型，下拉京东页面，可以发现抓取到两条请求。点击第一条，单击右边的Response项可以发现返回的是一串HTML代码，其中就包含着我们想要的后30条手机的信息。

点击Headers，找到请求的url地址，请求的header信息，是一个get请求，如上图。

翻页的实现：

我们已经知道了每一页的商品信息如何抓取，接下来如何翻页是我们要考虑的问题。一般get请求实现翻页都是url中有一个对应的Page参数，通过改变这个参数来定位不同页面。我们多翻几页，来看下url的变换规律。如下图，url中一共包含两个变化的参数，一个是page，一个是s。page参数很容易发现就是当前页数n*2-1，至于这个s参数，也是一种累加的关系，但是每次增加的值不是固定的，尤其是前面几页。后面再讨论。

至于后30条信息的url的变化规律，我们先看下这个网址，很长。首先url尾部的一串数字共30个，很容易想到是当页前30条商品的ID，实际发送请求时去掉也不影响。还有tpl=3也可以去掉，不影响。

https://search.jd.com/s_new.php?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&cid2=653&cid3=655&page=8&s=204&scrolling=y&log_id=1530006198.15672&tpl=3_M&show_items=1058633586,15610845215,6176077,5361711,16840903541,27141647261,5934357,28505252057,5424574,6610412,7930067,28769336369,5019352,22225587075,27865526962,11378358411,3901175,26642320667,7643011,28410642805,28756072324,11792731652,26188176454,11077796654,5716981,7438300,26817351676,6069862,21759433312,25863368410

最后url精简到：

https://search.jd.com/s_new.php?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&cid2=653&cid3=655&page=8&s=204&scrolling=y&log_id=1530006198.15672

观察后发现url包含三个变化的参数，page，s，还有log_id ，跟上面相比多了一个log_id。这个参数其实就是Unix时间戳，表示当前的时间，直接调用time函数就可以得到。page就是当前页数n*2 。关于这个s参数，这两个url的s参数每次增加的并不是固定值，你多试几次发现每次都会不一样，包括第一页的s值。大概就是每次增加50+，这个s不同，我觉得就像代表不同的排列顺序。因为这个你搜索‘手机’，其实过一段时间这个出来结果就会有些变化。谁排前面，谁排后面。还有就是一页60条商品中其实有一些是广告，如下图红米6右下角。还有价格动态加载的商品，同下图的小米MIX2，你点击方框里的小图，价格会跟着切换。这两类商品和其他的商品在html的标签中还有一些不一样，抓取的时候要考虑到。我觉得就是这两类商品是随时在网页显示中会变动的。s增加52 的意思是不是获取52条普通商品信息，再在其中插入8条广告类的信息，拼成一页。最后我在实际抓取的时候索性把第一个url中的s参数去掉，在观察翻页后每次动态请求的url中的s参数大概是增加48，每次就增加48来抓取。

 

二、代码实现

京东还算是对爬虫比较友好的，不用代理直接抓取100页也没有出现反爬措施。请求库用的requests，解析网页用的xpath。直接复制浏览器中的header信息，用requests发送get请求，对于返回的html代码用xpath进行解析。前30条信心，和后30条信息解析的方式是一样的。完整代码如下：

    import requests
    from lxml import etree
    import time
    import csv
    #定义函数抓取每页前30条商品信息
    def crow_first(n):
        #构造每一页的url变化
        url='https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&cid2=653&cid3=655&page='+str(2*n-1)
        head = {'authority': 'search.jd.com',
                'method': 'GET',
                'path': '/s_new.php?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&wq=%E6%89%8B%E6%9C%BA&cid2=653&cid3=655&page=4&s=84&scrolling=y&log_id=1529828108.22071&tpl=3_M&show_items=7651927,7367120,7056868,7419252,6001239,5934182,4554969,3893501,7421462,6577495,26480543553,7345757,4483120,6176077,6932795,7336429,5963066,5283387,25722468892,7425622,4768461',
                'scheme': 'https',
                'referer': 'https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&wq=%E6%89%8B%E6%9C%BA&cid2=653&cid3=655&page=3&s=58&click=0',
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'Cookie':'qrsc=3; pinId=RAGa4xMoVrs; xtest=1210.cf6b6759; ipLocation=%u5E7F%u4E1C; _jrda=5; TrackID=1aUdbc9HHS2MdEzabuYEyED1iDJaLWwBAfGBfyIHJZCLWKfWaB_KHKIMX9Vj9_2wUakxuSLAO9AFtB2U0SsAD-mXIh5rIfuDiSHSNhZcsJvg; shshshfpa=17943c91-d534-104f-a035-6e1719740bb6-1525571955; shshshfpb=2f200f7c5265e4af999b95b20d90e6618559f7251020a80ea1aee61500; cn=0; 3AB9D23F7A4B3C9B=QFOFIDQSIC7TZDQ7U4RPNYNFQN7S26SFCQQGTC3YU5UZQJZUBNPEXMX7O3R7SIRBTTJ72AXC4S3IJ46ESBLTNHD37U; ipLoc-djd=19-1607-3638-3638.608841570; __jdu=930036140; user-key=31a7628c-a9b2-44b0-8147-f10a9e597d6f; areaId=19; __jdv=122270672|direct|-|none|-|1529893590075; PCSYCityID=25; mt_xid=V2_52007VwsQU1xaVVoaSClUA2YLEAdbWk5YSk9MQAA0BBZOVQ0ADwNLGlUAZwQXVQpaAlkvShhcDHsCFU5eXENaGkIZWg5nAyJQbVhiWR9BGlUNZwoWYl1dVF0%3D; __jdc=122270672; shshshfp=72ec41b59960ea9a26956307465948f6; rkv=V0700; __jda=122270672.930036140.-.1529979524.1529984840.85; __jdb=122270672.1.930036140|85.1529984840; shshshsID=f797fbad20f4e576e9c30d1c381ecbb1_1_1529984840145'
                }
        r = requests.get(url, headers=head)
        #指定编码方式，不然会出现乱码
        r.encoding='utf-8'
        html1 = etree.HTML(r.text)
        #定位到每一个商品标签li
        datas=html1.xpath('//li[contains(@class,"gl-item")]')
        #将抓取的结果保存到本地CSV文件中
        with open('JD_Phone.csv','a',newline='',encoding='utf-8')as f:
            write=csv.writer(f)
            for data in datas:
                p_price = data.xpath('div/div[@class="p-price"]/strong/i/text()')
                p_comment = data.xpath('div/div[5]/strong/a/text()')
                p_name = data.xpath('div/div[@class="p-name p-name-type-2"]/a/em')
                #这个if判断用来处理那些价格可以动态切换的商品，比如上文提到的小米MIX2，他们的价格位置在属性中放了一个最低价
                if len(p_price) == 0:
                    p_price = data.xpath('div/div[@class="p-price"]/strong/@data-price')
                    #xpath('string(.)')用来解析混夹在几个标签中的文本
                write.writerow([p_name[0].xpath('string(.)'),p_price[0],p_comment[0]])
        f.close()
    #定义函数抓取每页后30条商品信息
    def crow_last(n):
        #获取当前的Unix时间戳，并且保留小数点后5位
        a=time.time()
        b='%.5f'%a
        url='https://search.jd.com/s_new.php?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&wq=%E6%89%8B%E6%9C%BA&cid2=653&cid3=655&page='+str(2*n)+'&s='+str(48*n-20)+'&scrolling=y&log_id='+str(b)
        head={'authority': 'search.jd.com',
        'method': 'GET',
        'path': '/s_new.php?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&wq=%E6%89%8B%E6%9C%BA',
        'scheme':'https',
        'referer': 'https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&wq=%E6%89%8B%E6%9C%BA&cid2=653&cid3=655&page=3&s=58&click=0',
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        'Cookie':'qrsc=3; pinId=RAGa4xMoVrs; xtest=1210.cf6b6759; ipLocation=%u5E7F%u4E1C; _jrda=5; TrackID=1aUdbc9HHS2MdEzabuYEyED1iDJaLWwBAfGBfyIHJZCLWKfWaB_KHKIMX9Vj9_2wUakxuSLAO9AFtB2U0SsAD-mXIh5rIfuDiSHSNhZcsJvg; shshshfpa=17943c91-d534-104f-a035-6e1719740bb6-1525571955; shshshfpb=2f200f7c5265e4af999b95b20d90e6618559f7251020a80ea1aee61500; cn=0; 3AB9D23F7A4B3C9B=QFOFIDQSIC7TZDQ7U4RPNYNFQN7S26SFCQQGTC3YU5UZQJZUBNPEXMX7O3R7SIRBTTJ72AXC4S3IJ46ESBLTNHD37U; ipLoc-djd=19-1607-3638-3638.608841570; __jdu=930036140; user-key=31a7628c-a9b2-44b0-8147-f10a9e597d6f; areaId=19; __jdv=122270672|direct|-|none|-|1529893590075; PCSYCityID=25; mt_xid=V2_52007VwsQU1xaVVoaSClUA2YLEAdbWk5YSk9MQAA0BBZOVQ0ADwNLGlUAZwQXVQpaAlkvShhcDHsCFU5eXENaGkIZWg5nAyJQbVhiWR9BGlUNZwoWYl1dVF0%3D; __jdc=122270672; shshshfp=72ec41b59960ea9a26956307465948f6; rkv=V0700; __jda=122270672.930036140.-.1529979524.1529984840.85; __jdb=122270672.1.930036140|85.1529984840; shshshsID=f797fbad20f4e576e9c30d1c381ecbb1_1_1529984840145'
     
        }
        r = requests.get(url, headers=head)
        r.encoding = 'utf-8'
        html1 = etree.HTML(r.text)
        datas = html1.xpath('//li[contains(@class,"gl-item")]')
        with open('JD_Phone.csv','a',newline='',encoding='utf-8')as f:
            write=csv.writer(f)
            for data in datas:
                p_price = data.xpath('div/div[@class="p-price"]/strong/i/text()')
                p_comment = data.xpath('div/div[5]/strong/a/text()')
                p_name = data.xpath('div/div[@class="p-name p-name-type-2"]/a/em')
                if len(p_price) == 0:
                    p_price = data.xpath('div/div[@class="p-price"]/strong/@data-price')
                write.writerow([p_name[0].xpath('string(.)'),p_price[0],p_comment[0]])
        f.close()


​     
    if __name__=='__main__':
        for i in range(1,101):
            #下面的print函数主要是为了方便查看当前抓到第几页了
            print('***************************************************')
            try:
                print('   First_Page:   ' + str(i))
                crow_first(i)
                print('   Finish')
            except Exception as e:
                print(e)
            print('------------------')
            try:
                print('   Last_Page:   ' + str(i))
                crow_last(i)
                print('   Finish')
            except Exception as e:
                print(e)



### （2）数据预处理

见预处理文件