import {
    QRCodeInit,
    UNIT_CONVERSION,
    UtF16TO8,
    SaveCodeImg
} from '../common/support'

/**
* @description 定义二维码参数
*/
export const WidgetCode = function(opt: StrongCode.BarCodePars,callback?: Function){
    if (!opt.code) {
        console.warn("没有找到二维码code");
        return
    }
    if (!opt.id){
        console.warn("没有找到二维码canvas id或者实列!");
        return
    }
    let CTX: UniApp.CanvasContext;
    //实例化QRCodeInit
    const BARCODE: QRCodeInit = new QRCodeInit(opt.level);
    // 二维码code转码 主要针对纯汉字
    const CODE: string = UtF16TO8(opt.code)
    // 生成二维码所需要的数据
    const frame: number[] = BARCODE.Genframe(CODE)
    const width: number = BARCODE.getWidth();

    if (Object.prototype.toString.call(opt.id) == '[object String]') {
        CTX = uni.createCanvasContext(<string>opt.id, opt.ctx || null);
        RepaintCanvas(opt, CTX,frame, width, callback)
    } else if (Object.prototype.toString.call(opt.id) == '[object Object]') {//在此兼容nvue
        CTX = opt.id as UniApp.CanvasContext;
        RepaintCanvas(opt, CTX,frame, width,callback)
    }

}
const RepaintCanvas = function (opt: StrongCode.BarCodePars, ctx: UniApp.CanvasContext, frame: number[], width: number, callback?: Function) {

    const SIZE: number = UNIT_CONVERSION(opt.size)
    const px: number = Math.round(SIZE / (width + 8));
    const roundedSize: number = px * (width + 8);
    const offset: number = Math.floor((SIZE - roundedSize) / 2);

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.setFillStyle(opt.bgColor || '#FFFFFF');//二维码背景色
    ctx.fillRect(0, 0, SIZE, SIZE);//设置画布大小

    //绘制二维码颜色 支持渐变
    opt.color ? SetColorCode(ctx,SIZE,opt.color) : ctx.setFillStyle("#000000");
    // 绘制二维码边框 支持渐变 透明度
    opt.border ? SetBorderCode(ctx,SIZE,opt.border) : false;

    for (let i = 0; i < width; i++) {//开始生成二维码
        for (let j = 0; j < width; j++) {
            if (frame[j * width + i]) {
                // SetCodeType[opt.type || 'none'](ctx,px * (4 + i) + offset, px * (4 + j) + offset, px, px)
                ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
            }
        }
    }
    // 图片放在下面 防止图片在二维码下面
    opt.img ? SetImageType[opt.img.type || 'none'](ctx,SIZE,opt.img) : false;
    //绘制二维码文字
    opt.text ? SetTextCode(ctx,SIZE,opt.text) : false;
    
    ctx.draw(false, async (res) => {
        callback ? callback({
            ...res,
            img: res.errMsg == "drawCanvas:ok" ? await SaveCodeImg({
                width: opt.size,
                height: opt.size,
                id: opt.id,
                ctx: opt.ctx || null
            }) : null,
            id: Object.prototype.toString.call(opt.id) == '[object String]' ? opt.id : "nvue"
        }) : null;
    });

}
// @ts-ignore
const SetCodeType = {
    
    'none': function (ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number){
        ctx.fillRect(x,y,w,h);
    },
    'starry': function (ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number){
        ctx.drawImage('', x, y, w, h)
    },
    'dots': function (ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number){
        ctx.drawImage('', x, y, w, h)
    },
}
/**
 * @method SetColorCode
 * @author wmf
 * @Date 2021-11-08
 * @LastEditTime 2021-11-08
 * @todo 颜色支持多种渐变
 * @description 设置二维码颜色 支持渐变色
 */
const SetColorCode = function (ctx: UniApp.CanvasContext,size: number,colors: string[]): void {
    let GRD: UniApp.CanvasGradient = ctx.createLinearGradient(0, 0, size, 0);
    if(colors.length === 1){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(1, colors[0]);
    }
    if(colors.length === 2){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(1, colors[1]);
    }
    if(colors.length === 3){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.5, colors[1]);
        GRD.addColorStop(1, colors[2]);
    }
    ctx.setFillStyle(GRD)
}
/**
 * @author wmf
 * @method SetImageType
 * @description 二维码中间log绘制
 */
