import {
    QRCodeInit,
    UNIT_CONVERSION,
    UtF16TO8,
    SaveCodeImg
} from '../common/support'

/**
* @description 定义二维码参数
*/
interface BorderCode {
    color: string[],
    lineWidth: number
}
interface BarCodePars {
    id: string | UniApp.CanvasContext,
    size: string | number,
    code: string,
    level?: number,
    bgColor?: string,
    color?: string[],
    img?: string,
    iconSize?: number,
    border?: BorderCode,
    ctx: object
}
export const WidgetCode = function(opt: BarCodePars,callback?: Function){
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
const RepaintCanvas = function (opt:BarCodePars, ctx: UniApp.CanvasContext, frame: number[], width: number, callback?: Function) {

    const SIZE: number = UNIT_CONVERSION(opt.size)
    const px: number = Math.round(SIZE / (width + 8));
    const roundedSize: number = px * (width + 8);
    const offset: number = Math.floor((SIZE - roundedSize) / 2);

    ctx.clearRect(0, 0, SIZE, SIZE);// 二维码大小
    ctx.setFillStyle(opt.bgColor || '#FFFFFF');//二维码背景色
    ctx.fillRect(0, 0, SIZE, SIZE);

    opt.color ? SetColorCode(ctx,SIZE,opt.color) : ctx.setFillStyle("#000000");
    opt.border ? SetBorderCode(ctx,SIZE,opt.border) : false;

    for (let i = 0; i < width; i++) {//开始生成二维码
        for (let j = 0; j < width; j++) {
            if (frame[j * width + i]) {
                ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
            }
        }
    }
    // 图片放在下面 防止图片在二维码下面
    opt.img ? SetImageCode(ctx,SIZE, opt.iconSize, opt.img) : false;

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
/**
 * @method SetColorCode
 * @author wmf
 * @Date 2021-11-08
 * @LastEditTime 2021-11-08
 * @todo 颜色支持多种渐变
 * @description 设置二维码颜色 支持渐变色
 */
const SetColorCode = function (ctx: UniApp.CanvasContext,size: number,colors: string[]): void {
    let Gradient: UniApp.CanvasGradient = ctx.createLinearGradient(0, 0, size, 0);
    if(colors.length === 1){
        Gradient.addColorStop(0, colors[0]);
        Gradient.addColorStop(1, colors[0]);
    }
    if(colors.length === 2){
        Gradient.addColorStop(0, colors[0]);
        Gradient.addColorStop(1, colors[1]);
    }
    if(colors.length === 3){
        Gradient.addColorStop(0, colors[0]);
        Gradient.addColorStop(0.5, colors[1]);
        Gradient.addColorStop(1, colors[2]);
    }
    ctx.setFillStyle(Gradient)
}

/**
 * @method SetImageCode
 * @author wmf
 * @todo 二维码中间log type 圆形 圆角 图片周围白色边框
 * @description 设置二维码log
 */
const SetImageCode = function(ctx: UniApp.CanvasContext,size: number,iconSize: number = 30 ,img: string): void {
    let width =  Number(((size - (iconSize)) / 2).toFixed(2));
    ctx.drawImage(img, width, width, iconSize, iconSize)
}
/**
 * 
 * @method SetBorderCode
 * @author wmf
 * @todo 二维码边框 圆角 边框颜色支持多种渐变
 * @description 设置二维码边框
 */
 const SetBorderCode = function(ctx: UniApp.CanvasContext,size: number,border?: BorderCode): void {
    let colors: string[] = border?.color || ['#000000'];
    let lineWidth: number = border?.lineWidth || 4;
    let Gradient: UniApp.CanvasGradient = ctx.createLinearGradient(0, 0, size, 0);
    if(colors.length === 1){
        Gradient.addColorStop(0, colors[0]);
        Gradient.addColorStop(1, colors[0]);
    }
    if(colors.length === 2){
        Gradient.addColorStop(0, colors[0]);
        Gradient.addColorStop(1, colors[1]);
    }
    if(colors.length === 3){
        Gradient.addColorStop(0, colors[0]);
        Gradient.addColorStop(0.5, colors[1]);
        Gradient.addColorStop(1, colors[2]);
    }
    ctx.setStrokeStyle(Gradient)
    ctx.setLineWidth(lineWidth);
    ctx.strokeRect(0, 0, size, size)
}