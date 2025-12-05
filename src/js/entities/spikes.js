import { ShadowBox } from "./shadowBox";

export class Spikes extends ShadowBox {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {[x:number,y:number]} offset 
     * @param {[x:number, y:number]} size 
     * @returns 
     */
    draw(ctx, offset, size) {
        if (this.x + this.width < offset[0] || this.y + this.height < offset[1] || this.x > offset[0] + size[0] || this.y > offset[1] + size[1]) return;
        var cnt = Math.floor(this.width / 5);
        var width = this.width / cnt;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.translate(this.x, this.y + this.height);
        ctx.moveTo(0, 0);
        for (let i = 1; i < cnt; i++) {
            ctx.lineTo(i * width + Math.random() * 10, -(i % 2) * this.height * width * Math.random() * 0.2);
        }
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}