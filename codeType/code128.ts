/**
 * @author wmf❤洛尘
 * @param code CODE128
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
    let index = bytes[0] == CHAR_TILDE_TYPE.CHAR_TILDE ? 1 : 0;

    const perhapsCodeC = function (bytes: number[], codeset: number): number {
        for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i]
            if ((b < 48 || b > 57) && b != CHAR_TILDE_TYPE.CHAR_TILDE)
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
                    shifter = CHAR_TILDE_TYPE.SET_CODEB;
                    currcs = CODESET.B;
                }
                else if ((chr2 != -1) && !charCompatible(chr2, currcs)) {
                    if (charCompatible(chr2, CODESET.A)) {
                        shifter = CHAR_TILDE_TYPE.SET_CODEA;
                        currcs = CODESET.A;
                    }
                    else {
                        shifter = CHAR_TILDE_TYPE.SET_CODEB;
                        currcs = CODESET.B;
                    }
                }
            }
        }
        else {
            if ((chr2 != -1) && !charCompatible(chr2, currcs)) {
                switch (currcs) {
                    case CODESET.A:
                        shifter = CHAR_TILDE_TYPE.SET_CODEB;
                        currcs = CODESET.B;
                        break;
                    case CODESET.B:
                        shifter = CHAR_TILDE_TYPE.SET_CODEA;
                        currcs = CODESET.A;
                        break;
                }
            }
            else {
                shifter = CHAR_TILDE_TYPE.SET_SHIFT;
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
            codes.push(CHAR_TILDE_TYPE.SET_STARTA);
            break;
        case CODESET.B:
            codes.push(CHAR_TILDE_TYPE.SET_STARTB);
            break;
        default:
            codes.push(CHAR_TILDE_TYPE.SET_STARTC);
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
    codes.push(CHAR_TILDE_TYPE.SET_STOP);
    return codes;
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

export const enum CHAR_TILDE_TYPE {
    CHAR_TILDE = 126,
    CODE_FNC1 = 102,
    SET_STARTA = 103,
    SET_STARTB = 104,
    SET_STARTC = 105,
    SET_SHIFT = 98,
    SET_CODEA = 101,
    SET_CODEB = 100,
    SET_STOP = 106
}


export const REPLACE_CODES: StrongCode.PCodeOpt = {
    CHAR_TILDE: CHAR_TILDE_TYPE.CODE_FNC1 //GS1-128
}
export const enum CODESET {
    ANY= 1,
    AB = 2,
    A = 3,
    B = 4,
    C = 5
};