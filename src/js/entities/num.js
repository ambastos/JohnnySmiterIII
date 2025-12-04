export class Num {
    constructor(x, y, number) {
        this.x = x;
        this.y = y;
        this.number = number
    }
    draw(ctx) {
        ctx.save();
        var n = T;
        ctx.translate(this.x, this.y + Math.sin(n / 1000) * 20);
        ctx.fillStyle = "#977207";
        ctx.shadowBlur = canvas.height * 0.03;
        ctx.shadowColor = "#fff";
        ctx.fillText(this.number, 0, 0)
        ctx.restore();
    }
}