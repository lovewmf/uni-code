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
 * @method UtF16TO8
 * @description 汉字编码
 * @param code 
 * @returns 编码后的字符串
 */
export const UtF16TO8 = function (code: string): string{
    let out: string = '';
    let c: number = 0;
	for (let i = 0; i < code.length; i++) {
		c = code.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += code.charAt(i);
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
 * @method GetBytes
 * @description 字符串转Unicode编码
 * @param str 
 * @returns 编码数组
 */
export const GetBytes = function (str: string) {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
export const CodeSetAllowedFor = function (chr: number) {
    if (chr >= 48 && chr <= 57) {
        return CODESET.ANY;
    }
    else if (chr >= 32 && chr <= 95) {
        return CODESET.AB;
    }
    else {
        return chr < 32 ? CODESET.A : CODESET.B;
    }
}

export const getBestStartSet = function (csa1: number, csa2: number): number {
    let vote = 0;
    vote += csa1 == CODESET.A ? 1 : 0;
    vote += csa1 == CODESET.B ? -1 : 0;
    vote += csa2 == CODESET.A ? 1 : 0;
    vote += csa2 == CODESET.B ? -1 : 0;
    return vote > 0 ? CODESET.A : CODESET.B;
}
export const codeValue = function (chr1: number, chr2?: number): number {
    if (typeof chr2 == "undefined") {
        return chr1 >= 32 ? chr1 - 32 : chr1 + 64;
    }
    else {
        return parseInt(String.fromCharCode(chr1) + String.fromCharCode(chr2));
    }
}

export const charCompatible = function (chr: number, codeset: number): boolean {
    let csa = codeSetAllowedFor(chr);
    if (csa == CODESET.ANY) return true;
    if (csa == CODESET.AB) return true;
    if (csa == CODESET.A && codeset == CODESET.A) return true;
    if (csa == CODESET.B && codeset == CODESET.B) return true;
    return false;
}

export const codeSetAllowedFor = function (chr: number): number {
    if (chr >= 48 && chr <= 57) {
        return CODESET.ANY;
    }
    else if (chr >= 32 && chr <= 95) {
        return CODESET.AB;
    }
    else {
        return chr < 32 ? CODESET.A : CODESET.B;
    }
}

/**
 * @author wmf❤洛尘
 * @method SaveCodeImg
 * @description 保存二维码或者条形码为图片
 * @param k 
 * @returns 
 */
export const SaveCodeImg = function(k: StrongCode.SaveCanvasPars): object{
    const width: number = UNIT_CONVERSION(Number(k.width));
    const height: number = UNIT_CONVERSION(Number(k.height));
    return new Promise((resolve)=>{
        if (Object.prototype.toString.call(k.id) == '[object String]') {
            uni.canvasToTempFilePath({
                canvasId: k.id as string,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                fileType: k.type || 'png',
                quality: k.quality || 1,
                complete: function(res) {
                    resolve(res)
                }
            }, k.ctx)
        } else if (Object.prototype.toString.call(k.id) == '[object Object]') {//兼容nvue
            const ctx = k.id as StrongCode.NvueCanvasConText;
            ctx.toTempFilePath(0, 0, width, height, width, height, k.type || 'png', 1,(res)=> {
                resolve(res)
            })
        }
    })
}
/**
 * @author wmf❤洛尘
 * @param code 
 * @returns number[]
 * @description 生成条形码所需要的数据
 */
export const StringToCode128 = function (code: string): number[] {
    interface  BarcOpt {
        currcs: number,
    }
    let barc: BarcOpt = {
        currcs: CODESET.C
    };
    let bytes = GetBytes(code);
    let index = bytes[0] == CHAR_TILDE ? 1 : 0;

    const perhapsCodeC = function (bytes: number[], codeset: number): number {
        for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i]
            if ((b < 48 || b > 57) && b != CHAR_TILDE)
                return codeset;
        }
        return CODESET.C;
    }
    const codesForChar = function (chr1: number, chr2: number, currcs: number): number[] {
        let result: number[] = [];
        let shifter = -1;
        if (charCompatible(chr1, currcs)) {
            if (currcs == CODESET.C) {
                if (chr2 == -1) {
                    shifter = SET_CODEB;
                    currcs = CODESET.B;
                }
                else if ((chr2 != -1) && !charCompatible(chr2, currcs)) {
                    if (charCompatible(chr2, CODESET.A)) {
                        shifter = SET_CODEA;
                        currcs = CODESET.A;
                    }
                    else {
                        shifter = SET_CODEB;
                        currcs = CODESET.B;
                    }
                }
            }
        }
        else {
            if ((chr2 != -1) && !charCompatible(chr2, currcs)) {
                switch (currcs) {
                    case CODESET.A:
                        shifter = SET_CODEB;
                        currcs = CODESET.B;
                        break;
                    case CODESET.B:
                        shifter = SET_CODEA;
                        currcs = CODESET.A;
                        break;
                }
            }
            else {
                shifter = SET_SHIFT;
            }
        }
        if (shifter != -1) {
            result.push(shifter);
            result.push(codeValue(chr1));
        }
        else {
            if (currcs == CODESET.C) {
                result.push(codeValue(chr1, chr2));
            }
            else {
                result.push(codeValue(chr1));
            }
        }
        barc.currcs = currcs;

        return result;
    }
    const csa1 = bytes.length > 0 ? CodeSetAllowedFor(bytes[index++]) : CODESET.AB;
    const csa2 = bytes.length > 0 ? CodeSetAllowedFor(bytes[index++]) : CODESET.AB;
    barc.currcs = getBestStartSet(csa1, csa2);
    barc.currcs = perhapsCodeC(bytes, barc.currcs);
    let codes: number[] = [];

    switch (barc.currcs) {
        case CODESET.A:
            codes.push(SET_STARTA);
            break;
        case CODESET.B:
            codes.push(SET_STARTB);
            break;
        default:
            codes.push(SET_STARTC);
            break;
    }
    for (let i = 0; i < bytes.length; i++) {
        let b1 = bytes[i];
        if (b1 in REPLACE_CODES) {
            codes.push(REPLACE_CODES[b1]);
            i++;
            b1 = bytes[i];
        }
        const b2 = bytes.length > (i + 1) ? bytes[i + 1] : -1;
        codes = codes.concat(codesForChar(b1, b2, barc.currcs));

        if (barc.currcs == CODESET.C) i++;
    }
    let checksum = codes[0];
    for (let weight = 1; weight < codes.length; weight++) {
        checksum += (weight * codes[weight]);
    }
    codes.push(checksum % 103);
    codes.push(SET_STOP);
    return codes;
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

    private ecclevel:number = 4;
    private N1:number = 3;
    private N2:number = 3;
    private N3:number = 40;
    private N4:number = 10;

    private neccblk2: number = 0;
    private width: number = 0;
    private neccblk1: number = 0;
    private datablkw: number = 0;
    private eccblkwid: number = 0;
    constructor(level: number = 4){
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
                        if (!r3y && !this.ismasked(x, y))
                            this.qrframe[x + y * this.width] ^= 1;
                    }
                break;
            case 5:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3)
                        r3y = 0;
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3)
                            r3x = 0;
                        if (!((x & y & 1) + this.toNum((this.toNum(r3x) | this.toNum(r3y)))) && !this.ismasked(x, y))
                            this.qrframe[x + y * this.width] ^= 1;
                    }
                }
                break;
            case 6:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3)
                        r3y = 0;
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3)
                            r3x = 0;
                        if (!(((x & y & 1) + (r3x && (r3x == r3y ? 1 : 0))) & 1) && !this.ismasked(x, y))
                            this.qrframe[x + y * this.width] ^= 1;
                    }
                }
                break;
            case 7:
                for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                    if (r3y == 3)
                        r3y = 0;
                    for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                        if (r3x == 3)
                            r3x = 0;
                        if (!(((r3x && (r3x == r3y ? 1 : 0)) + ((x + y) & 1)) & 1) && !this.ismasked(x, y))
                            this.qrframe[x + y * this.width] ^= 1;
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
        for (let k = 0; k < 8; k++) {
            this.applymask(k);
            XX = this.badcheck();
            if (XX < YY) {
                YY = XX;
                TT = k;
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
export const CHAR_TILDE: number = 126;
export const CODE_FNC1: number = 102;
export const SET_STARTA: number = 103;
export const SET_STARTB: number = 104;
export const SET_STARTC: number = 105;
export const SET_SHIFT: number = 98;
export const SET_CODEA: number = 101;
export const SET_CODEB: number = 100;
export const SET_STOP: number = 106;


export const REPLACE_CODES: StrongCode.PCodeOpt = {
    CHAR_TILDE: CODE_FNC1 //GS1-128
}
export const CODESET: StrongCode.Provider = {
    ANY: 1,
    AB: 2,
    A: 3,
    B: 4,
    C: 5
};
