
$(function () {
echarts_1();
echarts_2();
echarts_4();
echarts_31();
echarts_32();
echarts_33();
echarts_5();
echarts_6();
function echarts_1() {
        // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));

       option = {
  //  backgroundColor: '#00265f',
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '0%',
		top:'10px',
        right: '0%',
        bottom: '4%',
       containLabel: true
    },
    xAxis: [{
        type: 'category',
        data:[], //['商超门店', '教育培训', '房地产', '生活服务', '汽车销售', '旅游酒店', '五金建材'],
        axisLine: {
            show: true,
         lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },

        axisTick: {
            show: false,
        },
		axisLabel:  {
                interval: 0,
               // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '8',
                },
            },
        name: '品牌',
        nameLocation: 'end'
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
           //formatter: '{value} %'
			show:true,
			 textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '8',
                },
        },
        name:'数量',
        nameLocation: 'end',
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1	)",
                width: 1,
                type: "solid"
            },
        },
        splitLine: {
            lineStyle: {
               color: "rgba(255,255,255,.1)",
            }
        }
    }],
    series: [
		{
        type: 'bar',
        data:[], //[200, 300, 300, 900, 1500, 1200, 600],
        barWidth:'35%', //柱子宽度
       // barGap: 1, //柱子之间间距
        itemStyle: {
            normal: {
                color:'#2f89cf',
                opacity: 1,
				barBorderRadius: 5,
            }
        }
    }

	]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
// 异步加载数据
     $.ajax('/l1').done(function (data) {
         myChart.hideLoading(); // 隐藏加载动画

         // 填入数据
         myChart.setOption({
             xAxis: {
                 data: data.brand,
             },
             series: [{
                 data: data.num.map(parseFloat) // 转化为数字（注意map）
             }]
         });
     });
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart2 = echarts.init(document.getElementById('echart2'),'infographic');

/*option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['18-30','31-40','41-50','51-60','65岁以上','未标明'],
        textStyle: {color: '#fff'}
    },
    series: [
        {
            name:'违法犯罪人员年龄分布',
            type:'pie',
            radius: ['30%', '55%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'18-30'},
                {value:310, name:'31-40'},
                {value:234, name:'41-50'},
                {value:135, name:'51-60'},
                {value:135, name:'65岁以上'},
                {value:1548, name:'未标明'}
            ]
        }
    ]
};*/
/*option = {

        legend: {
            x : 'center',
            y : 'bottom',
            itemWidth: 8,
            itemHeight: 8,
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:12
            },
            data:['上限','上上限','下限','下下限','正跳变','负跳变']
        },
        calculable : true,
        series : [
            {
                name:'面积模式',
                type:'pie',
                radius : [30, 100],
                center : ['50%', '45%'],
                roseType : 'area',
                data:[
                    {value:8, name:'0-1000',itemStyle:{normal:{color:'#ff7800'}}},
                    {value:9, name:'1000-2000',itemStyle:{normal:{color:'#23eb6a'}}},
                    {value:10, name:'2000-3000',itemStyle:{normal:{color:'#7627cb'}}},
                    {value:11, name:'3000-4000',itemStyle:{normal:{color:'#fffc00'}}},
                    {value:12, name:'4000-5000',itemStyle:{normal:{color:'#46afdb'}}},
                    {value:12, name:'5000-？',itemStyle:{normal:{color:'#ff0000'}}}
                ]
            }
        ]
    }
     if (option && typeof option === "object") {
         // 使用刚指定的配置项和数据显示图表。
         myChart.setOption(option);
     }*/
option2 = {
    xAxis: {
        type: 'category',
        data:[], //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        name: '品牌',
        nameLocation: 'end',
        nameTextStyle:{
            color:'white'
        },
        axisLabel:{
            color:"white",
        }
    },
    yAxis: {
        type: 'value',
        name:'均价',
        nameLocation: 'end',
        nameTextStyle:{
            color:'white'
        },
        axisLabel:{
            color:"white",
            fontSize :"6"
        }
    },
    grid:{
        show:true,
    },
    tooltip:{
      show:true,
      trigger:'item'
    },
    series: [{
        data:[], //[120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        symbol: 'triangle',
        symbolSize: 10,
        lineStyle: {
            color: 'green',
            width: 2,
            type: 'dashed'
        },
        itemStyle: {
            borderWidth: 1,
            borderColor: 'yellow',
            color: 'red'
        }
    }]
};





      myChart2.setOption(option2);
      // 异步加载数据
     $.ajax('/l3').done(function (data) {
         myChart2.hideLoading(); // 隐藏加载动画

         // 填入数据
         myChart2.setOption({
             xAxis: {
                 data: data.brand,
             },
             series: [{
                 data: data.num // 转化为数字（注意map）
             }]
         });
     });
        window.addEventListener("resize",function(){
            myChart2.resize();
        });
    }
