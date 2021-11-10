declare namespace StrongCode {
    
    /**
     * @description 保存图片 兼容Nvue
     */
    interface NvueCanvasConText extends UniApp.CanvasContext {
        toTempFilePath(x: number, y: number, w: number, h: number, dw: number, dh:number, type?: string, quality?: number, callback?: (result: any) => void): void;
    }
    /**
     * @description 二维码边框参数
     */
    interface BorderCode {
        color: string[],
        lineWidth: number
    }
    /**
     * @description 生成二维码参数
     */
    interface BarCodePars {
        id: string | UniApp.CanvasContext,
        size: string | number,
        code: string,
        level?: number,
        bgColor?: string,
        color?: string[],
        img?: string,
        iconSize?: number,
        border?: BorderCode,
        ctx: object
    }
    /**
     * @description 保存二维码或者条形码为图片
     */
    interface SaveCanvasPars {
        id: string | UniApp.CanvasContext,
        type?: string,
        width: string | number,
        height: string | number,
        quality?: number,
        ctx: object
    }
    /**
     * @description 条形码生成参数
     */
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
     * @description 保存图片 兼容Nvue
     */
    interface areaPars {
        width: number,
        height: number,
        top: number,
        left: number
    }
    /**
     * @description 保存图片 兼容Nvue
     */
    interface  BarcOpt {
        currcs: number,
    }
    /**
     * @description 绘制条形码所需参数
     */
    interface  Provider {
        ANY: number,
        AB: number,
        A: number,
        B: number,
        C: number
    }
    /**
     * @description 绘制条形码所需参数
     */
    interface  PCodeOpt {
        CHAR_TILDE: number
    }
}