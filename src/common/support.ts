/**
* @author wmf❤洛尘
* @Date 2021-10-28
* @LastEditTime 2021-11-05
* @description uni-app 二维码 条形码
* */

export const CHAR_TILDE: number = 126;
export const CODE_FNC1: number = 102;
export const SET_STARTA: number = 103;
export const SET_STARTB: number = 104;
export const SET_STARTC: number = 105;
export const SET_SHIFT: number = 98;
export const SET_CODEA: number = 101;
export const SET_CODEB: number = 100;
export const SET_STOP: number = 106;


interface  PCodeOpt {
    CHAR_TILDE: number
}
export const REPLACE_CODES:PCodeOpt = {
    CHAR_TILDE: CODE_FNC1 //GS1-128
}
interface  Provider {
    ANY: number,
    AB: number,
    A: number,
    B: number,
    C: number
}
export const CODESET:Provider = {
    ANY: 1,
    AB: 2,
    A: 3,
    B: 4,
    C: 5
};
export const adelta:number[] = [
    0, 11, 15, 19, 23, 27, 31,16,
    18, 20, 22, 24,26, 28, 20, 22,
    24, 24, 26, 28, 28, 22, 24,24,
    26, 26, 28, 28, 24, 24, 26, 26, 
    26, 28, 28, 24, 26, 26, 26, 28, 28
];
export const vpat:number[] = [
    0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d,
    0x928, 0xb78, 0x45d, 0xa17, 0x532, 0x9a6, 0x683, 0x8c9,
    0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75,
    0x250, 0x9d5, 0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64,
    0x541, 0xc69
];
export const fmtword:number[] = [//纠错等级
    0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,    //L
    0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,    //M
    0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,    //Q
    0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b    //H
];
export const eccblocks:number[] = [
    1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17, 1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28,1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22, 1, 0, 80, 
    20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16, 1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22, 2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28, 2, 0, 78, 20, 4, 
    0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26, 2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26, 2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24, 2, 2, 68, 18, 4, 1, 43, 
    26, 6, 2, 19, 24, 6, 2, 15, 28, 4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24, 2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28, 4, 0, 107, 26, 8, 1, 37, 22, 8, 
    4, 20, 24, 12, 4, 11, 22, 3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24, 5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24, 5, 1, 98, 24, 7, 3, 45, 28, 15, 2,
    19, 24, 3, 13, 15, 30, 1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28, 5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28, 3, 4, 113, 28, 3, 11, 44, 26, 17, 4,
    21, 26, 9, 16, 13, 26, 3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28, 4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30, 2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 
    24, 30, 34, 0, 13, 24, 4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30, 6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30, 8, 4, 106, 26, 8, 13, 47, 28, 7, 22,
    24, 30, 22, 13, 15, 30, 10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30, 8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30, 3, 10, 117, 30, 3, 23, 45, 28, 4, 31,
    24, 30, 11, 31, 15, 30, 7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30, 5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30, 13, 3, 115, 30, 2, 29, 46, 28, 42, 
    1, 24, 30, 23, 28, 15, 30, 17, 0, 115, 30, 10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30, 17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30, 13, 6, 115, 30, 14, 23, 46, 
    28, 44, 7, 24, 30, 59, 1, 16, 30, 12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30, 6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30, 17, 4, 122, 30, 29, 14,
    46, 28, 49, 10, 24, 30, 24, 46, 15, 30, 4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30, 20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30, 19, 6, 118, 30, 
    18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30
];

