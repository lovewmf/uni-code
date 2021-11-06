interface CanvasContext {
    /**
     * 填充色
     */
    fillStyle: string;
    /**
     * 边框颜色
     */
    strokeStyle: string;
    /**
     * 阴影的模糊级别
     */
    shadowBlur: number;
    /**
     * 阴影的颜色
     */
    shadowColor: string;
    /**
     * 阴影相对于形状在水平方向的偏移
     */
    shadowOffsetX: number;
    /**
     * 阴影相对于形状在竖直方向的偏移
     */
    shadowOffsetY: number;
    /**
     * 线条的宽度
     */
    lineWidth: number;
    /**
     * 线条的端点样式
     * - butt:
     * - round:
     * - square:
     */
    lineCap: 'butt' | 'round' | 'square';
    /**
     * 线条的结束交点样式
     * - bevel:
     * - round:
     * - miter:
     */
    lineJoin: 'bevel' | 'round' | 'miter';
    /**
     * 最大斜接长度
     */
    miterLimit: number;
    /**
     * 透明度
     */
    globalAlpha: number;
    /**
     * 设置要在绘制新形状时应用的合成操作的类型
     */
    globalCompositeOperation: string;
    /**
     * 偏移量
     */
    lineDashOffset: number;
    /**
     * 字体样式
     */
    font: string;
    /**
     * 设置填充色
     */
    setFillStyle(color: string | CanvasGradient): void;
    /**
     * 设置边框颜色
     */
    setStrokeStyle(color: string): void;
    /**
     * 设置阴影样式
     */
    setShadow(offsetX?: number, offsetY?: number, blur?: number, color?: string): void;
    /**
     * 创建一个线性的渐变颜色
     */
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    /**
     * 创建一个圆形的渐变颜色
     */
    createCircularGradient(x: number, y: number, r: number): CanvasGradient;
    /**
     * 创建一个颜色的渐变点
     */
    addColorStop(stop: number, color: string): void;
    /**
     * 设置线条的宽度
     */
    setLineWidth(lineWidth: number): void;
    /**
     * 设置线条的端点样式
     */
    setLineCap(lineCap: 'butt' | 'round' | 'square'): void;
    /**
     * 设置线条的交点样式
     */
    setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void;
    /**
     * 设置线条的宽度
     */
    setLineDash(pattern: any [], offset: number): void;
    /**
     * 设置最大斜接长度
     */
    setMiterLimit(miterLimit: number): void;
    /**
     * 创建一个矩形
     */
    rect(x: number, y: number, width: number, height: number): void;
    /**
     * 填充一个矩形
     */
    fillRect(x: number, y: number, width: number, height: number): void;
    /**
     * 画一个矩形(非填充)
     */
    strokeRect(x: number, y: number, width: number, height: number): void;
    /**
     * 清除画布上在该矩形区域内的内容
     */
    clearRect(x: number, y: number, width: number, height: number): void;
    /**
     * 对当前路径中的内容进行填充
     */
    fill(): void;
    /**
     * 画出当前路径的边框
     */
    stroke(): void;
    /**
     * 开始创建一个路径
     */
    beginPath(): void;
    /**
     * 关闭一个路径
     */
    closePath(): void;
    /**
     * 把路径移动到画布中的指定点，不创建线条
     */
    moveTo(x: number, y: number): void;
    /**
     * 增加一个新点，然后创建一条从上次指定点到目标点的线
     */
    lineTo(x: number, y: number): void;
    /**
     * 画一条弧线
     */
    arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise?: boolean): void;
    /**
     * 创建三次方贝塞尔曲线路径
     */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /**
     * 创建二次贝塞尔曲线路径
     */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /**
     * 横纵坐标缩放
     */
    scale(scaleWidth: number, scaleHeight: number): void;
    /**
     * 顺时针旋转当前坐标轴
     */
    rotate(rotate: number): void;
    /**
     * 对当前坐标系的原点(0, 0)进行变换
     */
    translate(x: number, y: number): void;
    /**
     * 从原始画布中剪切任意形状和尺寸
     */
    clip(): void;
    /**
     * 设置字体的字号
     */
    setFontSize(fontSize: number): void;
    /**
     * 在画布上绘制被填充的文本
     */
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    /**
     * 设置文字的对齐
     */
    setTextAlign(align: 'left' | 'center' | 'right'): void;
    /**
     * 设置文字的水平对齐
     */
    setTextBaseline(textBaseline: 'top' | 'bottom' | 'middle' | 'normal'): void;
    /**
     * 绘制图像到画布
     */
    drawImage(imageResource: string, dx?: number, dy?: number, dWidth?: number, dHeigt?: number, sx?: number, sy?: number, sWidth?: number, sHeight?: number): void;
    /**
     * 设置全局画笔透明度
     */
    setGlobalAlpha(alpha: number): void;
    /**
     * 保存当前的绘图上下文
     */
    save(): void;
    /**
     * 恢复之前保存的绘图上下文
     */
    restore(): void;
    /**
     * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
     */
    draw(reserve?: boolean, callback?: (result: any) => void): void;
    /**
     * 测量文本尺寸信息，目前仅返回文本宽度
     */
    measureText(text: string): CanvasTextMetrics;
    /**
     * 根据控制点和半径绘制圆弧路径
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /**
     * 给定的 (x, y) 位置绘制文本描边的方法
     */
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    /**
     * 对指定的图像创建模式的方法，可在指定的方向上重复元图像
     */
    createPattern(image: string, repetition: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'): void;
    /**
     * 使用矩阵重新设置（覆盖）当前变换的方法
     */
    setTransform(scaleX: number, skewX: number, skewY: number, scaleY: number, translateX: number, translateY: number): void;
}