import { Light } from "./light";

export class ShadowBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
        this.points = [
            [this.x, this.y], [this.x + width, this.y], [this.x + width, this.y + height], [this.x, this.y + height]
        ];
        this.projectPoints = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.paths = [];
    }
    /**
     * 
     * @param {Light} light 
     */
    calculateShadowAreas(light) {
        this.projectPoints = this.points.map((el, idx) => {
            var dx = el[0] - light.x;
            var dy = el[1] - light.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            return [dx / d * 10000 + el[0] * 0.1 + this.projectPoints[idx][0] * 0.9, dy / d * 10000 + el[1] * 0.1 + this.projectPoints[idx][1] * 0.9];
        })
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawShadows(ctx) {
        ctx.save();
        //ctx.globalCompositeOperation ="luminosity";
        var points = this.points;
        var projectPoints = this.projectPoints;
        var len = points.length;

        this.paths = []
        for (let i = 0; i < len; i++) {            
            var idx1 = i;
            var idx2 = (i + 1) % len;
            var path = new Path2D();
            path.moveTo(projectPoints[idx1][0], projectPoints[idx1][1]);
            path.lineTo(projectPoints[idx2][0], projectPoints[idx2][1]);
            path.lineTo(points[idx2][0], points[idx2][1]);
            path.lineTo(points[idx1][0], points[idx1][1]);
            path.closePath();
            ctx.fill(path);
            ctx.stroke(path);
            this.paths.push(path)
        }
        //test
       
        ctx.restore();
    }
    drawPlatform(ctx, offset, size) {
        if (this.x + this.width < offset[0] || this.y + this.height < offset[1] || this.x > offset[0] + size[0] || this.y > offset[1] + size[1]) return;
        ctx.save();
        //ctx.fillStyle=brick;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.translate(this.x, this.y);
        if (DOSHADOWS) {
            ctx.shadowColor = "#000";
            ctx.shadowBlur = canvas.height * 0.03;
            ctx.shadowOffsetY = 5;
        }
        ctx.fillStyle = bricksp;
        ctx.fillRect(-5, 0, this.width + 10, 10);
        ctx.restore();
    }
    collisionBox(boundCircle, shadows) {
        //return intersection normal and distance
        //get list of line segments
        var segments = [];
        var len = this.points.length;
        for (let i = 0; i < len; i++) {
            var idx1 = i
            var idx2 = (i + 1) % len;
            if (shadows) {
                segments.push([this.projectPoints[idx1][0], this.projectPoints[idx1][1], this.points[idx1][0], this.points[idx1][1]]);
                segments.push([this.points[idx1][0], this.points[idx1][1], this.projectPoints[idx1][0], this.projectPoints[idx1][1]]);
            } else {
                segments.push([this.points[idx1][0], this.points[idx1][1], this.points[idx2][0], this.points[idx2][1]]);
            }
        }

        //test all segments and return results
        var results = [];
        for (let i = 0; i < segments.length; i++) {
            var s = segments[i];
            var result = boundCircle.segmentIntersect(s[0], s[1], s[2], s[3]);
            if (result) results.push(result);
        }
        return results;
    }
}