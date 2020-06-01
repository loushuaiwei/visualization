from flask import Flask
from flask import request
from flask import render_template
from flask import jsonify
from flask import Flask as _Flask
import utils
import string
from flask.json import JSONEncoder as _JSONEncoder
from jieba.analyse import extract_tags

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("index.html")

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

if __name__ == '__main__':
    app.run()
