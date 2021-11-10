import {
    UNIT_CONVERSION, 
    StringToCode128,
    SaveCodeImg
} from '../common/support'

import {PATTERNS} from '../common/metadata'

//定义条形码参数
interface OperationCodePars {
    id: string | UniApp.CanvasContext,
    width: number,
    height: number,
    code: string,
    bgColor?: string,
    color?: string,
    ctx: object
}

/**
* @author wmf❤洛尘 
* @method OperationCode 创建条形码
* @description 使用UniApp的条形码
*/
export const OperationCode = function (opt: OperationCodePars, callback?: Function) {
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
export const BarCodeCanvas = function (opt: OperationCodePars, ctx: UniApp.CanvasContext, callback?: Function) {
    const width: number = UNIT_CONVERSION(opt.width);
    const height: number = UNIT_CONVERSION(opt.height);
    const CodeNum: number[] = StringToCode128(opt.code);
    let gc = new GraphicContent(ctx, width, height,opt.color || "#000000",opt.bgColor || "#ffffff");
    let barWeight = gc.area.width / ((CodeNum.length - 3) * 11 + 35);
    let x: number = gc.area.left;
    const y = gc.area.top;
    for (let i = 0; i < CodeNum.length; i++) {
        const c = CodeNum[i];
        for (let bar = 0; bar < 8; bar += 2) {
            const barW = PATTERNS[c][bar] * barWeight;
            // const barH = height - y - this.border;
            const barH = height - y;
            const spcW = PATTERNS[c][bar + 1] * barWeight;
            if (barW > 0) {
                gc.fillFgRect(x, y, barW, barH);
            }

            x += barW + spcW;
        }
    }
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
interface areaPars {
    width: number,
    height: number,
    top: number,
    left: number
}
class GraphicContent {
    width: number;
    height:number;
    quiet: number;
    borderSize: number = 0;
    paddingWidth: number = 0;
    ctx: UniApp.CanvasContext;
    color: string;
    backGroud: string;
    area: areaPars;

    constructor (ctx: UniApp.CanvasContext,width: number,height: number,color: string,backGroud: string) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.quiet = Math.round(this.width / 40);
        this.color = color;
        this.backGroud = backGroud;
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
		this.FILLRECT(x,y,width, height,this.color);
	};
	fillBgRect(x: number,y: number, width: number, height: number) {
		this.FILLRECT(x,y, width, height,this.backGroud);
	};
	FILLRECT(x: number,y: number, width: number, height: number,color: string) {
		this.ctx.setFillStyle(color);
		this.ctx.fillRect(x, y, width, height);
	}
}