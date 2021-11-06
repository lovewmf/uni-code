import {
    gexp,
    glog,
    eccblocks,
    vpat,
    adelta
} from '../common/support'

/**
* @description 定义二维码参数
*/
interface BarCodePars {
    id: string|object,
    width: string|number,
    height: string|number,
    code: string,
    bgColor: string,
    color: string[]
    ctx: object
}
// export const BarCode = function(opt: BarCodePars,callback?: void){
//     let [strinbuf,eccbuf,qrframe,framask,rlens] = [[],[],[],[],[]];
//     let [version, width, neccblk1, neccblk2, datablkw, eccblkwid] = ['','','','','','']
//     let ecclevel:number = 2;


// }
export class WidgetCode {
    strinbuf: Array<string|number> = [];
    eccbuf: number[] = [];
    qrframe: number[] = [];
    framask: number[] = [];
    rlens: number[] = [];
    genpoly: number[] = []

    ecclevel:number = 2;
    N1:number = 3;
    N2:number = 3;
    N3:number = 40;
    N4:number = 10;

    version: string = '';
    neccblk2: number = 0;
    width: number = 0;
    neccblk1: number = 0;
    datablkw: number = 0;
    eccblkwid: number = 0;

    setmask(x:number,y:number){
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
    putalign (x:number,y:number) {
        let j = null;
        this.qrframe[x + this.width * y] = 1;
        for (j = -2; j < 2; j++) {
            this.qrframe[(x + j) + this.width * (y - 2)] = 1;
            this.qrframe[(x - 2) + this.width * (y + j + 1)] = 1;
            this.qrframe[(x + 2) + this.width * (y + j)] = 1;
            this.qrframe[(x + j + 1) + this.width * (y + 2)] = 1;
        }
        for (j = 0; j < 2; j++) {
            this.setmask(x - 1, y + j);
            this.setmask(x + 1, y - j);
            this.setmask(x - j, y - 1);
            this.setmask(x + j, y + 1);
        }

    }
    modnn (x: number) {
        while (x >= 255) {
            x -= 255;
            x = (x >> 8) + (x & 255);
        }
        return x;
    }
    appendrs (data:number, dlen:number, ecbuf:number, eclen:number) {
        let fb:number;
        for (let i = 0; i < eclen; i++){
            this.strinbuf[0] = 0;
        }
        for (let i = 0; i < dlen; i++) {
            const a: string = this.strinbuf[data + i];
            const b: string = this.strinbuf[ecbuf];
            fb = glog[a ^ b];
            if (fb != 255){
                for (let j = 1; j < eclen; j++){
                    this.strinbuf[ecbuf + j - 1] = this.strinbuf[ecbuf + j] ^ gexp[this.modnn(fb + this.genpoly[eclen - j])];
                }
            }else{
                for( let j = ecbuf ; j < ecbuf + eclen; j++ ){
                    this.strinbuf[j] = this.strinbuf[j + 1];
                }
            }
            this.strinbuf[ ecbuf + eclen - 1] = fb == 255 ? 0 : gexp[this.modnn(fb + this.genpoly[0])];
        }
    }
    ismasked (x:number, y:number) {
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
    badruns (length: number) {
        let runsbad: number = 0;
        for (let i = 0; i <= length; i++)
            if (this.rlens[i] >= 5)
                runsbad += this.N1 + this.rlens[i] - 5;
        for (let i = 3; i < length - 1; i += 2)
            if (this.rlens[i - 2] == this.rlens[i + 2]
                && this.rlens[i + 2] == this.rlens[i - 1]
                && this.rlens[i - 1] == this.rlens[i + 1]
                && this.rlens[i - 1] * 3 == this.rlens[i]
                && (this.rlens[i - 3] == 0
                    || i + 3 > length  // end
                    || this.rlens[i - 3] * 3 >= this.rlens[i] * 4 || this.rlens[i + 3] * 3 >= this.rlens[i] * 4)
               )
                runsbad += this.N3;
        return runsbad;
    }
    toNum (num:number) {
        return  num === 0 ? 1 : 0
    }
    applymask (m:number) {
        switch (m) {
        case 0:
            for (let y = 0; y < this.width; y++)
                for (let x = 0; x < this.width; x++)
                    if (!((x + y) & 1) && !this.ismasked(x, y))
                        this.qrframe[x + y * this.width] ^= 1;
            break;
        case 1:
            for (let y = 0; y < this.width; y++)
                for (let x = 0; x < this.width; x++)
                    if (!(y & 1) && !this.ismasked(x, y))
                        this.qrframe[x + y * this.width] ^= 1;
            break;
        case 2:
            for (let y = 0; y <this.width; y++)
                for (let r3x = 0, x = 0; x < this.width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!r3x && !this.ismasked(x, y))
                        this.qrframe[x + y * this.width] ^= 1;
                }
            break;
        case 3:
            for (let r3y = 0, y = 0; y < this.width; y++, r3y++) {
                if (r3y == 3)
                    r3y = 0;
                for (let r3x = r3y, x = 0; x < this.width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!r3x && !this.ismasked(x, y))
                        this.qrframe[x + y * this.width] ^= 1;
                }
            }
            break;
        case 4:
            for (let y = 0; y < this.width; y++)
                for (let r3x = 0, r3y = ((y >> 1) & 1), x = 0; x < this.width; x++, r3x++) {
                    if (r3x == 3) {
                        r3x = 0;
                        // r3y = !r3y;
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
    genframe (instring: string) {
        // var x j;
        let t: number = instring.length;
        let k:number = 0;
        let y: number = 0;
        let v: number = 0;
        let version: number = 0;
        let i: number = 0;
        let m: number = 0;
        do {
            version++;
            k = (this.ecclevel - 1) * 4 + (version - 1) * 16;
            this.neccblk1 = eccblocks[k++];
            this.neccblk2 = eccblocks[k++];
            this.datablkw = eccblocks[k++];
            this.eccblkwid = eccblocks[k];
            k = this.datablkw * (this.neccblk1 + this.neccblk2) + this.neccblk2 - 3 + (version <= 9 ? 1 : 0);
            if (t <= k)
                break;
        } while (version < 40);
        this.width = 17 + 4 * version;

        v = this.datablkw + (this.datablkw + this.eccblkwid) * (this.neccblk1 + this.neccblk2) + this.neccblk2;
        for( let t = 0; t < v; t++ )
            this.eccbuf[t] = 0;
        this.strinbuf = [...instring];

        for( let t = 0; t < this.width * this.width; t++ )
            this.qrframe[t] = 0;

        for( let t = 0 ; t < (this.width * (this.width + 1) + 1) / 2; t++)
            this.framask[t] = 0;
        for (let t = 0; t < 3; t++) {
            k = 0;
            y = 0;
            if (t == 1)
                k = (this.width - 7);
            if (t == 2)
                y = (this.width - 7);
            this.qrframe[(y + 3) + this.width * (k + 3)] = 1;
            for (let x = 0; x < 6; x++) {
                this.qrframe[(y + x) + this.width * k] = 1;
                this.qrframe[y + this.width * (k + x + 1)] = 1;
                this.qrframe[(y + 6) + this.width * (k + x)] = 1;
                this.qrframe[(y + x + 1) + this.width * (k + 6)] = 1;
            }
            for (let x = 1; x < 5; x++) {
                this.setmask(y + x, k + 1);
                this.setmask(y + 1, k + x + 1);
                this.setmask(y + 5, k + x);
                this.setmask(y + x + 1, k + 5);
            }
            for (let x = 2; x < 4; x++) {
                this.qrframe[(y + x) + this.width * (k + 2)] = 1;
                this.qrframe[(y + 2) + this.width * (k + x + 1)] = 1;
                this.qrframe[(y + 4) + this.width * (k + x)] = 1;
                this.qrframe[(y + x + 1) + this.width * (k + 4)] = 1;
            }
        }
        if (version > 1) {
            t = adelta[version];
            y = this.width - 7;
            for (;;) {
                let x: number = this.width - 7;
                while (x > t - 3) {
                    this.putalign(x, y);
                    if (x < t)
                        break;
                    x -= t;
                }
                if (y <= t + 9)
                    break;
                y -= t;
                this.putalign(6, y);
                this.putalign(y, 6);
            }
        }
        this.qrframe[8 + this.width * (this.width - 8)] = 1;
        for (y = 0; y < 7; y++) {
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
        for (y = 0; y < 7; y++)
            this.setmask(8, y + this.width - 7);

        for (let x = 0; x < this.width - 14; x++)
            if (x & 1) {
                this.setmask(8 + x, 6);
                this.setmask(6, 8 + x);
            }
            else {
                this.qrframe[(8 + x) + this.width * 6] = 1;
                this.qrframe[6 + this.width * (8 + x)] = 1;
            }
        if (version > 6) {
            t = vpat[version - 7];
            k = 17;
            for (let x = 0; x < 6; x++)
                for (y = 0; y < 3; y++, k--)
                    if (1 & (k > 11 ? version >> (k - 12) : t >> k)) {
                        this.qrframe[(5 - x) + this.width * (2 - y + this.width - 11)] = 1;
                        this.qrframe[(2 - y + this.width - 11) + this.width * (5 - x)] = 1;
                    }
            else {
                this.setmask(5 - x, 2 - y + this.width - 11);
                this.setmask(2 - y + this.width - 11, 5 - x);
            }
        }
        for (y = 0; y < this.width; y++)
            for (let x = 0; x <= y; x++)
                if (this.qrframe[x + this.width * y])
                    this.setmask(x, y);

        v = this.strinbuf.length;
        // const a:string = "https://www.badi"
        // console.log(a[0].charCodeAt(0))
        for( let i = 0 ; i < v; i++ )
            this.eccbuf[i] = this.strinbuf.toString().charCodeAt(i);
        this.strinbuf = this.eccbuf.slice(0);

        let x = this.datablkw * (this.neccblk1 + this.neccblk2) + this.neccblk2;
        if (v >= x - 2) {
            v = x - 2;
            if (version > 9)
                v--;
        }

        i = v;
        if (version > 9) {
            this.strinbuf[i + 2] = 0;
            this.strinbuf[i + 3] = 0;
            while (i--) {
                t = this.strinbuf[i];
                this.strinbuf[i + 3] |= 255 & (t as number << 4);
                this.strinbuf[i + 2] = t as number >> 4;
            }
            this.strinbuf[2] |= 255 & (v << 4);
            this.strinbuf[1] = v >> 4;
            this.strinbuf[0] = 0x40 | (v >> 12);
        }
        else {
            this.strinbuf[i + 1] = 0;
            this.strinbuf[i + 2] = 0;
            while (i--) {
                t = this.strinbuf[i];
                this.strinbuf[i + 2] |= 255 & (t as number << 4);
                this.strinbuf[i + 1] = t >> 4;
            }
            this.strinbuf[1] |= 255 & (v << 4);
            this.strinbuf[0] = 0x40 | (v >> 4);
        }

        i = v + 3 - (Number(version) < 10);
        while (i < x) {
            this.strinbuf[i++] = 0xec;

            this.strinbuf[i++] = 0x11;
        }
        this.genpoly[0] = 1;
        for (i = 0; i < this.eccblkwid; i++) {
            this.genpoly[i + 1] = 1;
            for (let j = i; j > 0; j--)
                this.genpoly[j] = this.genpoly[j]
                ? this.genpoly[j - 1] ^ gexp[this.modnn(glog[this.genpoly[j]] + i)] : this.genpoly[j - 1];
            this.genpoly[0] = gexp[this.modnn(glog[this.genpoly[0]] + i)];
        }
        for (i = 0; i <= this.eccblkwid; i++)
            this.genpoly[i] = glog[this.genpoly[i]];

        k = x;
        y = 0;
        for (i = 0; i < this.neccblk1; i++) {
            this.appendrs(y, this.datablkw, k, this.eccblkwid);
            y += this.datablkw;
            k += this.eccblkwid;
        }
        for (i = 0; i < this.neccblk2; i++) {
            this.appendrs(y, this.datablkw + 1, k, this.eccblkwid);
            y += this.datablkw + 1;
            k += this.eccblkwid;
        }

        y = 0;
        for (let i = 0; i < this.datablkw; i++) {
            for (let j = 0; j < this.neccblk1; j++)
                this.eccbuf[y++] = this.strinbuf[i + j * this.datablkw];
            for (let j = 0; j < this.neccblk2; j++)
                this.eccbuf[y++] = this.strinbuf[(this.neccblk1 * this.datablkw) + i + (j * (this.datablkw + 1))];
        }
        for (let j = 0; j < this.neccblk2; j++)
            this.eccbuf[y++] = this.strinbuf[(this.neccblk1 * this.datablkw) + i + (j * (this.datablkw + 1))];
        for (let i = 0; i < this.eccblkwid; i++)
            for (let j = 0; j < this.neccblk1 + this.neccblk2; j++)
            this.eccbuf[y++] = this.strinbuf[x + i + j * this.eccblkwid];
            this.strinbuf = this.eccbuf;

        x = y = this.width - 1;
        k = v = 1;

        m = (this.datablkw + this.eccblkwid) * (this.neccblk1 + this.neccblk2) + this.neccblk2;
        for (let i = 0; i < m; i++) {
            t = this.strinbuf[i];
            for (let j = 0; j < 8; j++, t <<= 1) {
                if (0x80 & t)
                this.qrframe[x + this.width * y] = 1;
                do {
                    if (v)
                        x--;
                    else {
                        x++;
                        if (k) {
                            if (y != 0)
                                y--;
                            else {
                                x -= 2;
                                k =  (k === 0 ? 1 : 0);
                                if (x == 6) {
                                    x--;
                                    y = 9;
                                }
                            }
                        }
                        else {
                            if (y != this.width - 1)
                                y++;
                            else {
                                x -= 2;
                                k = (k === 0 ? 1: 0);
                                if (x == 6) {
                                    x--;
                                    y -= 8;
                                }
                            }
                        }
                    }
                    v = (v >0 ? 0 : 1);
                } while (this.ismasked(x, y));
            }
        }

        this.strinbuf = this.qrframe.slice(0);
        t = 0;
        y = 30000;
        for (k = 0; k < 8; k++) {
            this.applymask(k);
            x = this.badcheck();
            if (x < y) {
                y = x;
                t = k;
            }
            if (t == 7)
                break;
            this.qrframe = this.strinbuf.slice(0);
        }
        if (t != k)
            this.applymask(t);

        y = fmtword[t + ((this.ecclevel - 1) << 3)];

        for (k = 0; k < 8; k++, y >>= 1)
            if (y & 1) {
                this.qrframe[(this.width - 1 - k) + this.width * 8] = 1;
                if (k < 6)
                    this.qrframe[8 + this.width * k] = 1;
                else
                    this.qrframe[8 + this.width * (k + 1)] = 1;
            }
        for (k = 0; k < 7; k++, y >>= 1)
            if (y & 1) {
                this.qrframe[8 + this.width * (this.width - 7 + k)] = 1;
                if (k)
                    this.qrframe[(6 - k) + this.width * 8] = 1;
                else
                    this.qrframe[7 + this.width * 8] = 1;
            }
        return this.qrframe;
    }
    badcheck ()  {
        let thisbad: number = 0;
        let bw: number = 0;
        let h: number = 0;
        let b: number = 0;
        let b1: number = 0;
        let w: number = 0;
        let f: number = 0;
        for (let y = 0; y < this.width - 1; y++)
            for (let x = 0; x < this.width - 1; x++)
                if ((this.qrframe[x + this.width * y] && this.qrframe[(x + 1) + this.width * y]
                     && this.qrframe[x + this.width * (y + 1)] && this.qrframe[(x + 1) + this.width * (y + 1)]) // all black
                    || !(this.qrframe[x + this.width * y] || this.qrframe[(x + 1) + this.width * y]
                         || this.qrframe[x + this.width * (y + 1)] || this.qrframe[(x + 1) + this.width * (y + 1)])) // all white
                    thisbad += this.N2;
        for (let y = 0; y < this.width; y++) {
            this.rlens[0] = 0;
            for (h = b = w = 0; w < this.width; w++) {
                if ((b1 = this.qrframe[w + this.width * y]) == b)
                    this.rlens[h]++;
                else
                    this.rlens[++h] = 1;
                b = b1;
                bw += b ? 1 : -1;
            }
            thisbad += this.badruns(h);
        }
        if (bw < 0)
            bw = -bw;

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
                if ((b1 = this.qrframe[x + this.width * f]) == b)
                    this.rlens[h]++;
                else
                    this.rlens[++h] = 1;
                b = b1;
            }
            thisbad += this.badruns(h);
        }
        return thisbad;
    }


    
}