export const glog:number[] = [
    0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
    0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
    0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
    0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
    0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
    0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
    0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
    0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
    0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
    0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
    0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
    0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
    0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
    0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
    0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
    0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
];
// 指数表
export const gexp:number[] = [
    0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
    0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
    0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
    0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
    0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
    0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
    0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
    0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
    0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
    0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
    0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
    0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
    0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
    0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
    0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
    0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
];
export const PATTERNS:Array<Array<number>> = [
    [2, 1, 2, 2, 2, 2, 0, 0],  // 0
    [2, 2, 2, 1, 2, 2, 0, 0],  // 1
    [2, 2, 2, 2, 2, 1, 0, 0],  // 2
    [1, 2, 1, 2, 2, 3, 0, 0],  // 3
    [1, 2, 1, 3, 2, 2, 0, 0],  // 4
    [1, 3, 1, 2, 2, 2, 0, 0],  // 5
    [1, 2, 2, 2, 1, 3, 0, 0],  // 6
    [1, 2, 2, 3, 1, 2, 0, 0],  // 7
    [1, 3, 2, 2, 1, 2, 0, 0],  // 8
    [2, 2, 1, 2, 1, 3, 0, 0],  // 9
    [2, 2, 1, 3, 1, 2, 0, 0],  // 10
    [2, 3, 1, 2, 1, 2, 0, 0],  // 11
    [1, 1, 2, 2, 3, 2, 0, 0],  // 12
    [1, 2, 2, 1, 3, 2, 0, 0],  // 13
    [1, 2, 2, 2, 3, 1, 0, 0],  // 14
    [1, 1, 3, 2, 2, 2, 0, 0],  // 15
    [1, 2, 3, 1, 2, 2, 0, 0],  // 16
    [1, 2, 3, 2, 2, 1, 0, 0],  // 17
    [2, 2, 3, 2, 1, 1, 0, 0],  // 18
    [2, 2, 1, 1, 3, 2, 0, 0],  // 19
    [2, 2, 1, 2, 3, 1, 0, 0],  // 20
    [2, 1, 3, 2, 1, 2, 0, 0],  // 21
    [2, 2, 3, 1, 1, 2, 0, 0],  // 22
    [3, 1, 2, 1, 3, 1, 0, 0],  // 23
    [3, 1, 1, 2, 2, 2, 0, 0],  // 24
    [3, 2, 1, 1, 2, 2, 0, 0],  // 25
    [3, 2, 1, 2, 2, 1, 0, 0],  // 26
    [3, 1, 2, 2, 1, 2, 0, 0],  // 27
    [3, 2, 2, 1, 1, 2, 0, 0],  // 28
    [3, 2, 2, 2, 1, 1, 0, 0],  // 29
    [2, 1, 2, 1, 2, 3, 0, 0],  // 30
    [2, 1, 2, 3, 2, 1, 0, 0],  // 31
    [2, 3, 2, 1, 2, 1, 0, 0],  // 32
    [1, 1, 1, 3, 2, 3, 0, 0],  // 33
    [1, 3, 1, 1, 2, 3, 0, 0],  // 34
    [1, 3, 1, 3, 2, 1, 0, 0],  // 35
    [1, 1, 2, 3, 1, 3, 0, 0],  // 36
    [1, 3, 2, 1, 1, 3, 0, 0],  // 37
    [1, 3, 2, 3, 1, 1, 0, 0],  // 38
    [2, 1, 1, 3, 1, 3, 0, 0],  // 39
    [2, 3, 1, 1, 1, 3, 0, 0],  // 40
    [2, 3, 1, 3, 1, 1, 0, 0],  // 41
    [1, 1, 2, 1, 3, 3, 0, 0],  // 42
    [1, 1, 2, 3, 3, 1, 0, 0],  // 43
    [1, 3, 2, 1, 3, 1, 0, 0],  // 44
    [1, 1, 3, 1, 2, 3, 0, 0],  // 45
    [1, 1, 3, 3, 2, 1, 0, 0],  // 46
    [1, 3, 3, 1, 2, 1, 0, 0],  // 47
    [3, 1, 3, 1, 2, 1, 0, 0],  // 48
    [2, 1, 1, 3, 3, 1, 0, 0],  // 49
    [2, 3, 1, 1, 3, 1, 0, 0],  // 50
    [2, 1, 3, 1, 1, 3, 0, 0],  // 51
    [2, 1, 3, 3, 1, 1, 0, 0],  // 52
    [2, 1, 3, 1, 3, 1, 0, 0],  // 53
    [3, 1, 1, 1, 2, 3, 0, 0],  // 54
    [3, 1, 1, 3, 2, 1, 0, 0],  // 55
    [3, 3, 1, 1, 2, 1, 0, 0],  // 56
    [3, 1, 2, 1, 1, 3, 0, 0],  // 57
    [3, 1, 2, 3, 1, 1, 0, 0],  // 58
    [3, 3, 2, 1, 1, 1, 0, 0],  // 59
    [3, 1, 4, 1, 1, 1, 0, 0],  // 60
    [2, 2, 1, 4, 1, 1, 0, 0],  // 61
    [4, 3, 1, 1, 1, 1, 0, 0],  // 62
    [1, 1, 1, 2, 2, 4, 0, 0],  // 63
    [1, 1, 1, 4, 2, 2, 0, 0],  // 64
    [1, 2, 1, 1, 2, 4, 0, 0],  // 65
    [1, 2, 1, 4, 2, 1, 0, 0],  // 66
    [1, 4, 1, 1, 2, 2, 0, 0],  // 67
    [1, 4, 1, 2, 2, 1, 0, 0],  // 68
    [1, 1, 2, 2, 1, 4, 0, 0],  // 69
    [1, 1, 2, 4, 1, 2, 0, 0],  // 70
    [1, 2, 2, 1, 1, 4, 0, 0],  // 71
    [1, 2, 2, 4, 1, 1, 0, 0],  // 72
    [1, 4, 2, 1, 1, 2, 0, 0],  // 73
    [1, 4, 2, 2, 1, 1, 0, 0],  // 74
    [2, 4, 1, 2, 1, 1, 0, 0],  // 75
    [2, 2, 1, 1, 1, 4, 0, 0],  // 76
    [4, 1, 3, 1, 1, 1, 0, 0],  // 77
    [2, 4, 1, 1, 1, 2, 0, 0],  // 78
    [1, 3, 4, 1, 1, 1, 0, 0],  // 79
    [1, 1, 1, 2, 4, 2, 0, 0],  // 80
    [1, 2, 1, 1, 4, 2, 0, 0],  // 81
    [1, 2, 1, 2, 4, 1, 0, 0],  // 82
    [1, 1, 4, 2, 1, 2, 0, 0],  // 83
    [1, 2, 4, 1, 1, 2, 0, 0],  // 84
    [1, 2, 4, 2, 1, 1, 0, 0],  // 85
    [4, 1, 1, 2, 1, 2, 0, 0],  // 86
    [4, 2, 1, 1, 1, 2, 0, 0],  // 87
    [4, 2, 1, 2, 1, 1, 0, 0],  // 88
    [2, 1, 2, 1, 4, 1, 0, 0],  // 89
    [2, 1, 4, 1, 2, 1, 0, 0],  // 90
    [4, 1, 2, 1, 2, 1, 0, 0],  // 91
    [1, 1, 1, 1, 4, 3, 0, 0],  // 92
    [1, 1, 1, 3, 4, 1, 0, 0],  // 93
    [1, 3, 1, 1, 4, 1, 0, 0],  // 94
    [1, 1, 4, 1, 1, 3, 0, 0],  // 95
    [1, 1, 4, 3, 1, 1, 0, 0],  // 96
    [4, 1, 1, 1, 1, 3, 0, 0],  // 97
    [4, 1, 1, 3, 1, 1, 0, 0],  // 98
    [1, 1, 3, 1, 4, 1, 0, 0],  // 99
    [1, 1, 4, 1, 3, 1, 0, 0],  // 100
    [3, 1, 1, 1, 4, 1, 0, 0],  // 101
    [4, 1, 1, 1, 3, 1, 0, 0],  // 102
    [2, 1, 1, 4, 1, 2, 0, 0],  // 103
    [2, 1, 1, 2, 1, 4, 0, 0],  // 104
    [2, 1, 1, 2, 3, 2, 0, 0],  // 105
    [2, 3, 3, 1, 1, 1, 2, 0]   // 106
]
/**
 * @author wmf❤洛尘
 * @method UNIT_CONVERSION
 * @description UniApp rpx ——> px 默认750
 * @param num 
 * @returns 转换后的像素
 */
 export const UNIT_CONVERSION = function (num:string | number):number{
	return uni.upx2px(Number(num));
}
/**
 * @author wmf❤洛尘
 * @method UtF16TO8
 * @description 汉字编码
 * @param code 
 * @returns 编码后的字符串
 */
