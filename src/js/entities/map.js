import { MessageBubble } from "../misc/messageBubble.js";
import { collect } from "../misc/song.js";
import { Num } from "./num.js";
import { ShadowBox } from "./shadowBox.js";
import { Spider } from "./spider.js";
import { Spikes } from "./spikes.js";

export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.light = false;
        this.targetOffset = [0, 0];
        this.windows = WINDOWS;
        this.offset = [0, 0];
        this.size = [2000, 2000];
        this.viewport = [ctx.canvas.width / SCALE, ctx.canvas.height / SCALE];
        this.boxes = [];
        for (let i = 0; i < MAP.length; i += 4) {
            this.boxes.push(new ShadowBox(MAP[i] * 20, MAP[i + 1] * 20, MAP[i + 2] * 20, MAP[i + 3] * 20));
        }
        this.spikes = [];
        for (let i = 0; i < SPIKES.length; i += 4) {
            this.spikes.push(new Spikes(SPIKES[i] * 20, SPIKES[i + 1] * 20, SPIKES[i + 2] * 20, SPIKES[i + 3] * 20));
        }
        this.spiders = [];
        for (let i = 0; i < SPIDERS.length; i += 3) {
            this.spiders.push(new Spider(SPIDERS[i] * 20, SPIDERS[i + 1] * 20, SPIDERS[i + 2] * 20));
        }
        this.numbers = [];
        for (let i = 0; i < NUMBERS.length; i += 3) {
            this.numbers.push(new Num(NUMBERS[i + 1] * 20, NUMBERS[i + 2] * 20, NUMBERS[i]));
        }
    }
    checkCollitions(player, light) {
        var px = player.bound.x;
        var py = player.bound.y;
        this.numbers = this.numbers.filter((num) => {
            var dx = num.x - px;
            var dy = num.y - py;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d > player.bound.radius) {
                return true;
            } else {
                collect();
                player.numbersCollected += num.number + 1;
                var nc = player.numbersCollected;
                hud.innerHTML = (nc > 2 ? '2 ' : 'X ') + (nc == 4 || nc == 5 || nc == 1 ? ' 0' : ' X') + (nc == 5 || nc == 2 ? ' 0' : ' X');
                return false;
            }
        });
        if (player.numbersCollected == 5 && !light.told1) {
            light.told1 = true;
            var lp = [light.x - this.targetOffset[0], light.y - this.targetOffset[1] - 50];
            (new MessageBubble("Your (re)quest was successful, now you must find the exit", lp[0], lp[1], 7500, true)).show();
        }
    }
    pointInShadow(x, y) {
        var len = this.boxes.length;
        for (let i = 0; i < len; i++) {
            let box = this.boxes[i];
            for (let j = 0; j < box.paths.length; j++) {
                if (this.ctx.isPointInPath(box.paths[j], x * SCALE, y * SCALE)) {
                    return true;
                }
            }
        }
        return false;
    }
    drawSpiders() {
        ctx.fillStyle = "#000";
        this.spiders.forEach((spider) => {
            spider.draw(this.ctx);
        })
    }
    draw(shadow) {

        ctx.fillStyle = "#faa";
        ctx.strokeStyle = "#440";
        this.spikes.forEach((spike) => {
            spike.draw(this.ctx, this.offset, this.size);
        });
        if (DOSHADOWS) {
            ctx.save();
            ctx.shadowBlur = 30;
            ctx.shadowColor = "#000";
            ctx.fillStyle = brick;
            this.boxes.forEach((box) => {
                box.drawPlatform(this.ctx, this.offset, this.size);
            })
            ctx.restore();
        }

        var len = this.windows.length;
        ctx.save();
        ctx.fillStyle = shadow ? "#030303" : "#333";
        ctx.scale(1.5, 1.2);
        var x = 0, y = 0;
        for (let i = 0; i < len; i += 2) {
            let x1 = this.windows[i] * 20 / 1.5, y1 = this.windows[i + 1] * 20 / 1.2 + 20 / 1.2;
            ctx.translate(x1 - x, y1 - y);
            ctx.fill(WINDOW);
            x = x1; y = y1;
        }
        ctx.fillStyle = shadow ? "#333" : "#030303";
        for (let i = 0; i < len; i += 2) {
            let x1 = this.windows[i] * 20 / 1.5 + 3, y1 = this.windows[i + 1] * 20 / 1.2 + 20 / 1.2 - 3;
            ctx.translate(x1 - x, y1 - y);
            ctx.fill(WINDOW);
            x = x1; y = y1;
        }
        ctx.restore();
        if ((document.monetization && document.monetization.state === 'started') || !shadow) {
            this.numbers.forEach((num) => {
                num.draw(this.ctx);
            })
        }
    }
    drawWithShadows(ctx, light, player) {

        ctx.save();
        ctx.fillStyle = bricksl;
        ctx.fillRect(-10000, -10000, 20000, 20000);
        this.draw();

        light.drawGlow(ctx);
        this.drawSpiders();
        ctx.globalCompositeOperation = "destination-out";
        this.boxes.forEach((box) => {
            box.calcShadowAreas(light);
            box.drawShadows(this.ctx);
        });
        player.draw(ctx);
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(-10000, -10000, 20000, 20000);
        this.draw(true);
        this.drawSpiders();
        ctx.fillStyle = bricksl;
        ctx.fillRect(-10000, -10000, 20000, 20000);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#000";
        ctx.translate(80, 1760);
        ctx.scale(0.85, 0.85);
        ctx.fill(MAGE);
        //ctx.fillRect(0,80,100,100);
        ctx.restore();

        //draw exit
        if (player.numbersCollected == 5) {
            ctx.save();
            ctx.translate(1800, 130);
            ctx.scale(3, 3);
            if (DOSHADOWS) {
                ctx.shadowBlur = 50;
                ctx.shadowColor = "#fff";
            }
            ctx.globalAlpha = Math.sin(T * 0.005) + 1.5;
            ctx.translate(-3, -3);
            ctx.fillStyle = "#fff";
            ctx.fill(WINDOW);
            ctx.restore();
        }

        ctx.fillStyle = brick;
        this.boxes.forEach((box) => {
            box.drawPlatform(this.ctx, this.offset, this.size);
        })
        if (this.light) {
            ctx.save();
            ctx.globalCompositeOperation = "overlay";
            ctx.fillStyle = "#f00";
            ctx.fillRect(-10000, -10000, 20000, 20000);
            ctx.restore();
        }
    }
    setTranslation(ctx, dt) {
        this.offset[0] += (this.targetOffset[0] - this.offset[0]) * dt * 0.1;
        this.offset[1] += (this.targetOffset[1] - this.offset[1]) * dt * 0.1;
        ctx.translate(-this.offset[0], -this.offset[1]);
    }
    setCenter(center) {
        this.viewport = [this.ctx.canvas.width / SCALE, this.ctx.canvas.height / SCALE];
        var x = center.x - this.viewport[0] * 0.5;
        var y = center.y - this.viewport[1] * 0.5;
        //clamp to map
        this.targetOffset[0] = Math.max(0, Math.min(this.size[0] - this.viewport[0], x));
        this.targetOffset[1] = Math.max(0, Math.min(this.size[1] - this.viewport[1], y));
    }
}