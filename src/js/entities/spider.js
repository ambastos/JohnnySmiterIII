export class Spider {
    constructor(x, y, height) {
        this.offset = Math.random() * 5000;
        this.x = x;
        this.y = y;
        this.height = height;
        this.lastpos = [0, 0];
    }
    drawlegs(t, ctx) {
        ctx.save();
        ctx.scale(0.2, 0.2);
        ctx.translate(20, 0);
        ctx.rotate(.25 * Math.sin(t + 2));
        ctx.fill(SPIDERLEG);
        ctx.translate(0, -7);
        ctx.rotate(-0.5 + 0.15 * Math.sin(t));
        ctx.fill(SPIDERLEG);
        ctx.translate(0, -7);
        ctx.rotate(-0.5 + 0.25 * Math.sin(t));
        ctx.fill(SPIDERLEG);
        ctx.restore();
        ctx.translate(0, 6);
        ctx.scale(0.15, 0.08);
        ctx.rotate(0.2 + 0.25 * Math.sin(t * 1.5));
        ctx.fill(SPIDERLEG);
    }
    draw(ctx) {
        ctx.save();
        var d = 5000 * this.height / 300
        var t = ((T + this.offset) % d - d * .5) / (d * .5);
        if (t < 1) t = t * t;
        t = Math.min(1, Math.max(0, t + Math.sin(T * 0.0005 + this.offset) * 0.2));

        ctx.fillRect(this.x, this.y, 3, this.height * t);
        ctx.translate(this.x + 1.5, this.y + this.height * t);
        this.lastpos = [this.x + 1.5, this.y + this.height * t];
        ctx.scale(3.5, 3.5);

        //ctx.save();
        var t = T * 0.01;
        ctx.fill(SPIDERBOD);
        ctx.save();
        this.drawlegs(t, ctx);
        ctx.restore();
        ctx.scale(-1, 1);
        this.drawlegs(t, ctx);
        ctx.restore();
    }
    checkCollition(x, y) {
        var dx = x - this.lastpos[0];
        var dy = y - this.lastpos[1];
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 65) return true;
        return false;
    }
}