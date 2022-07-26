import {ADELTA, VPAT,fmtword, ECBLOCKS, GLOG, GEXP} from './metadata'
/**
 * @author wmf❤洛尘
 * @method UNIT_CONVERSION
 * @description UniApp rpx ——> px 默认750
 * @param num 
 * @returns 转换后的像素
 */
export const UNIT_CONVERSION = function (num: string | number): number{
	return uni.upx2px(Number(num));
}
/**
 * @author wmf❤洛尘
 * @method getPixelRatio
 * @description 获取设备像素比 获取系统信息同步接口。
 * @returns num Number/String
 */
 export const getPixelRatio = function(name?: string): string | number {
    const res = uni.getSystemInfoSync();
    return res[name || 'pixelRatio']
 }
/**
 * @author wmf❤洛尘
 * @method getTimeDate
 * @description 获取当前日期
 * @returns YY-MM-DD HH:hh:mm
 */
export const getTimeDate = function(): string {
   const date: Date = new Date();
   const year: string = date.toLocaleDateString().replace(/\//g,'-');
   const hour: string = date.toTimeString().slice(0,8);
   return `${year} ${hour}`
}
type sizeGroup = 'none' | 'NVUE' | 'APP-PLUS' |'H5'| 'MP' | 'MP-ALIPAY' | 'MP-WEIXIN' | 'MP-BAIDU' | 'MP-TOUTIAO' | 'MP-LARK' | 'MP-QQ' | 'MP-KUAISHOU' | 'MP-360' | 'QUICKAPP-WEBVIEW' | 'QUICKAPP-WEBVIEW-UNION' | 'QUICKAPP-WEBVIEW-HUAWEI';
interface SizeTypeValue {
    (size: string | number): number
}
type SizeType = Record<sizeGroup, SizeTypeValue>
export const GETSIZE: SizeType = {
    // 支付宝小程序
    'MP-ALIPAY': function (size: string | number): number {
        return UNIT_CONVERSION(size) * (getPixelRatio() as number)
    },
    // 微信小程序
    'MP-WEIXIN': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 百度小程序
    'MP-BAIDU': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 字节小程序
    'MP-TOUTIAO': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // QQ小程序
    'MP-QQ': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 飞书小程序
    'MP-LARK': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 快手小程序
    'MP-KUAISHOU': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 360小程序
    'MP-360': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 快应用通用(包含联盟、华为)
    'QUICKAPP-WEBVIEW': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 快应用联盟
    'QUICKAPP-WEBVIEW-UNION': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // 快应用华为
    'QUICKAPP-WEBVIEW-HUAWEI': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
     // 微信小程序/支付宝小程序/百度小程序/字节跳动小程序/飞书小程序/QQ小程序/360小程序
    'MP': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // App
    'APP-PLUS': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // App nvue
    'NVUE': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    // H5
    'H5': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    },
    'none': function (size: string | number): number {
        return UNIT_CONVERSION(size)  as number
    }
}
/**
 * @author wmf❤洛尘
 * @method UtF16TO8
 * @description 汉字编码
 * @param code 
 * @returns 编码后的字符串
 */
