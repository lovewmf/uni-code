/**
* @author wmf❤洛尘
* @version 1.0.0
* @Date 2021-11-08
* @LastEditTime 2021-11-08
* @description UniApp 二维码 条形码
* */
import { OperationCode } from './lib/barcode'
import { WidgetCode } from './lib/qrcode'
import { SaveCodeImg, getPixelRatio, UNIT_CONVERSION } from './common/support'

// 条形码
export const BarCode = OperationCode;

// 二维码
export const QRCode = WidgetCode;

// 获取条形码或者二维码图片
export const GetCodeImg = SaveCodeImg;

// 获取设备信息
export const GetPixelRatio = getPixelRatio;

// rpx=>px
export const GetPx = UNIT_CONVERSION;