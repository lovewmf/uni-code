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
        degree: number,
        lineWidth: number,
        opacity: number,
    }
    /**
     * @description 二维码边中间图片参数
     * @param src 图片地址
     * @param size 图片大小
     * @param color 图片边框颜色 默认为 #FFFFFF
     * @param type 图片类型 none circle round 默认none
     * @param width 如果type = circle | round 图片周围的白色边框粗细 默认为5
     */
    interface CodeImg {
       src: string,
       size?: number,
       type?: string,
       color?: string,
       width?: number,
       degree: number,
    }
    /**
     * @description 二维码文字绘制
     * @param placement 文字的位置可选值 top bottom middle 默认 middle
     */
    interface CodeText {
        opacity?: number,
        font?: string,
        placement?: string,
        color?: string[],
        content: string
    }
    /**
     * @description 生成二维码参数
     */
    interface BarCodePars {
        id: string | UniApp.CanvasContext,
        type?: string,
        size: string | number,
        code: string,
        src?: string,
        level?: number,
        bgColor?: string,
        text?: CodeText,
        color?: string[],
        img?: CodeImg,
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
        type?: string,
        code: string,
        bgColor?: string,
        color?: string[],
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