function echarts_5() {
       var ec_right2 = echarts.init(document.getElementById('echart5'));
var ec_right2_option = {
                        // backgroundColor: '#515151',
						title : {
						    text : "",
						    textStyle : {
						        color : 'white',
						    },
						    left : 'left'
						},
                        tooltip: {
                            show: false
                        },
                        series: [{
                                type: 'wordCloud',
								// drawOutOfBound:true,
                                gridSize: 1,
                                sizeRange: [12, 55],
                                rotationRange: [-45, 0, 45, 90],
                                // maskImage: maskImage,
                                textStyle: {
                                    normal: {
                                        color: function () {
                                            return 'rgb(' +
                                                    Math.round(Math.random() * 255) +
                                                    ', ' + Math.round(Math.random() * 255) +
                                                    ', ' + Math.round(Math.random() * 255) + ')'
                                        }
                                    }
                                },
                                // left: 'center',
                                // top: 'center',
                                // // width: '96%',
                                // // height: '100%',
                                right: null,
                                bottom: null,
                                // width: 300,
                                // height: 200,
                                // top: 20,
                                data:  []
                            }]
                    }

ec_right2.setOption(ec_right2_option);
        // 使用刚指定的配置项和数据显示图表。
        //myChart.setOption(option);
 $.ajax('/r2').done(function (data) {
         ec_right2.setOption({
             series: [{
                 data: data.kws
             }]
         });
     });
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart4'));

    option = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
		    legend: {
    top:'0%',
        data:['旗舰店','杂牌店'],
                textStyle: {
           color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    grid: {
        left: '10',
		top: '30',
        right: '10',
        bottom: '10',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },
        axisLine: {
			lineStyle: {
				color: 'rgba(255,255,255,.2)'
			}

        },

   data: ['华为', 'Apple', 'vivo', 'OPPO', '魅族', '中兴', '荣耀', '一佳', '黑鲨', '中兴', '小米']

    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,



    }],

    yAxis: [{
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
		{
        name: '旗舰店',
        type: 'line',
         smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#0184d5',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#0184d5',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        data: [3, 5, 4, 2, 3, 2, 4, 5, 3, 6, 4, 2]

    },
{
        name: '杂牌店',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#00d887',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        data: [5, 3, 5, 6, 8, 5, 3, 5, 6, 4, 6, 4]

    },

		 ]

};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart6'));

        var dataStyle = {
	normal: {
		label: {
			show: false
		},
		labelLine: {
			show: false
		},
		//shadowBlur: 40,
		//shadowColor: 'rgba(40, 40, 40, 1)',
	}
};
var placeHolderStyle = {
	normal: {
		color: 'rgba(255,255,255,.05)',
		label: {show: false,},
		labelLine: {show: false}
	},
	emphasis: {
		color: 'rgba(0,0,0,0)'
	}
};
option = {
	color: ['#0f63d6', '#0f78d6', '#0f8cd6', '#0fa0d6', '#0fb4d6'],
	tooltip: {
		show: true,
		formatter: "{a} : {c} "
	},
	legend: {
		itemWidth: 10,
        itemHeight: 10,
		itemGap: 12,
		bottom: '3%',

		data: ['OPPO', '华为', '飞利浦', 'vivo', '荣耀'],
		textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
	},

	series: [
		{
		name: 'OPPO',
		type: 'pie',
		clockWise: false,
		center: ['50%', '42%'],
		radius: ['59%', '70%'],
		itemStyle: dataStyle,
		hoverAnimation: false,
		data: [{
			value: 72,
			name: '01'
		}, {
			value: 20,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	},
		{
		name: '华为',
		type: 'pie',
		clockWise: false,
		center: ['50%', '42%'],
		radius: ['49%', '60%'],
		itemStyle: dataStyle,
		hoverAnimation: false,
		data: [{
			value: 47,
			name: '02'
		}, {
			value: 30,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	},
		{
		name: '飞利浦',
		type: 'pie',
		clockWise: false,
		hoverAnimation: false,
		center: ['50%', '42%'],
		radius: ['39%', '50%'],
		itemStyle: dataStyle,
		data: [{
			value: 36,
			name: '03'
		}, {
			value: 35,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	},
		{
		name: 'vivo',
		type: 'pie',
		clockWise: false,
		hoverAnimation: false,
		center: ['50%', '42%'],
		radius: ['29%', '40%'],
		itemStyle: dataStyle,
		data: [{
			value: 35,
			name: '04'
		}, {
			value: 40,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	},
		{
		name: '荣耀',
		type: 'pie',
		clockWise: false,
		hoverAnimation: false,
		center: ['50%', '42%'],
		radius: ['20%', '30%'],
		itemStyle: dataStyle,
		data: [{
			value: 30,
			name: '05'
		}, {
			value: 50,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	}, ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        function get_r3_data() {
            $.ajax({
                url:"/r3",
                success: function(data) {
                    option.series[0].data.value[1]=data.num[0],
                    option.series[1].data.value[1]=data.num[1],
                    option.series[2].data.value[1]=data.num[2],
                    option.series[3].data.value[1]=data.num[3],
                    option.series[4].data.value[1]=data.num[4],
                    myChart.setOption(option)
                },
                error: function(xhr, type, errorThrown) {

                }
            })
        }
        get_r3_data()
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_31() {
        // 基于准备好的dom，初始化echarts实例
        var myChart31 = echarts.init(document.getElementById('fb1'));
         $.ajax('/l2').done(function (data) {
         myChart31.setOption({
             title: [{
                 text: '价格分布',
                 left: 'center',
                 textStyle: {
                     color: '#fff',
			     fontSize:'16'}
             }],
              tooltip: {
                 trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)",
                  position:function(p){   //其中p为当前鼠标的位置
                        return [p[0] + 10, p[1] - 10];}
              },
             legend: {
                 top:'70%',
                 itemWidth: 10,
                 itemHeight: 10,
                 data:['千元以下','1000至2000元','2000至3000元','3000至4000元','5000以上'],
                 textStyle: {
                     color: 'rgba(255,255,255,.5)',
                     fontSize:'12',
                 }
                 },
             series: [{
                 name:'价格分布',
            type:'pie',
			center: ['50%', '42%'],
            radius: ['40%', '60%'],
                  color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab','#06b4ab','#06c8ab','#06dcab','#06f0ab'],
            label: {show:false},
			labelLine: {show:false},
                 data:[
                 {value: data.num[0], name: '千元以下'},
                 {value: data.num[1], name: '1000至2000元'},
                 {value: data.num[2], name: '2000至3000元'},
                 {value: data.num[3], name: '3000至4000元'},
                 {value: data.num[4], name: '5000以上'},
         ]}]
         });
     });
        window.addEventListener("resize",function(){
            myChart31.resize();
        });
    }
function echarts_32() {
// 基于准备好的dom，初始化echarts实例
        var myChart32 = echarts.init(document.getElementById('fb2'));
         $.ajax('/l21').done(function (data) {
         myChart32.setOption({
             title: [{
                 text: '人气分布',
                 left: 'center',
                 textStyle: {
                     color: '#fff',
			     fontSize:'16'}
             }],
              tooltip: {
                 trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)",
                  position:function(p){   //其中p为当前鼠标的位置
                        return [p[0] + 10, p[1] - 10];}
              },
             legend: {
                 top:'70%',
                 itemWidth: 10,
                 itemHeight: 10,
                 data:['低人气','中等人气','高人气','超等人气'],
                 textStyle: {
                     color: 'rgba(255,255,255,.5)',
                     fontSize:'12',
                 }
                 },
             series: [{
                 name:'人气分布',
            type:'pie',
			center: ['50%', '42%'],
            radius: ['40%', '60%'],
                  color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab','#06b4ab','#06c8ab','#06dcab','#06f0ab'],
            label: {show:false},
			labelLine: {show:false},
                 data:[
                 {value: data.num[0], name: '低人气'},
                 {value: data.num[1], name: '中等人气'},
                 {value: data.num[2], name: '高人气'},
                 {value: data.num[3], name: '超等人气'},
         ]}]
         });
     });
        window.addEventListener("resize",function(){
            myChart32.resize();
        });
    }
function echarts_33() {
// 基于准备好的dom，初始化echarts实例
        var myChart33 = echarts.init(document.getElementById('fb3'));
         $.ajax('/l22').done(function (data) {
         myChart33.setOption({
             title: [{
                 text: '经营方式',
                 left: 'center',
                 textStyle: {
                     color: '#fff',
			     fontSize:'16'}
             }],
              tooltip: {
                 trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)",
                  position:function(p){   //其中p为当前鼠标的位置
                        return [p[0] + 10, p[1] - 10];}
              },
             legend: {
                 top:'70%',
                 itemWidth: 10,
                 itemHeight: 10,
                 data:['自营','非自营'],
                 textStyle: {
                     color: 'rgba(255,255,255,.5)',
                     fontSize:'12',
                 }
                 },
             series: [{
                 name:'经营方式',
            type:'pie',
			center: ['50%', '42%'],
            radius: ['40%', '60%'],
                  color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab','#06b4ab','#06c8ab','#06dcab','#06f0ab'],
            label: {show:false},
			labelLine: {show:false},
                 data:[
                 {value: data.num[0], name: '自营'},
                 {value: data.num[1], name: '非自营'},
         ]}]
         });
     });
        window.addEventListener("resize",function(){
            myChart33.resize();
        });
    }


})








		









