declare namespace StrongCode {

    /**
     * @description 保存图片 兼容Nvue
     */
    interface NvueCanvasConText extends UniApp.CanvasContext {
        toTempFilePath(x: number, y: number, w: number, h: number, dw: number, dh:number, type?: string, quality?: number, callback?: (result: any) => void): void;
    }
    /**
     * @description 二维码边框参数
     * @param color 边框颜色 默认没有边框 如果需要传数组 多个颜色支持渐变
     * @param lineWidth 二维码边框的宽度
     * @param opacity 二维码边框颜色透明度 默认不透明 0～1
     * @param degree 二维码边框的角度
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
     * @param color 二维码绘制的文字颜色 默认黑色 如果需要修改 必须传数组 多种颜色表示可以渐变
     * @param font 二维码绘制的文字 默认normal 20px system-ui
     * @param content 要绘制的文字内容
     */
    interface CodeText {
        opacity?: number,
        font?: string,
        position?: string,
        weight?: string,
        size?: number,
        color?: string[],
        content: string
    }
    /**
     * @description 生成二维码参数
     * @param id String canvasID 或者实列 必传√
     * @param type String 二维码绘制码点类型 可以使用自定义图片绘制 默认为 none 非必传
     * @param size Number 画布canvas大小单位rpx 必传√
     * @param code String/Number 生成二维码的code 必传√
     * @param eyeSrc String 如果 type设置为 custom 则次属性必传 二维码的码眼图片地址 非必传
     * @param src String 二维码背景图片地址 非必传
     * @param padding Number 二维码内边距 默认0 单位rpx 非必穿
     * @param level Number 纠错等级 默认4 非必传
     * @param bgColor  String 画布背景色 默认 #FFFFFF 非必传
     * @param text Object 要绘制的文字参数 不传则没有文字 非必传
     * @param color Array 二维码绘制的颜色  数组 可以传入多个颜色渐变 默认最多10种颜色渐变 不传默认#000000 非比传
     * @param img String 二维码中间log图片配置 不传则没有边框 非必传
     * @param border Object 二维码边框配置 不传则没有边框 非必传
     * @param source String 来源 非必传
     * @param ctx Object  自定义组件时需要 传this 必传√
     */
    interface BarCodePars {
        id: string | UniApp.CanvasContext,
        type?: string,
        source?: string,
        size: string | number,
        code: string,
        src?: string,
        eyeSrc?: string,
        padding?: number,
        level?: number,
        bgColor?: string,
        text?: CodeText,
        color?: string[],
        img?: CodeImg,
        border?: BorderCode,
        ctx: object
    }
    /**
     * @description 保存二维码或者条形码为图片
     * @param id String 保存画布的canvas-id 必传√
     * @param width Number 保存画布的宽度 单位rpx 必传√
     * @param height Number 保存画布的高度 单位rpx 必传√ß
     * @param type String 保存图片的类型 默认 png 非必传
     * @param quality Number 保存图片的质量 默认 1 可选 0～1 非必传
     * @param ctx Object 当前上下文
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
     * @param id String 条形码canvas ID 必传√
     * @param width Number 条形码宽度 单位rpx 必传√
     * @param height Number 条形码高度 单位rpx 必传√
     * @param type String 生成条形码的类型 默认CODE128 可选值 CODE39 EAN ITF MSI Codabar Pharmacode  非必传
     * @param bgColor String 生成条形码的背景色 默认 #FFFFFF 非必传
     * @param color Array 条形码的颜色 默认黑色不见变 传入多个颜色渐变 最多10种颜色 如果颜色一样则不会渐变
     * @param ctx Object 自定义组建需要的上下文 必传√
     * @param source 来源渠道 非必传
     */
    interface OperationCodePars {
        id: string | UniApp.CanvasContext,
        width: number,
        height: number,
        type?: string,
        source?: string,
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
    interface  PCodeOpt {
        CHAR_TILDE: number
    }
}