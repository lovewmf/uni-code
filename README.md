# 文档说明

```js
npm run install //安装依赖

npm run build // 打包

```
* canvas 2d 没有draw() 方法
* 清空笔记可以使用clearRect()方法
* 没有setFillStyle方法,只有fillStyle属性
* 没有setStrokeStyle方法,只有strokeStyle属性
* 没有setGlobalAlpha方法,只要有globalAlpha属性

# 相关问题

1. 支付宝小程序画布模糊问题 https://opendocs.alipay.com/support/01rb8t
## 示例地址

`https://ext.dcloud.net.cn/plugin?id=4662`
# 预览
<figure>
<img src="https://img.lovewmf.com/1637657873%281%29.png" style="margin-bottom: 10px;border-radius: 10px;" />
<img src="https://img.lovewmf.com/1637657960%281%29.png" style="margin-bottom: 10px;border-radius: 10px;" />
<img src="https://img.lovewmf.com/1637658244.png" style="margin-bottom: 10px;border-radius: 10px;" />
</figure>

# 参数

```js
bar: {//条形码
	code: 'E01181016286106',
	color: ['#45B649','#00c3ff', '#ee0979'], // 条形码的颜色 不传 默认黑色支持颜色渐变
	bgColor: '#FFFFFF', // 背景色 不传 默认白色
    type: 'CODE128', //条码类型 默认CODE128 可选值 CODE39 UPCE UPC EAN13 ITF ITF14 MSI Codabar Pharmacode
	width: 670, // 宽度
	height: 100 // 高度
},
qrc: {// 二维码
	code: 'https://qm.qq.com/cgi-bin/qm/qr?k=LKqML292dD2WvwQfAJXBUmvgbiB_TZWF&noverify=0',
	size: 460, // 二维码大小
	level: 4, //纠错等级 0～4
	type: 'none', // 二维码 码点 默认none 可选值 dots square starry custom
	src: '/static/35.png',//画布背景
	bgColor: '#FFFFFF', //二维码背景色 默认白色 transparent 透明
	padding: 0,//二维码margin 默认0 非必传
	border: {
		opacity: 1,//边框透明度 0~1 默认1
		degree: 15,//圆角度数 默认5
		color: ['#F27121','#8A2387','#1b82d2'], //边框颜色支持渐变色 最多10中颜色
		lineWidth: 5 //边框宽度 默认 5
	},
	text:{
		// opacity: 1, //文字透明度 默认不透明
		size: 20,
		font: 'bold 20px system-ui',//文字是否加粗 默认normal 20px system-ui
		color: ["#000000"], // 文字颜色支持渐变色
		content: "这是一个测试" //文字内容
	},
	img: {
		src: '/static/logo.png',
		size: 40,
        degree: 15,
		type: 'round',//图片展示类型 默认none 可选值  round圆角  circle圆 如果为round 可以传入degree设置圆角大小 默认 5
		color: '#ffffff', //图片周围的白色边框
		width: 8 //图片周围白色边框的宽度 默认5
	},
	color: ['#8A2387', '#F27121'] //边框颜色支持渐变色 最多10中颜色
}

```