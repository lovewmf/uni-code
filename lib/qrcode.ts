import {
    QRCodeInit,
    UNIT_CONVERSION,
    UtF16TO8,
    SaveCodeImg,
    SetGradient,
    getTimeDate,
    GETSIZE,
    getPixelRatio
} from '../common/support'

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
    //二维码绘制时间记录开始
    const timeStar: number = new Date().getTime();
    //实例化QRCodeInit
    const BARCODE: QRCodeInit = new QRCodeInit(opt.level);
    // 二维码code转码 主要针对纯汉字
    const CODE: string = UtF16TO8(opt.code)
    if (!CODE) {
        console.warn("二维码code转换错误");
        return
    }
    // 生成二维码所需要的数据
    const frame: number[] = BARCODE.Genframe(CODE);

    const width: number = BARCODE.getWidth();

    if (Object.prototype.toString.call(opt.id) == '[object String]') {
        CTX = uni.createCanvasContext(<string>opt.id, opt.ctx || null);
        RepaintCanvas(timeStar,opt, CTX,frame, width, callback)
    } else if (Object.prototype.toString.call(opt.id) == '[object Object]') {//在此兼容nvue
        CTX = opt.id as UniApp.CanvasContext;
        RepaintCanvas(timeStar,opt, CTX,frame, width,callback)
    }

}
const RepaintCanvas = function (time: number,opt: StrongCode.BarCodePars, ctx: UniApp.CanvasContext, frame: number[], width: number, callback?: Function) {
    const SIZE: number = GETSIZE[opt.source || 'none'] ? GETSIZE[opt.source || 'none'](opt.size) : UNIT_CONVERSION(opt.size); //画布大小
    const W: number = GETSIZE[opt.source || 'none'] ? GETSIZE[opt.source || 'none'](opt.size) : UNIT_CONVERSION(opt.size);
    const H: number = GETSIZE[opt.source || 'none'] ? GETSIZE[opt.source || 'none'](opt.size) : UNIT_CONVERSION(opt.size);
    const padding: number = ( UNIT_CONVERSION(opt.padding || 0) || 0) + (opt.border ? opt.border.lineWidth || 5 : 0);// 画布内边距 默认 0 单位rpx
    const px: number = Math.round((SIZE / (width + padding)));
    const offset: number = Math.floor((SIZE -  px * width) / 2);

    ctx.clearRect(0, 0, W, H);
    ctx.setFillStyle(opt.bgColor || '#FFFFFF');//二维码背景色
    ctx.fillRect(0, 0,  W, H);//设置画布大小
    // 设置画布背景
    opt.src ? ctx.drawImage(opt.src,0,0, SIZE, SIZE) : false;
    //绘制二维码颜色 支持渐变
    opt.color ? SetColorCode(ctx, W, H, opt.color) : ctx.setFillStyle("#000000");

    for (let i = 0; i < width; i++) {//开始生成二维码
        for (let j = 0; j < width; j++) {
            if (frame[j * width + i]) {
                SetCodeType[opt.type || 'none'] ? SetCodeType[opt.type || 'none'](opt.bgColor,ctx,px * i + offset, px * j + offset , px, px,opt.source) : SetCodeType[opt.type || 'none'](opt.bgColor,ctx,px * i + offset, px * j + offset , px, px,opt.source)
            }
        }
    }
    // 图片放在下面 防止图片在二维码下面
    opt.img ? SetImageType[opt.img?.type || 'none'] ?  SetImageType[opt.img?.type || 'none'](ctx,SIZE,opt.img,opt.source || 'none') : SetImageType['none'](ctx,SIZE,opt.img,opt.source || 'none') : false;
    //绘制二维码文字
    opt.text ? SetTextCode(ctx, W, H, opt.text,opt.source || "none") : false;
    // 绘制二维码边框 支持渐变 透明度
    opt.border ? SetBorderCode(ctx, W, H , opt.border, opt.source || "none") : false;
    ctx.restore();
    starDraw(ctx,opt,time,callback)//开始绘制
    
}
const starDraw = function (ctx: UniApp.CanvasContext,opt: StrongCode.BarCodePars,time: number,callback?: Function): void {
    setTimeout(()=>{
        ctx.draw(false, async (res) => {
            callback ? callback({
                ...res,
                createTime: getTimeDate(),
                takeUpTime: ((new Date()).getTime()) - time,
                img: await SaveCodeImg({
                    width: opt.size,
                    height: opt.size,
                    id: opt.id,
                    source: opt.source,
                    ctx: opt.ctx || null
                }),
                source: opt.source,
                model: getPixelRatio('model') as string,// 设备型号
                system: getPixelRatio('system') as string,// 操作系统名称及版本，如Android 10
                platform: getPixelRatio('platform') as string, //客户端平台，值域为：ios、android、mac（3.1.10+）、windows（3.1.10+）、linux（3.1.10+）
                code: opt.code,
                size:  UNIT_CONVERSION(opt.size),
                id: Object.prototype.toString.call(opt.id) == '[object String]' ? opt.id : "nvue"
            }) : null;
        });
    },300)
    
}
type codeGroup = 'none' | 'starry'| 'square' | 'dots'| 'custom';
interface CodeTypeValue {
    (bg: string,ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number,source: string): void
}
type QRCodeType = Record<codeGroup, CodeTypeValue>
/**
 * @method SetCodeType
 * @author wmf
 * @Date 2021-11-15
 * @LastEditTime 2021-11-22
 * @description 设置二维码码点
 */
