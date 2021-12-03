import {
    UNIT_CONVERSION, 
    SaveCodeImg,
    SetGradient,
    getTimeDate,
    getPixelRatio,
    GETSIZE
} from '../common/support'

import { BarCode128 } from '../codeType'

import {PATTERNS} from '../common/metadata'

/**
* @author wmf❤洛尘 
* @method OperationCode 创建条形码
* @description 使用UniApp的条形码
*/
export const OperationCode = function (opt: StrongCode.OperationCodePars, callback?: Function) {
    if (!opt.code) {
        console.warn("没有找到条形码code");
        return
    }
    if (!opt.id){
        console.warn("没有找到条形码canvas id或者实列!");
        return
    }
    let CTX: UniApp.CanvasContext;
    const timeStar: number = new Date().getTime();
    if (Object.prototype.toString.call(opt.id) == '[object String]') {
        CTX = uni.createCanvasContext(<string>opt.id, opt.ctx || null);
        BarCodeCanvas(timeStar,opt, CTX, callback)
    } else if (Object.prototype.toString.call(opt.id) == '[object Object]') {//在此兼容nvue
        CTX = opt.id as UniApp.CanvasContext;
        BarCodeCanvas(timeStar,opt, CTX, callback)
    }
}
export const BarCodeCanvas = function (time: number,opt: StrongCode.OperationCodePars, ctx: UniApp.CanvasContext, callback?: Function) {
    const width: number = GETSIZE[opt.source || 'none'] ? GETSIZE[opt.source || 'none'](opt.width) : UNIT_CONVERSION(opt.width);
    const height: number = GETSIZE[opt.source || 'none'] ? GETSIZE[opt.source || 'none'](opt.height) : UNIT_CONVERSION(opt.height);
    //设置背景色
    ctx.setFillStyle(opt.bgColor || '#FFFFFF');

    let gc = new GraphicContentInit(ctx, width, height);
    
    //设置颜色
    opt.color ? SetBarCodeColors(ctx, width, height, opt.color || ['#000000']) : ctx.setFillStyle("#000000");

    SetBarCodeType[opt.type || 'CODE128'](opt.code,gc,height)
    
    ctx.draw(false, async (res) => {
        callback ? callback({
            ...res,
            createTime: getTimeDate(),
            takeUpTime: ((new Date()).getTime()) - time, 
            img: await SaveCodeImg({
                width: opt.width,
                height: opt.height,
                id: opt.id,
                ctx: opt.ctx || null
            }),
            model: getPixelRatio('model') as string,// 设备型号
            system: getPixelRatio('system') as string,// 操作系统名称及版本，如Android 10
            platform: getPixelRatio('platform') as string, //客户端平台，值域为：ios、android、mac（3.1.10+）、windows（3.1.10+）、linux（3.1.10+）
            code: opt.code,
            with:  UNIT_CONVERSION(opt.width),
            height:  UNIT_CONVERSION(opt.height),
            id: Object.prototype.toString.call(opt.id) == '[object String]' ? opt.id : "nvue"
        }) : null;
    });
}
//设置条形码颜色渐变色
const SetBarCodeColors = function (ctx: UniApp.CanvasContext,width: number,height: number,colors: string[]) {
    const GRD = SetGradient(ctx,width,height,colors)
    ctx.setFillStyle(GRD)
}

type codeGroup = 'CODE128' | 'CODE39' | 'EAN13' | 'UPCE' | 'UPCE' | 'UPC' | 'ITF' | 'ITF14' | 'MSI' | 'Codabar' | 'Pharmacode';
interface CodeTypeValue {
    (code: string, gc: GraphicContentInit,height: number): void
}
type BarCodeType = Record<codeGroup, CodeTypeValue>

/**
 * @method SetBarCodeType
 * @author wmf❤洛尘
 * @Date 2021-11-22
 * @LastEditTime 2021-11-22
 * @description 生成的条形码类型
 */
