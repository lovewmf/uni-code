# 文档说明

```js
npm run install //安装依赖

npm run build // 打包

```

```js
bar: {//条形码
	code: 'E01181016286106',
	color: '#000000', // 条形码的颜色 不传 默认黑色
	bgColor: '#FFFFFF', // 背景色 不传 默认白色
    type: 'CODE128', //条码类型 默认CODE128 可选值 CODE39 EAN ITF MSI Codabar Pharmacode
	width: 670, // 宽度
	height: 100 // 高度
},
qrc: {// 二维码
	code: 'https://qm.qq.com/cgi-bin/qm/qr?k=LKqML292dD2WvwQfAJXBUmvgbiB_TZWF&noverify=0',
	size: 460, // 二维码大小
	level: 4, //纠错等级 0～4
	type: 'none',
	bgColor: '#FFFFFF', //二维码背景色 默认白色
	border: {
		degree: 15,//圆角度数 默认5
		color: ['#F27121','#8A2387','#1b82d2'], //边框颜色支持渐变色 最多10中颜色
		lineWidth: 5 //边框宽度 默认 5
	},
	text:{
		// opacity: 1, //文字透明度 默认不透明
		size: 20,
		weight: 'bold',//文字是否加粗 默认normal 字体跟随系统
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