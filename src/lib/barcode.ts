import {
    UNIT_CONVERSION, 
    SaveCodeImg
} from '../common/support'

import { BarCode128, BarCode39 } from '../codeType'

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
    if (Object.prototype.toString.call(opt.id) == '[object String]') {
        CTX = uni.createCanvasContext(<string>opt.id, opt.ctx || null);
        BarCodeCanvas(opt, CTX, callback)
    } else if (Object.prototype.toString.call(opt.id) == '[object Object]') {//在此兼容nvue
        CTX = opt.id as UniApp.CanvasContext;
        BarCodeCanvas(opt, CTX, callback)
    }
}
export const BarCodeCanvas = function (opt: StrongCode.OperationCodePars, ctx: UniApp.CanvasContext, callback?: Function) {
    const width: number = UNIT_CONVERSION(opt.width);
    const height: number = UNIT_CONVERSION(opt.height);
    //设置背景色
    ctx.setFillStyle(opt.bgColor || '#FFFFFF');

    let gc = new GraphicContentInit(ctx, width, height);
    
    //设置颜色
    opt.color ? SetBarCodeColors(ctx, width, height, opt.color || ['#000000']) : ctx.setFillStyle("#000000");

    SetBarCodeType[opt.type || 'CODE128'](opt.code,gc,height)
    
    ctx.draw(false, async (res) => {
        callback ? callback({
            ...res,
            img: await SaveCodeImg({
                width: opt.width,
                height: opt.height,
                id: opt.id,
                ctx: opt.ctx || null
            }),
            id: Object.prototype.toString.call(opt.id) == '[object String]' ? opt.id : "nvue"
        }) : null;
    });
}
//设置条形码颜色渐变色
const SetBarCodeColors = function (ctx: UniApp.CanvasContext,width: number,height: number,colors: string[]) {
    const GRD = ctx.createLinearGradient(0, 0, width, height);
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
const SetBarCodeType = {
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
        const barH = height - gc.area.top;
        for (let i = 0; i < CodeNum.length; i++) {
            const c = CodeNum[i];
            for (let bar = 0; bar < 8; bar += 2) {
                const barW = PATTERNS[c][bar] * barWeight;
                // const barH = height - y - this.border
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
        new BarCode39(code);
        // const binary = Code39.encode()
        console.error("条形码编码类型：CODE39暂未实现");
        
        // let x: number = gc.area.left;
        // const y = gc.area.top;
		// for(let i = 0; i < binary.length; i++){
        //     const c = Number(binary[i]);
		// 	x = i * 2;
		// 	if(c === 1){
        //         gc.fillFgRect(x, y,5, height);
		// 	}
		// }
    },
    /**
     * @method EAN
     * @param code 条形码的值
     * @param gc 
     * @param height 
     * @todo 待实现
     * @description 条形码类型 EAN
     */
    "EAN": function EAN (code: string, gc: GraphicContentInit, height: number): void {
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
        console.error("条形码编码类型：ITF暂未实现");
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