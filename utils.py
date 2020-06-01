import time
import pymysql
import string
from flask.json import JSONEncoder as _JSONEncoder
from jieba.analyse import extract_tags
from decimal import *
from flask import jsonify
import pandas
def get_conn():
    # pymysql的简单使用
    # 建立连接
    conn = pymysql.connect(host='localhost',
                           port=3306,
                           user='root',
                           password='16479X',
                           db='phone',
                           charset='utf8')
    # 创建游标，默认是元组型
    cursor = conn.cursor()
    return conn,cursor

def close_conn(conn,cursor):
    cursor.close()
    conn.close()

def query(sql,*args):
    """
    封装通用查询
    :param sql:
    :param args:
    :return: 返回查询到的结果，((),(),)的形式
    """
    conn,cursor = get_conn()
    cursor.execute(sql,args)
    res=cursor.fetchall()
    close_conn(conn,cursor)
    return res

def get_c1_data():
    """
    :return:返回大屏div id=1的数据
    """
    #因为会更新多次数据，取时间戳最近的那组数据
    sql = " Select sum(手机名称),avg(价格) from phone;"
    res = query(sql)
    return res

def get_l1_data():
    """
    :return:返回大屏div id=1的数据
    """
    #因为会更新多次数据，取时间戳最近的那组数据
    sql = "select 手机名称,count('id') sum from phone group by 手机名称 order by sum desc limit 8;"
    res = query(sql)
    return res

def get_l2_data():
    sql=" select sum(价格 < 1000) as '千元以下',sum(价格 >=1000 and 价格 <2000) as '1000至2000元之间',sum(价格 >=2000 and 价格 <3000) as '2000至3000元之间',sum(价格 >=3000 and 价格 <4000) as '3000至4000元之间',sum(价格 >=5000) as '5000元以上' from phone;"
    res = query(sql)
    return res

def get_l21_data():
    sql="select sum(评论数 < 50000) as '人气较低',sum(评论数 >=50000 and 评论数 <500000) as '中等人气',sum(评论数 >=500000 and 评论数 <1000000) as '高人气',sum(评论数 >=1000000) as '超高人气' from phone;"
    res = query(sql)
    return res

def get_l22_data():
    sql="select sum(经营方式 = '自营') as '自营',sum(经营方式='非自营') as '非自营' from phone;"
    res = query(sql)
    return res

def get_l3_data():
    sql="SELECT 手机名称,AVG(价格) as 平均价格 FROM phone GROUP BY `手机名称` ORDER BY 平均价格  DESC LIMIT 5;"
    #sql="Select distinct  手机名称,评论数  from phone order by 评论数 desc limit 5;"
    res = query(sql)
    return res

def get_r2_data():
    """
    :return:  返回最近的20条热搜
    """
    sql = 'select 词语词频 from wordcloud limit 100'
    res = query(sql) #格式 (('民警抗疫一线奋战16天牺牲1037364',), ('四川再派两批医疗队1537382',)
    return res

def get_r3_data():
    """
    :return:返回大屏div id=1的数据
    """
    #因为会更新多次数据，取时间戳最近的那组数据
    sql = "select 品牌方,count('id') sum from phone group by 品牌方 order by sum desc limit 11;"
    res = query(sql)
    res = list(res)
    res.pop(0)
    print(res)
    return res


if __name__ == "__main__":
    print(get_l1_data())
    print(get_l2_data())
    print(get_l21_data())
    print(get_l22_data())
    print(get_l2_data())
    print(get_l3_data())
    print(get_c1_data())
    #print(get_c2_data())
    #print(get_r1_data())
    print(get_r2_data())
    print(get_r3_data())

    print("***********************************")
    data = get_l3_data()
    brand = []
    num = []
    for k,v in data:
        brand.append(k)
        num.append(int(v))
    print(brand)
    print(num)


