import { ShadowMan } from "./shadowMan.js";

export class Player {
    constructor(x, y, map) {
        this.map = map;
        this.bound = new BoundCircle(x, y, 50);
        this.velocity = [0, 0];
        this.inShadow = false;
        this.man = new ShadowMan();
        this.floorNormal = [0, -1];
        this.onfloor = true;
        this.numbersCollected = 0;
        this.start = T;
    }
    tick(dt, shadowboxes) {
        if (T - this.start > 5000) this.inShadow = this.map.pointInShadow(this.bound.x, this.bound.y);
        if (this.inShadow) {
            this.velocity = [0, 0];
            return;
        }
        this.velocity[0] -= this.velocity[0] * dt * 0.5;
        this.velocity[1] -= this.velocity[1] * dt * 0.5;
        this.velocity[1] += GRAVITY * dt;
        this.bound.x += this.velocity[0] * dt;
        this.bound.y += this.velocity[1] * dt;
        const testCount = 5;
        var floorNormal = [0, 0];
        for (let k = 0; k < testCount; k++) {
            var maxd = 0;
            var result = false;
            var shadows = k < 1;
            for (let i = 0; i < shadowboxes.length; i++) {
                var results = shadowboxes[i].collisionBox(this.bound, shadows);
                for (let j = 0; j < results.length; j++) {
                    if (results[j].depth > maxd) {
                        maxd = results[j].depth;
                        result = results[j];
                    }
                }
            }
            if (result) {
                if (floorNormal[1] > result.normal[1]) {
                    floorNormal = result.normal;
                }
                var r = result;
                this.bound.x += r.normal[0] * r.depth;
                this.bound.y += r.normal[1] * r.depth;
                //kill velocity in direction of impact
                var d = this.velocity[0] * r.normal[0] + this.velocity[1] * r.normal[1];
                //this.velocity[0]-=r.normal[0]*d;
                this.velocity[1] -= r.normal[1] * d;
            }
        }
        if (floorNormal[1] != 0) {
            this.floorNormal = floorNormal;
            this.onfloor = true;
        } else {
            this.onfloor = false;
            this.floorNormal = [0, -1];
        }
    }
    isDead() {
        var spikes = this.map.spikes;
        for (let i = 0; i < spikes.length; i++) {
            var results = spikes[i].collisionBox(this.bound, false);
            if (results.length > 0) return true;
        }
        var spiders = this.map.spiders;
        for (let i = 0; i < spiders.length; i++) {
            var result = spiders[i].checkCollition(this.bound.x, this.bound.y);
            if (result) return true;
        }
        return false;
    }
    draw(ctx) {
        if (this.inShadow) return;
        ctx.save();
        ctx.translate(this.bound.x, this.bound.y - 4);
        ctx.scale(0.85, 0.85);
        this.man.draw(ctx);
        if (this.velocity[0] > 0.5) this.man.setMode("walkRight");
        else if (this.velocity[0] < -0.5) this.man.setMode("walkLeft");
        else this.man.setMode("idle");
        ctx.restore();
    }
}

class BoundCircle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    segmentIntersect(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;

        var d = Math.sqrt(dx * dx + dy * dy);
        dx /= d; dy /= d;

        //calc point distance from line
        var px = this.x - x1;
        var py = this.y - y1;
        var distance = px * dy - py * dx;

        //if not intersecting line the no hit
        if (distance > this.radius || distance < 0) return false;

        //get point of intersection
        var x = this.x - dy * distance;
        var y = this.y + dx * distance;

        var l1 = x1 * dx + y1 * dy;
        var l2 = x2 * dx + y2 * dy;
        var l = x * dx + y * dy;
        if (l > l1 && l < l2) {
            return {
                normal: [dy, -dx],
                depth: this.radius - distance
            };
        }

        // if we get here then check distance from end points
        var dx1 = this.x - x1;
        var dy1 = this.y - y1;
        var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        if (d1 < this.radius) {
            return {
                normal: [dx1 / d1, dy1 / d1],
                depth: this.radius - d1
            };
        }
        return false;
    }
}