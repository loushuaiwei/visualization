import pandas as pd
import numpy as np
import codecs

class Process_Data():

    def processing_data(self,path):
        file = pd.read_csv(path)
        df = pd.DataFrame(file)
        index = len(df.keys())
        data = np.array(df)

        ### 两种字段长度不同的文档
        if index > 10:
            data_Sheet = pd.DataFrame(data, columns=['商品ID','标题','价格','参数信息','评论数','好评度',
                                                '热点评论词','评论用户ID','评论信息','评论时间','使用机型'])
        else:
            data_Sheet = pd.DataFrame(data, columns=['商品ID','标题','价格','参数信息','评论数','好评度',
                                                '热点评论词'])
        comment_Num = df['评论数']
        # 原数据 评论数 3.5万+ 81万 转化为整型方便展示
        for i in range(len(comment_Num)):
            item = str(comment_Num[i])
            count = 0
            if item.__contains__('万'):
                i = item.index('万')
                count = int(eval(item[:i]) * 10000)
            else:
                if item.__contains__('+'):
                    count = eval(item[:-1])
            df.loc[df['评论数'] == item, '评论数'] = str(count)
        # print(df['评论数'])
        data = np.array(df)

        # 保存经处理好的数据
        if index > 10:
            data_Sheet = pd.DataFrame(data, columns=['商品ID','标题','价格','参数信息','评论数','好评度',
                                                '热点评论词','评论用户ID','评论信息','评论时间','使用机型'])
        else:
            data_Sheet = pd.DataFrame(data, columns=['商品ID','标题','价格','参数信息','评论数','好评度',
                                                '热点评论词'])
        data_Sheet.to_csv(path, index=False, encoding='utf_8')

    def handleEncoding(self,original_file, newfile):
        f = open(original_file, 'rb+')
        content = f.read()  # 读取文件内容，content为bytes类型，而非string类型
        source_encoding = 'utf-8'
        #####确定encoding类型
        try:
            content.decode('utf-8').encode('utf-8')
            source_encoding = 'utf-8'
        except:
            try:
                content.decode('gbk').encode('utf-8')
                source_encoding = 'gbk'
            except:
                try:
                    content.decode('gb2312').encode('utf-8')
                    source_encoding = 'gb2312'
                except:
                    try:
                        content.decode('gb18030').encode('utf-8')
                        source_encoding = 'gb18030'
                    except:
                        try:
                            content.decode('big5').encode('utf-8')
                            source_encoding = 'gb18030'
                        except:
                            content.decode('cp936').encode('utf-8')
                            source_encoding = 'cp936'
        f.close()

        #####按照确定的encoding读取文件内容，并另存为utf-8编码：
        block_size = 4096
        with codecs.open(original_file, 'r', source_encoding) as f:
            with codecs.open(newfile, 'w', 'utf-8') as f2:
                while True:
                    content = f.read(block_size)
                    if not content:
                        break
                    f2.write(content)

if __name__ == '__main__':
    PD = Process_Data()
    PD.handleEncoding('../crawl_JD/data/comment.csv','comment.csv')
    PD.handleEncoding('../crawl_JD/data/phone_info.csv', 'phone_info.csv')
    PD.processing_data('data/comment.csv')
    PD.processing_data('data/phone_info.csv')