const SetCodeType: QRCodeType = {
    // 正常码点
    'none': function (bg: string = "#ffffff",ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number,source: string){
        ctx.fillRect(x,y,w,h);
    },
    // 星星码点 暂未实现
    'starry': function (bg: string = "#ffffff",ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number,source: string){
        ctx.drawImage('', x, y, w, h)
    },
    // 圆点码点
    'dots': function (bg: string = "#ffffff",ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number,source: string){
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, w/2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.setLineWidth(1);
        ctx.setStrokeStyle(bg);
        ctx.stroke();
        ctx.clip();
        ctx.restore();
    },
    //正方形码点
    'square': function (bg: string = "#ffffff", ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number,source: string) {
        if(source == 'MP-BAIDU'){//百度小程序不支持arcTo方法
            ctx.fillRect(x,y,w,h);
            return
        }
		ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arcTo(x + w, y, x + w, y + h, 0);
        ctx.arcTo(x + w, y + h, x, y + h, 0);
        ctx.arcTo(x, y + h, x, y, 0);
        ctx.arcTo(x, y, x + w, y, 0);
		ctx.fill();
        ctx.closePath();
        ctx.setLineWidth(1);
		ctx.setStrokeStyle(bg);
        ctx.stroke();
        ctx.clip();
		ctx.restore()
    },
    // 自定义图片为码点 暂未实现
    'custom': function (bg: string = "#ffffff", ctx: UniApp.CanvasContext,x: number, y: number, w: number, h: number,source: string) {
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
const SetColorCode = function (ctx: UniApp.CanvasContext,w: number,h: number,colors: string[]): void {
    const GRD = SetGradient(ctx,w,h,colors)
    ctx.setFillStyle(GRD)
}


type imgGroup = 'none' | 'circle' | 'round';
interface ImageTypeValue {
    (ctx:UniApp.CanvasContext,size: number, img: StrongCode.CodeImg,source: string): void
}
type ImageType = Record<imgGroup, ImageTypeValue>
/**
 * @author wmf
 * @method SetImageType
 * @description 二维码中间log绘制
 */
const SetImageType: ImageType = {//none circle round
    'none': function SetImageCode(ctx: UniApp.CanvasContext,size: number, img: StrongCode.CodeImg,source: string){
        const iconSize = GETSIZE[source](img.size || 30)
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
    'circle': function SetCircleImg(ctx: UniApp.CanvasContext,size: number, img: StrongCode.CodeImg,source: string){
        const r: number = GETSIZE[source](img.size || 30);
        const w: number = r * 2;
        const x: number = size/2 - r;
        const y: number = size/2 - r;
		const cx: number = x + r;
		const cy: number = y + r;
        ctx.save();
        ctx.beginPath();
		ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.closePath();
		ctx.setLineWidth(GETSIZE[source](img.width || 5))
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
    'round': function SetRoundImg(ctx: UniApp.CanvasContext,size: number, img: StrongCode.CodeImg,source: string) {
        if(source == 'MP-BAIDU'){//百度小程序不支持arcTo方法
            const r: number = GETSIZE[source](img.size || 30);
            const w: number = r * 2;
            const x: number = size/2 - r;
            const y: number = size/2 - r;
            const cx: number = x + r;
            const cy: number = y + r;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.setLineWidth(GETSIZE[source](img.width || 5))
            ctx.setStrokeStyle(img.color || "#FFFFFF"); // 设置绘制圆形边框的颜色
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(img.src, x, y, w, w);
            return

        }
        let r: number = img.degree || 5;
        const iconSize =  GETSIZE[source](img.size || 30);
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
        ctx.setLineWidth(GETSIZE[source](img.width || 5))
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

 const SetBorderCode = function(ctx: UniApp.CanvasContext,w: number, h: number, border: StrongCode.BorderCode, source: string): void {
    const colors: string[] = border?.color || ['#000000'];
    const r: number = border?.degree || 5;
    const x: number = 0;
    const y: number = 0;
    const GRD = SetGradient(ctx,w,h,colors)
    ctx.restore();
    ctx.setGlobalAlpha(border?.opacity || 1);
    if(source == 'MP-BAIDU'){//百度小程序不支持arcTo方法
        ctx.setLineWidth(border?.lineWidth || 5)
        ctx.setStrokeStyle(GRD); // 设置绘制边框的颜色
        ctx.strokeRect(0,0,w,h);
    }else{
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
    }
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
 const SetTextCode = function (ctx: UniApp.CanvasContext, w: number, h: number, text: StrongCode.CodeText, source: string ): void {
    let colors = text.color || ["#FFFFFF"];
    const GRD = SetGradient(ctx, w, h, colors)
    ctx.restore();
    ctx.setGlobalAlpha(text?.opacity || 1)
    ctx.setTextAlign('center');//'left'、'center'、'right'
	ctx.setTextBaseline('middle');//可选值 'top'、'bottom'、'middle'、'normal'
    ctx.font = text?.font || "normal 20px system-ui",
    // 小程序平台文字颜色不支持渐变
    source == 'H5' ? ctx.setFillStyle(GRD) : ctx.setFillStyle(colors[0]);
	ctx.fillText(text.content, w/2, w/2);
    ctx.setGlobalAlpha(1)
}