export const UtF16TO8 = function (code: string | number): string{
    const CODE = code.toString();
    let out: string = '';
    let c: number = 0;
	for (let i = 0; i < CODE.length; i++) {
		c = CODE.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += CODE.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

/**
 * @author wmf❤洛尘
 * @method SaveCodeImg
 * @description 保存二维码或者条形码为图片
 * @param k 
 * @returns 
 */
export const SaveCodeImg = function(k: StrongCode.SaveCanvasPars): object{
    let width: number = UNIT_CONVERSION(Number(k.width));
    let height: number = UNIT_CONVERSION(Number(k.height));
    const pixelRatio: number = getPixelRatio('pixelRatio') as  number;
    const destWidth: number = width * pixelRatio;
    const destHeight: number = height * pixelRatio;
    if(k.source == 'MP-ALIPAY'){//支付宝小程序特殊处理
        width = destWidth;
        height = destHeight;
    }
    return new Promise((resolve)=>{
        if (Object.prototype.toString.call(k.id) == '[object String]') {
            uni.canvasToTempFilePath({
                canvasId: k.id as string,
                width: width,
                height: height,
                destWidth: destWidth,
                destHeight: destHeight,
                fileType: k.type || 'jpg',
                quality: k.quality || 1,
                complete: function(res) {
                    resolve(res)
                }
            }, k.ctx)
        } else if (Object.prototype.toString.call(k.id) == '[object Object]') {//兼容nvue
            const ctx = k.id as StrongCode.NvueCanvasConText;
            ctx.toTempFilePath(0, 0, width, height, destWidth, destHeight, k.type || 'png', 1,(res)=> {
                resolve(res)
            })
        }
    })
}
// 颜色渐变设置 后期优化此方法
export const SetGradient = function (ctx: UniApp.CanvasContext,width: number,height: number,colors: string[]): UniApp.CanvasGradient {
    let GRD: UniApp.CanvasGradient = ctx.createLinearGradient(0, 0, width, height);
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
    if(colors.length === 4){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.35, colors[1]);
        GRD.addColorStop(0.7, colors[2]);
        GRD.addColorStop(1, colors[3]);
    }
    if(colors.length === 5){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.35, colors[1]);
        GRD.addColorStop(0.6, colors[2]);
        GRD.addColorStop(0.8, colors[3]);
        GRD.addColorStop(1, colors[4]);
    }
    if(colors.length === 6){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.25, colors[1]);
        GRD.addColorStop(0.45, colors[2]);
        GRD.addColorStop(0.65, colors[3]);
        GRD.addColorStop(0.85, colors[4]);
        GRD.addColorStop(1, colors[5]);
    }
    if(colors.length === 7){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.15, colors[1]);
        GRD.addColorStop(0.35, colors[2]);
        GRD.addColorStop(0.45, colors[3]);
        GRD.addColorStop(0.65, colors[4]);
        GRD.addColorStop(0.85, colors[5]);
        GRD.addColorStop(1, colors[6]);
    }
    if(colors.length === 8){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.1, colors[1]);
        GRD.addColorStop(0.25, colors[2]);
        GRD.addColorStop(0.45, colors[3]);
        GRD.addColorStop(0.65, colors[4]);
        GRD.addColorStop(0.85, colors[5]);
        GRD.addColorStop(0.9, colors[6]);
        GRD.addColorStop(1, colors[7]);
    }
    if(colors.length === 9){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.2, colors[1]);
        GRD.addColorStop(0.3, colors[2]);
        GRD.addColorStop(0.5, colors[3]);
        GRD.addColorStop(0.6, colors[4]);
        GRD.addColorStop(0.7, colors[5]);
        GRD.addColorStop(0.8, colors[6]);
        GRD.addColorStop(0.9, colors[7]);
        GRD.addColorStop(1, colors[8]);
    }
    if(colors.length >= 10){
        GRD.addColorStop(0, colors[0]);
        GRD.addColorStop(0.1, colors[1]);
        GRD.addColorStop(0.2, colors[2]);
        GRD.addColorStop(0.3, colors[3]);
        GRD.addColorStop(0.4, colors[4]);
        GRD.addColorStop(0.5, colors[5]);
        GRD.addColorStop(0.6, colors[6]);
        GRD.addColorStop(0.7, colors[7]);
        GRD.addColorStop(0.85, colors[8]);
        GRD.addColorStop(1, colors[9]);
    }
    return GRD

}
/**
 * @author wmf❤洛尘
 * @method QRCodeInit
 * @returns number[]
 * @description 生成二维码所需要的数据
 */
export class QRCodeInit {
    private strinbuf: number[] = [];
    private eccbuf: number[] = [];
    private qrframe: number[] = [];
    private framask: number[] = [];
    private rlens: number[] = [];
    private genpoly: number[] = []

    private ecclevel:number = 2;
    private N1:number = 3;
    private N2:number = 3;
    private N3:number = 40;
    private N4:number = 10;