const SetBarCodeType: BarCodeType = {
    /**
     * @method CODE128
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @description 条形码类型 默认CODE128
     */
    "CODE128": function CODE128 (code: string, gc: GraphicContentInit,height: number) {
        const CodeNum: number[] = BarCode128(code);
        let barWeight = gc.area.width / ((CodeNum.length - 3) * 11 + 35);
        let x: number = gc.area.left;
        const y = gc.area.top;
        // const barH = height - y - this.border
        const barH = height - gc.area.top;
        for (let i = 0; i < CodeNum.length; i++) {
            const c = CodeNum[i];
            for (let bar = 0; bar < 8; bar += 2) {
                const barW = PATTERNS[c][bar] * barWeight;
                const spcW = PATTERNS[c][bar + 1] * barWeight;
                if (barW > 0) {
                    gc.fillFgRect(x, y, barW, barH);
                }

                x += barW + spcW;
            }
        }
    },
    /**
     * @method CODE39
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 CODE39
     */
    "CODE39": function CODE39 (code: string, gc: GraphicContentInit, height: number): void {
        const CodeNum: number[] = BarCode128(code);
        let barWeight = gc.area.width / ((CodeNum.length - 3) * 11 + 35);
        let x: number = gc.area.left;
        const y = gc.area.top;
        // const barH = height - y - this.border
        const barH = height - gc.area.top;
        for (let i = 0; i < CodeNum.length; i++) {
            const c = CodeNum[i];
            for (let bar = 0; bar < 8; bar += 2) {
                const barW = PATTERNS[c][bar] * barWeight;
                const spcW = PATTERNS[c][bar + 1] * barWeight;
                if (barW > 0) {
                    gc.fillFgRect(x, y, barW, barH);
                }

                x += barW + spcW;
            }
        }
    },
    /**
     * @method EAN13
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 EAN2
     */
    "EAN13": function EAN13 (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^[0-9]{12}$/) === -1){
            console.error("条形码编码：code不符合EAN13规范");
            return
        }
        console.error("条形码编码类型：EAN暂未实现");
    },
    /**
     * @method UPCE
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 UPCE
     */
     "UPCE": function UPCE (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^[0-9]{6}$/) === -1){
            console.error("条形码编码：code不符合UPCE规范");
            return
        }
        console.error("条形码编码类型：EAN暂未实现");
    },
    /**
     * @method UPC
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 UPC
     */
     "UPC": function UPC (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^[0-9]{1}$/) === -1){
            console.error("条形码编码：code不符合UPC规范");
            return
        }
        console.error("条形码编码类型：EAN暂未实现");
    },
    /**
     * @method ITF
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 ITF
     */
    "ITF": function ITF (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^([0-9]{2})+$/) === -1){
            console.error("条形码编码：code不符合ITF规范");
            return
        }
        console.error("条形码编码类型：ITF暂未实现");
    },
    /**
     * @method ITF14
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 ITF14
     */
    "ITF14": function ITF14 (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^[0-9]{14}$/) === -1){
            console.error("条形码编码：code不符合ITF14规范");
            return
        }
        console.error("条形码编码类型：ITF14暂未实现");
    },
    /**
     * @method MSI
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 MSI
     */
    "MSI": function MSI (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^[0-9]+$/) === -1){
            console.error("条形码编码：code不符合MSI规范");
            return
        }
        console.error("条形码编码类型：MSI暂未实现");
    },
    /**
     * @method Codabar
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 Codabar
     */
    "Codabar": function Codabar (code: string, gc: GraphicContentInit, height: number): void {
        if(code.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) === -1){
            console.error("条形码编码：code不符合Codabar规范");
            return
        }
        console.error("条形码编码类型：Codabar暂未实现");
    },
    /**
     * @method Pharmacode
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 Pharmacode
     */
    "Pharmacode": function Pharmacode (code: string, gc: GraphicContentInit, height: number): void {

        if(isNaN(parseInt(code,10))){
            console.error("条形码编码：code不符合Pharmacode类型");
            return
        }
        if(!(Number(code) >= 3 && Number(code) <= 131070)){
            console.error("条形码编码：code不符合Pharmacode类型");
            return
        }
        console.error("条形码编码类型：Pharmacode暂未实现");
    }
}
/**
 * @method GraphicContentInit
 * @description 初始化条形码
 */
class GraphicContentInit {
    width: number;
    height:number;
    quiet: number;
    borderSize: number = 0;
    paddingWidth: number = 0;
    ctx: UniApp.CanvasContext;
    area: StrongCode.areaPars;

    constructor (ctx: UniApp.CanvasContext,width: number,height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.quiet = Math.round(this.width / 40);
        this.area = {
            width: width - this.paddingWidth * 2 - this.quiet * 2,
            height: height - this.borderSize * 2,
            top: this.borderSize - 4,
            left: this.borderSize + this.quiet
        };
        this.fillBgRect(0,0, width, height);
        this.fillBgRect(0, this.borderSize, width, height - this.borderSize * 2);
    }
    
    fillFgRect(x: number,y: number, width: number, height: number) {
		this.FILLRECT(x,y,width, height);
	};
	fillBgRect(x: number,y: number, width: number, height: number) {
		this.FILLRECT(x,y, width, height);
	};
	FILLRECT(x: number,y: number, width: number, height: number) {
		this.ctx.fillRect(x, y, width, height);
	}
}