const SPIDERBOD = new Path2D("M-.053-6.943c-1.832-.094-4.984 4.357-4.905 6.507.08 2.15 2.168 2.613 3.482 3.219-.837 2.38.343 2.767-.122 4.709C.087 5.706.636 5.686 1.829 7.432c-.15-2.098 1.005-3.082-.364-4.72 0 0 4.125-.07 4.06-3.266C5.46-3.751 1.78-6.85-.053-6.944z");
const SPIDERLEG = new Path2D("m-0.84,-0.10c0,0 47.81,14.12 12.68,37.08C32.34,16.02 -0.19,6.72 -0.19,6.7 Z");

export class Spider {
    constructor(x, y, height) {
        this.offset = Math.random() * 5000;
        this.x = x;
        this.y = y;
        this.height = height;
        this.lastpos = [0, 0];
    }
    /**
     * 
     * @param {number} time 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawlegs(time, ctx) {
        ctx.save();
        ctx.scale(0.2, 0.2);
        ctx.translate(20, 0);
        ctx.rotate(.25 * Math.sin(time + 2));
        ctx.fill(SPIDERLEG);
        ctx.translate(0, -7);
        ctx.rotate(-0.5 + 0.15 * Math.sin(time));
        ctx.fill(SPIDERLEG);
        ctx.translate(0, -7);
        ctx.rotate(-0.5 + 0.25 * Math.sin(time));
        ctx.fill(SPIDERLEG);
        ctx.restore();
        ctx.translate(0, 6);
        ctx.scale(0.15, 0.08);
        ctx.rotate(0.2 + 0.25 * Math.sin(time * 1.5));
        ctx.fill(SPIDERLEG);
    }
    draw(ctx) {
        ctx.save();
        var d = 5000 * this.height / 300
        var time = ((TIME + this.offset) % d - d * .5) / (d * .5);
        if (time < 1) time = time * time;
        time = Math.min(1, Math.max(0, time + Math.sin(TIME * 0.0005 + this.offset) * 0.2));

        ctx.fillRect(this.x, this.y, 3, this.height * time);
        ctx.translate(this.x + 1.5, this.y + this.height * time);
        this.lastpos = [this.x + 1.5, this.y + this.height * time];
        ctx.scale(3.5, 3.5);

        //ctx.save();
        var time = TIME * 0.01;
        ctx.fill(SPIDERBOD);
        ctx.save();
        this.drawlegs(time, ctx);
        ctx.restore();
        ctx.scale(-1, 1);
        this.drawlegs(time, ctx);
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