    private neccblk2: number = 0;
    private width: number = 0;
    private neccblk1: number = 0;
    private datablkw: number = 0;
    private eccblkwid: number = 0;
    constructor(level: number = 2){
        this.ecclevel = level
    }
    private setmask (x: number,y: number) {
        let bt = null;
        if (x > y) {
            bt = x;
            x = y;
            y = bt;
        }
        bt = y;
        bt *= y;
        bt += y;
        bt >>= 1;
        bt += x;
        this.framask[bt] = 1;
    }
    public getWidth () {
        return this.width;
    }
    private putalign (x: number,y: number) {
        this.qrframe[x + this.width * y] = 1;
        for (let j = -2; j < 2; j++) {
            this.qrframe[(x + j) + this.width * (y - 2)] = 1;
            this.qrframe[(x - 2) + this.width * (y + j + 1)] = 1;
            this.qrframe[(x + 2) + this.width * (y + j)] = 1;
            this.qrframe[(x + j + 1) + this.width * (y + 2)] = 1;
        }
        for (let j = 0; j < 2; j++) {
            this.setmask(x - 1, y + j);
            this.setmask(x + 1, y - j);
            this.setmask(x - j, y - 1);
            this.setmask(x + j, y + 1);
        }

    }
    private modnn (x: number) :number{
        while (x >= 255) {
            x -= 255;
            x = (x >> 8) + (x & 255);
        }
        return x;
    }
    private appendrs (data: number, dlen: number, ecbuf: number, eclen: number) {
        let fb: number;
        for (let i = 0; i < eclen; i++){
            this.strinbuf[ecbuf + i] = 0;
        }
        for (let i = 0; i < dlen; i++) {
            fb = GLOG[this.strinbuf[data + i] ^ this.strinbuf[ecbuf]];
            if (fb != 255){
                for (let j = 1; j < eclen; j++){
                    this.strinbuf[ecbuf + j - 1] = this.strinbuf[ecbuf + j] ^ GEXP[this.modnn(fb + this.genpoly[eclen - j])];
                }
            }else{
                for( let j = ecbuf ; j < ecbuf + eclen; j++ ){
                    this.strinbuf[j] = this.strinbuf[j + 1];
                }
            }
            this.strinbuf[ ecbuf + eclen - 1] = fb == 255 ? 0 : GEXP[this.modnn(fb + this.genpoly[0])];
        }
    }
    private ismasked (x: number, y: number) :number {
        let bt: number;
        if (x > y) {
            bt = x;
            x = y;
            y = bt;
        }
        bt = y;
        bt += y * y;
        bt >>= 1;
        bt += x;
        return this.framask[bt];
    }
    private badruns (length: number) :number{
        let runsbad: number = 0;
        for (let i = 0; i <= length; i++){
            if (this.rlens[i] >= 5){
                runsbad += this.N1 + this.rlens[i] - 5;
            }
        }
        for (let i = 3; i < length - 1; i += 2){
            if (this.rlens[i - 2] == this.rlens[i + 2]
                && this.rlens[i + 2] == this.rlens[i - 1]
                && this.rlens[i - 1] == this.rlens[i + 1]
                && this.rlens[i - 1] * 3 == this.rlens[i]
                && (this.rlens[i - 3] == 0
                    || i + 3 > length  // end
                    || this.rlens[i - 3] * 3 >= this.rlens[i] * 4 || this.rlens[i + 3] * 3 >= this.rlens[i] * 4)
               ){
                runsbad += this.N3;
            }
        }
        return runsbad;
    }
    private toNum (num: number): number {
        return  num === 0 ? 1 : 0
    }
    private applymask (m: number) {
        switch (m) {
            case 0:
                for (let y = 0; y < this.width; y++){
                    for (let x = 0; x < this.width; x++){
                        if (!((x + y) & 1) && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                }
                break;
            case 1:
                for (let y = 0; y < this.width; y++){
                    for (let x = 0; x < this.width; x++){
                        if (!(y & 1) && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                }
                break;
            case 2:
                for (let y = 0; y <this.width; y++)
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3){
                            r3x = 0;
                        }
                        if (!r3x && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                break;
            case 3:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3){
                        r3y = 0;
                    }
                    for (let r3x = r3y, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3){
                            r3x = 0;
                        }
                        if (!r3x && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                }
                break;
            case 4:
                for (let y = 0; y < this.width; y++)
                    for (let r3x = 0, r3y = ((y >> 1) & 1), x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3) {
                            r3x = 0;
                            r3y = r3y > 0  ? 0 : 1;
                        }
                        if (!r3y && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                break;
            case 5:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3){
                        r3y = 0;
                    }
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3){
                            r3x = 0;
                        }
                        if (!((x & y & 1) + this.toNum((this.toNum(r3x) | this.toNum(r3y)))) && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                }
                break;
            case 6:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3){
                        r3y = 0;
                    }
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3){
                            r3x = 0;
                        }
                        if (!(((x & y & 1) + (r3x && (r3x == r3y ? 1 : 0))) & 1) && !this.ismasked(x, y)){
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                }
                break;
            case 7:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3) {
                        r3y = 0;
                    }
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3) {
                            r3x = 0;
                        }
                        if (!(((r3x && (r3x == r3y ? 1 : 0)) + ((x + y) & 1)) & 1) && !this.ismasked(x, y)) {
                            this.qrframe[x + y * this.width] ^= 1;
                        }
                    }
                }
                break;
        }
        return;
    }
    public Genframe (code: string) :number[] {
        let TT: number = code.length;
        let CODES: string = code.slice(0);
        let XX: number = 0;
        let KK:number = 0;
        let YY: number = 0;
        let VV: number = 0;
        let version: number = 0;
        let IF: number = 0;
        let MM: number = 0;
        do {
            version++;
            KK = (this.ecclevel - 1) * 4 + (version - 1) * 16;
            this.neccblk1 = ECBLOCKS[KK++];
            this.neccblk2 = ECBLOCKS[KK++];
            this.datablkw = ECBLOCKS[KK++];
            this.eccblkwid = ECBLOCKS[KK];
            KK = this.datablkw * (this.neccblk1 + this.neccblk2) + this.neccblk2 - 3 + (version <= 9 ? 1 : 0);
            if (TT <= KK)
                break;
        } while (version < 40);
        this.width = 17 + 4 * version;

        VV = this.datablkw + (this.datablkw + this.eccblkwid) * (this.neccblk1 + this.neccblk2) + this.neccblk2;
        for( let t = 0; t < VV; t++ ){
            this.eccbuf[t] = 0;
        }

        for( let t = 0; t < this.width * this.width; t++ ){
            this.qrframe[t] = 0;
        }
        for( let t = 0 ; t < (this.width * (this.width + 1) + 1) / 2; t++){
            this.framask[t] = 0;
        }
        for (let t = 0; t < 3; t++) {
            KK = 0;
            YY = 0;
            if (t == 1){
                KK = (this.width - 7);
            }
            if (t == 2){
                YY = (this.width - 7);
            }
            this.qrframe[(YY + 3) + this.width * (KK + 3)] = 1;
            for (let x = 0; x < 6; x++) {
                this.qrframe[(YY + x) + this.width * KK] = 1;
                this.qrframe[YY + this.width * (KK + x + 1)] = 1;
                this.qrframe[(YY + 6) + this.width * (KK + x)] = 1;
                this.qrframe[(YY + x + 1) + this.width * (KK + 6)] = 1;
            }
            for (let x = 1; x < 5; x++) {
                this.setmask(YY + x, KK + 1);
                this.setmask(YY + 1, KK + x + 1);
                this.setmask(YY + 5, KK + x);
                this.setmask(YY + x + 1, KK + 5);
            }
            for (let x = 2; x < 4; x++) {
                this.qrframe[(YY + x) + this.width * (KK + 2)] = 1;
                this.qrframe[(YY + 2) + this.width * (KK + x + 1)] = 1;
                this.qrframe[(YY + 4) + this.width * (KK + x)] = 1;
                this.qrframe[(YY + x + 1) + this.width * (KK + 4)] = 1;
            }
        }
        if (version > 1) {
            TT = ADELTA[version];
            YY = this.width - 7;
            for (;;) {
                XX = this.width - 7;
                while (XX > TT - 3) {
                    this.putalign(XX, YY);
                    if (XX < TT)
                        break;
                    XX -= TT;
                }
                if (YY <= TT + 9)
                    break;
                YY -= TT;
                this.putalign(6, YY);
                this.putalign(YY, 6);
            }
        }
        this.qrframe[8 + this.width * (this.width - 8)] = 1;
        for (let y = 0; y < 7; y++) {
            this.setmask(7, y);
            this.setmask(this.width - 8, y);
            this.setmask(7, y + this.width - 7);
        }
        for (let x = 0; x < 8; x++) {
            this.setmask(x, 7);
            this.setmask(x + this.width - 8, 7);
            this.setmask(x, this.width - 8);
        }
        for (let x = 0; x < 9; x++)
            this.setmask(x, 8);

        for (let x = 0; x < 8; x++) {
            this.setmask(x + this.width - 8, 8);
            this.setmask(8, x);
        }
        for (let y = 0; y < 7; y++){
            this.setmask(8, y + this.width - 7);
        } 

        for (let x = 0; x < this.width - 14; x++){
            if (x & 1) {
                this.setmask(8 + x, 6);
                this.setmask(6, 8 + x);
            }
            else {
                this.qrframe[(8 + x) + this.width * 6] = 1;
                this.qrframe[6 + this.width * (8 + x)] = 1;
            }
        }
        if (version > 6) {
            TT = VPAT[version - 7];
            KK = 17;
            for (let x = 0; x < 6; x++){
                for (let y = 0; y < 3; y++, KK--){
                    if (1 & (KK > 11 ? version >> (KK - 12) : TT >> KK)) {
                        this.qrframe[(5 - x) + this.width * (2 - y + this.width - 11)] = 1;
                        this.qrframe[(2 - y + this.width - 11) + this.width * (5 - x)] = 1;
                    } else {
                        this.setmask(5 - x, 2 - y + this.width - 11);
                        this.setmask(2 - y + this.width - 11, 5 - x);
                    }
                }
            }
        }
        for (let y = 0; y < this.width; y++){
            for (let x = 0; x <= y; x++){
                if (this.qrframe[x + this.width * y]){
                    this.setmask(x, y);
                }
            }
        }
        VV = CODES.length;
        for( let i = 0 ; i < VV; i++ ){
            this.eccbuf[i] = CODES.charCodeAt(i);
        }
        this.strinbuf = this.eccbuf.slice(0);
        XX = this.datablkw * (this.neccblk1 + this.neccblk2) + this.neccblk2;
        if (VV >= XX - 2) {
            VV = XX - 2;
            if (version > 9){
                VV--;
            }
        }
        IF = VV;
        if (version > 9) {
            this.strinbuf[IF + 2] = 0;
            this.strinbuf[IF + 3] = 0;
            while (IF--) {
                TT = this.strinbuf[IF];
                this.strinbuf[IF + 3] |= 255 & (TT as number << 4);
                this.strinbuf[IF + 2] = TT as number >> 4;
            }
            this.strinbuf[2] |= 255 & (VV << 4);
            this.strinbuf[1] = VV >> 4;
            this.strinbuf[0] = 0x40 | (VV >> 12);
        }else {
            this.strinbuf[IF + 1] = 0;
            this.strinbuf[IF + 2] = 0;
            while (IF--) {
                TT = this.strinbuf[IF];
                this.strinbuf[IF + 2] |= 255 & (TT as number << 4);
                this.strinbuf[IF + 1] = TT >> 4;
            }
            this.strinbuf[1] |= 255 & (VV << 4);
            this.strinbuf[0] = 0x40 | (VV >> 4);
        }
        IF = VV + 3 - (version < 10 ? 1 : 0);
        while (IF < XX) {
            this.strinbuf[IF++] = 0xec;
            this.strinbuf[IF++] = 0x11;
        }
        this.genpoly[0] = 1;
        for (let i = 0; i < this.eccblkwid; i++) {
            this.genpoly[i + 1] = 1;
            for (let j = i; j > 0; j--){
                this.genpoly[j] = this.genpoly[j] ? this.genpoly[j - 1] ^ GEXP[this.modnn(GLOG[this.genpoly[j]] + i)] : this.genpoly[j - 1];
            }
            this.genpoly[0] = GEXP[this.modnn(GLOG[this.genpoly[0]] + i)];
        }
        for (let i = 0; i <= this.eccblkwid; i++){
            this.genpoly[i] = GLOG[this.genpoly[i]];
        }
        KK = XX;
        YY = 0;
        for (let i = 0; i < this.neccblk1; i++) {
            this.appendrs(YY, this.datablkw, KK, this.eccblkwid);
            YY += this.datablkw;
            KK += this.eccblkwid;
        }
        for (let i = 0; i < this.neccblk2; i++) {
            this.appendrs(YY, this.datablkw + 1, KK, this.eccblkwid);
            YY += this.datablkw + 1;
            KK += this.eccblkwid;
        }

        YY = 0;
        for (let i = 0; i < this.datablkw; i++) {
            for (let j = 0; j < this.neccblk1; j++){
                this.eccbuf[YY++] = this.strinbuf[i + j * this.datablkw];
            }
            for (let j = 0; j < this.neccblk2; j++){
                this.eccbuf[YY++] = this.strinbuf[(this.neccblk1 * this.datablkw) + i + (j * (this.datablkw + 1))];
            }
        }
        for (let j = 0; j < this.neccblk2; j++){
            this.eccbuf[YY++] = this.strinbuf[(this.neccblk1 * this.datablkw) + IF + (j * (this.datablkw + 1))];
        }
        for (let i = 0; i < this.eccblkwid; i++){
            for (let j = 0; j < this.neccblk1 + this.neccblk2; j++){
                this.eccbuf[YY++] = this.strinbuf[XX + i + j * this.eccblkwid];
            }
        }
        this.strinbuf = this.eccbuf;
        XX = YY = this.width - 1;
        KK = VV = 1;

        MM = (this.datablkw + this.eccblkwid) * (this.neccblk1 + this.neccblk2) + this.neccblk2;
        for (let i = 0; i < MM; i++) {
            TT = this.strinbuf[i];
            for (let j = 0; j < 8; j++, TT <<= 1) {
                if (0x80 & TT){
                    this.qrframe[XX + this.width * YY] = 1;
                }
                do {
                    if (VV)
                        XX--;
                    else {
                        XX++;
                        if (KK) {
                            if (YY != 0)
                                YY--;
                            else {
                                XX -= 2;
                                KK =  (KK === 0 ? 1 : 0);
                                if (XX == 6) {
                                    XX--;
                                    YY = 9;
                                }
                            }
                        }
                        else {
                            if (YY != this.width - 1)
                                YY++;
                            else {
                                XX -= 2;
                                KK = (KK === 0 ? 1: 0);
                                if (XX == 6) {
                                    XX--;
                                    YY -= 8;
                                }
                            }
                        }
                    }
                    VV = (VV >0 ? 0 : 1);
                } while (this.ismasked(XX, YY));
            }
        }

        this.strinbuf = this.qrframe.slice(0);
        TT = 0;
        YY = 30000;
        for ( KK = 0; KK < 8; KK++) {
            this.applymask(KK);
            XX = this.badcheck();
            if (XX < YY) {
                YY = XX;
                TT = KK;
            }
            if (TT == 7)
                break;
            this.qrframe = this.strinbuf.slice(0);
        }
        if (TT != KK){
            this.applymask(TT);
        }
        YY = fmtword[TT + ((this.ecclevel - 1) << 3)];

        for (let k = 0; k < 8; k++, YY >>= 1){
            if (YY & 1) {
                this.qrframe[(this.width - 1 - k) + this.width * 8] = 1;
                if (k < 6){
                    this.qrframe[8 + this.width * k] = 1;
                }else{
                    this.qrframe[8 + this.width * (k + 1)] = 1;
                }
            }
        }
        for (let k = 0; k < 7; k++, YY >>= 1){
            if (YY & 1) {
                this.qrframe[8 + this.width * (this.width - 7 + k)] = 1;
                if (k){
                    this.qrframe[(6 - k) + this.width * 8] = 1;
                }else{
                    this.qrframe[7 + this.width * 8] = 1;
                }
            }
        }
        return this.qrframe;
    }
    private badcheck () :number  {
        let thisbad: number = 0;
        let bw: number = 0;
        let h: number = 0;
        let b: number = 0;
        let b1: number = 0;
        let w: number = 0;
        let f: number = 0;
        for (let y = 0; y < this.width - 1; y++){
            for (let x = 0; x < this.width - 1; x++)
                if ((this.qrframe[x + this.width * y] && this.qrframe[(x + 1) + this.width * y]
                     && this.qrframe[x + this.width * (y + 1)] && this.qrframe[(x + 1) + this.width * (y + 1)]) // all black
                    || !(this.qrframe[x + this.width * y] || this.qrframe[(x + 1) + this.width * y]
                         || this.qrframe[x + this.width * (y + 1)] || this.qrframe[(x + 1) + this.width * (y + 1)])) {
                    thisbad += this.N2;
                }
        }
        for (let y = 0; y < this.width; y++) {
            this.rlens[0] = 0;
            for (h = b = w = 0; w < this.width; w++) {
                if ((b1 = this.qrframe[w + this.width * y]) == b){
                    this.rlens[h]++;
                }else{
                    this.rlens[++h] = 1;
                }
                b = b1;
                bw += b ? 1 : -1;
            }
            thisbad += this.badruns(h);
        }
        if (bw < 0){
            bw = -bw;
        }

        let big: number = bw;
        let count: number = 0;
        big += big << 2;
        big <<= 1;
        while (big > this.width * this.width)
            big -= this.width * this.width, count++;
        thisbad += count * this.N4;
        for (let x = 0; x < this.width; x++) {
            this.rlens[0] = 0;
            for (h = b = f = 0; f < this.width; f++) {
                if ((b1 = this.qrframe[x + this.width * f]) == b){
                    this.rlens[h]++;
                }else{
                    this.rlens[++h] = 1;
                }
                b = b1;
            }
            thisbad += this.badruns(h);
        }
        return thisbad;
    }
}
