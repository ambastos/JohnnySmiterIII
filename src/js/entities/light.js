export class Light {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }
    tick(dt) {
        // this.x+=(this.targetX-this.x)*dt*0.05;
        this.x += (this.targetX - this.x) * dt * 0.1;
        this.y += (this.targetY - this.y) * dt * 0.05;
    }
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    draw(ctx) {
        ctx.save();
        var time = T;
        var dx = Math.sin(time * 0.01) * 10;
        var dy = Math.sin(time * 0.015) * 10;
        ctx.translate(this.x + dx, this.y + dy);
        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);

        // Add three color stops
        gradient.addColorStop(0.4, '#fff');
        gradient.addColorStop(.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    drawGlow(ctx) {
        ctx.save();
        var time = T;
        var dx = Math.sin(time * 0.01) * 50;
        ctx.globalCompositeOperation = "hard-light";
        var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 800 + dx);

        // Add three color stops
        gradient.addColorStop(0, '#eef');
        gradient.addColorStop(.5, '#222');
        ctx.fillStyle = gradient;
        ctx.fillRect(-10000, -10000, 20000, 20000);
        ctx.restore();
    }
}
