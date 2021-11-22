/**
* @author wmf❤洛尘
* @version 1.0.0
* @Date 2021-11-08
* @LastEditTime 2021-11-08
* @description UniApp 二维码 条形码
* */
import { OperationCode } from './lib/barcode'
import { WidgetCode } from './lib/qrcode'
 import { SaveCodeImg } from './common/support'

// 条形码
export const BarCode = OperationCode;

// 二维码
export const QRCode = WidgetCode;

export const GetCodeImg = SaveCodeImg;