export const UtF16TO8 = function (code:string):string{
    let out:string = '';
    let c:number = 0;
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
export const GetBytes = function (str:string) {
    const bytes:number[] = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
export const CodeSetAllowedFor = function (chr:number) {
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

export const getBestStartSet = function (csa1:number, csa2:number): number {
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

export const codeSetAllowedFor = function (chr: number):number {
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
interface SaveCanvasPars {
    id: string|object,
    type: string,
    width: string|number,
    height: string|number,
    ctx: object
}
/**
 * @author wmf❤洛尘
 * @method SaveCodeImg
 * @param k 
 * @returns 
 */
export const SaveCodeImg = function(k:SaveCanvasPars):object{
    const width:number = UNIT_CONVERSION(Number(k.width));
    const height:number = UNIT_CONVERSION(Number(k.height));
    return new Promise((resolve)=>{
        if (Object.prototype.toString.call(k.id) == '[object String]') {
            uni.canvasToTempFilePath({
                canvasId: k.id as string,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                fileType: k.type || 'png',
                complete: function(res) {
                    resolve(res)
                }
            }, k.ctx)
        } else if (Object.prototype.toString.call(k.id) == '[object Object]') {
            // const ctx = k.id as CanvasToTempFilePathOptions;
            // ctx.toTempFilePath(0, 0, width, height, width, height, k.type || 'png', 1,(res: unknown)=> {
            //     resolve(res)
            // })
        }
    })
}
/**
 * @author wmf❤洛尘
 * @param code 
 * @returns number[]
 * @description 生成条形码所需要的数据
 */
export const StringToCode128 = function (code:string):number[] {
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
        let result:number[] = [];
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
    let codes:number[] = [];

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