const SetImageType = {//none circle round
    'none': function SetImageCode(ctx: UniApp.CanvasContext,size: number, img: StrongCode.CodeImg){
        const iconSize = img?.size || 30
        const width =  Number(((size - iconSize) / 2).toFixed(2));
        ctx.save();
        ctx.drawImage(img.src, width, width, iconSize, iconSize)
    },
    /**
     * @method SetCircleImg
     * @author wmf
     * @todo 二维码中间log 圆形
     * @description 设置二维码log为圆形
     */
    'circle': function SetCircleImg(ctx: UniApp.CanvasContext,size: number, img: StrongCode.CodeImg){
        const r: number = (img.size || 30);
        const w: number = r * 2;
        const x: number = size/2 - r;
        const y: number = size/2 - r;
		const cx: number = x + r;
		const cy: number = y + r;
        ctx.save();
		ctx.arc(cx, cy, r, 0, 2 * Math.PI);
		ctx.setLineWidth(img.width || 5)
		ctx.setStrokeStyle(img.color || "#FFFFFF"); // 设置绘制圆形边框的颜色
		ctx.stroke(); 
		ctx.clip();
		ctx.drawImage(img.src, x, y, w, w);
    },
    /**
     * @method SetRoundImg
     * @author wmf
     * @todo 二维码中间log 圆角
     * @description 设置二维码log为圆角
     */
    'round': function SetRoundImg(ctx: UniApp.CanvasContext,size: number, img: StrongCode.CodeImg) {
        let r: number = img.degree || 5;
        const iconSize = img.size || 30;
        const w: number = iconSize;
        const h: number = iconSize;
        const x: number = size/2 - iconSize/2;
        const y: number = size/2 - iconSize/2;
        w < 2 * r ? r = w / 2 : false;
        h < 2 * r ? r = h / 2 : false;
        ctx.save();
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
        ctx.setLineWidth(img.width || 5)
		ctx.setStrokeStyle(img.color || "#FFFFFF"); // 设置绘制圆形边框的颜色
		ctx.stroke();
		ctx.clip();
		ctx.drawImage(img.src, x, y, w , w);
    }
}
/**
 * 
 * @method SetBorderCode
 * @author wmf
 * @todo 二维码边框 圆角 边框颜色支持多种渐变
 * @description 设置二维码边框
 */

 const SetBorderCode = function(ctx: UniApp.CanvasContext,size: number,border?: StrongCode.BorderCode): void {
    const colors: string[] = border?.color || ['#F27121','#8A2387'];
    const r: number = border?.degree || 5;
    const x: number = 0;
    const y: number = 0;
    const w: number = size;
    const h: number = size;
    let GRD: UniApp.CanvasGradient = ctx.createLinearGradient(0, 0, size, 0);
    if(colors.length === 1){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(1, colors[0]);
    }
    if(colors.length === 2){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(1, colors[1]);
    }
    if(colors.length === 3){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.5, colors[1]);
        GRD.addColorStop(1, colors[2]);
    }
    ctx.save();
    ctx.setGlobalAlpha(border?.opacity || 1)
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);

    ctx.closePath();
	ctx.setLineWidth(border?.lineWidth || 5)
	ctx.setStrokeStyle(GRD); // 设置绘制圆形边框的颜色
	ctx.stroke();
	ctx.clip();
    ctx.setGlobalAlpha(1)
}

/**
 * @method SetTextCode
 * @author wmf
 * @Date 2021-11-08
 * @LastEditTime 2021-11-08
 * @todo 颜色支持多种渐变
 * @description 在二维码上设置文本
 */
 const SetTextCode = function (ctx: UniApp.CanvasContext,size: number,text: StrongCode.CodeText): void {
    let GRD: UniApp.CanvasGradient = ctx.createLinearGradient(0, 0, size, 0);
    let colors = text.color || ["#FFFFFF"];
    if(colors.length === 1){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(1, colors[0]);
    }
    if(colors.length === 2){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(1, colors[1]);
    }
    if(colors.length === 3){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.5, colors[1]);
        GRD.addColorStop(1, colors[2]);
    }
    ctx.restore();
    ctx.setGlobalAlpha(text?.opacity || 1)
    ctx.setTextAlign('center');//'left'、'center'、'right'
	ctx.setTextBaseline('middle');//可选值 'top'、'bottom'、'middle'、'normal'
    ctx.font = text?.font || "normal 20px system-ui",
    ctx.setFillStyle(GRD)
	ctx.fillText(text.content, size/2, size/2);
    ctx.setGlobalAlpha(1)
}