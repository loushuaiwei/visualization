import utils
import string
from flask.json import JSONEncoder as _JSONEncoder
from jieba.analyse import extract_tags
from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker




Base = declarative_base()
CONN = 'mysql+pymysql://root:cmy1998@127.0.0.1:3306/csv_change_mysql?charset=utf8'
#CONN = create_engine("mysql+pymysql://root:@ROOT_root_cmy1998/salary_csv")
engine = create_engine(CONN)
Session = sessionmaker(bind=engine)
session = Session()

class Test(Base):
    __tablename__ = 'test'
    id = Column(Integer,primary_key=True,autoincrement=True)
    job = Column(String(16))
    low_salary = Column(Integer)
    high_salary = Column(Integer)
    location = Column(String(5))




app = Flask(__name__)
@app.route('/query',methods=['POST'])
def query_data():
    returnData = {}
    sql = 'select avg(high_salary),max(high_salary),min(high_salary),count(id),location from test group by location;'
    recruits = session.execute(sql)
    x = []
    for recruit in recruits:
        x.append(recruit)
    two_tuple = tuple(x)#二维数组
    avg_salary = []
    max_salary = []
    min_salary = []
    count_job = []
    for item in two_tuple:
        location = item[4]
        avg_salary.append({'name': location, 'value': round(item[0], 0)})
        max_salary.append({'name': location, 'value': round(item[1], 0)})
        min_salary.append({'name': location, 'value': round(item[2], 0)})
        count_job.append({'name': location, 'value': round(item[3], 0)})
    #加一个状态码让前台可以判断是否得到了数据
    if two_tuple:
        returnData['status'] = 1
    else:
        returnData['status'] = 0
    returnData['avg_salary'] = (avg_salary)
    returnData['max_salary'] = (max_salary)
    returnData['min_salary'] = (min_salary)
    returnData['count_job'] = (count_job)
    return jsonify(returnData)




@app.route("/c1")
def get_c1_data():
    data = utils.get_c1_data()
    brand = []
    num = []
    for k,v in data:
        brand.append(k)
        num.append(int(v))
    print(brand)
    return jsonify({"brand": brand, "price": num})

@app.route("/l1")
def get_l1_data():
    data = utils.get_l1_data()
    brand = []
    num = []
    for k,v in data:
        brand.append(k)
        num.append(int(v))
    print(brand)
    return jsonify({"brand": brand, "num": num})

@app.route("/l2")
def get_l2_data():
    data = utils.get_l2_data()
    num = []
    for v in data:
        num.append(v)
    b = []
    for i in range(5):
        a = int(v[i])
        b.append(a)
    return jsonify({"num": b})

@app.route("/l21")
def get_l21_data():
    data = utils.get_l21_data()
    num = []
    for v in data:
        num.append(v)
    b = []
    for i in range(4):
        a = int(v[i])
        b.append(a)
    b = tuple(b)
    return jsonify({"num": b})

@app.route("/l22")
def get_l22_data():
    data = utils.get_l22_data()
    num = []
    for v in data:
        num.append(v)
    b = []
    for i in range(2):
        a = int(v[i])
        b.append(a)
    b = tuple(b)
    return jsonify({"num": b})

@app.route("/l3")
def get_l3_data():
    data = utils.get_l3_data()
    brand = []
    num = []
    for k,v in data:
        brand.append(k)
        num.append(int(v))
    print(brand)
    return jsonify({"brand": brand, "num": num})

@app.route("/r2")
def get_r2_data():
    data = utils.get_r2_data() #格式 (('民警抗疫一线奋战16天牺牲1037364',), ('四川再派两批医疗队1537382',)
    d = []
    for i in data:
        k = i[0].rstrip(string.digits)  # 移除热搜数字
        v = i[0][len(k):]  # 获取热搜数字
        ks = extract_tags(k)  # 使用jieba 提取关键字
        for j in ks:
            if not j.isdigit():
                d.append({"name": j, "value": v})
    return jsonify({"kws": d})

@app.route("/r3")
def get_r3_data():
    data = utils.get_r3_data()
    shop = []
    num = []
    for k,v in data:
        shop.append(k)
        num.append(int(v))
    print(shop)
    return jsonify({"brand": shop, "num": num})


@app.route("/", methods=["GET"])
def login():
    return render_template("login.html")

@app.route('/index', methods=["GET"])
def index():
    return render_template("index.html")

@app.route('/index3', methods=["GET"])
def index3():
    return render_template('testView.html')






if __name__ == '__main__':
    app.run(host='127.0.0.1',port=89,debug=None)
