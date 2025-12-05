
import { MessageBubble } from "../misc/messageBubble.js";
import { collect } from "../misc/song.js";
import { Light } from "./light.js";
import { Num } from "./num.js";
import { Player } from "./player.js";
import { ShadowBox } from "./shadowBox.js";
import { Spider } from "./spider.js";
import { Spikes } from "./spikes.js";

const MAP = [99, 0, 1, 100, 0, 99, 100, 1, 0, 0, 1.1, 100, 0, 0, 100, 1, 35, 89, 64, 1, 35, 97, 40, 2, 35, 78, 5, 11, 50, 75, 5, 14, 65, 78, 5, 11, 80, 75, 19, 14, 0.6, 83.35, 19, 2, 6.6, 75.35, 4, 8, 18.5, 92, 6.5, 7, 0, 68, 32, 2.1, 30, 50, 2, 19, 39.7, 60.85, 9.25, 1.3, 56.9, 63.5, 5.3, 1.3, 72.75, 63.5, 5.3, 1.3, 1, 40.2, 82, 2.15, 84.65, 63.5, 4, 1.3, 84.65, 54.25, 4, 1.3, 84.65, 45, 4, 1.3, 84.65, 35.7, 4, 1.3, 52, 42, 31, 13, 10.6, 50, 19.4, 2, 35, 10, 64, 2, 55, 25, 5, 15.2, 46.85, 28.45, 8.7, 2, 35, 33.05, 5, 7.15, 20.1, 25, 4.9, 15.2, 6.6, 30.45, 6.6, 9.8, 10, 18, 4.55, 2, 21.15, 13.85, 7, 2, 16.45, 59.55, 14, 2, 0.95, 61.5, 7, 7.3, 60, 28, 18, 5.05, 31.75, 51.6, 5.3, 10.6]
const SPIKES = [40, 87, 10, 2, 55, 87, 10, 2, 70, 87, 10, 2, 40, 38, 5, 2.2, 25, 38, 10, 2.2, 1.05, 81.35, 5.5, 2, 13.25, 38.35, 6.9, 1.85, 1.05, 38.35, 5.55, 1.85];
const SPIDERS = [66, 55, 20.4, 52, 55, 15, 64, 12, 13.15, 41.35, 42.35, 31.75, 92.95, 11.9, 54.25, 37.05, 11.9, 18.5, 29.1, 70.1, 25.15];
const WINDOWS = [91.3, 92.6, 66.15, 92.6, 48.95, 92.6, 17.2, 78.05, 26.45, 78.05, 43.65, 70.1, 58.2, 70.1, 74.1, 70.1, 92.6, 70.1, 92.6, 54.25, 92.6, 37.05, 72.75, 21.15, 56.9, 21.15, 43.65, 21.15, 9.25, 25.15, 47.6, 5.3, 60.85, 5.3, 74.1, 5.3, 13.25, 92.6];
const NUMBERS = [0, 26.45, 55.55, 0, 51.6, 37.05, 2, 62.2, 37.05];

const MAGE = new Path2D("M64.7 64.08L56.93 83.69c-19.27 8.70-22.52 31.14.52 42.55 0 0 2.07 4.18-9.01 10.27-8.58 19.22-7.75 45.28-6.292 75.33l10.77-61.04L50.27 263.26l24.38.37s17.57-8.19-4.34-9.07c-14.17-.56-16.7-6.63-5.67-49.70 9.375 4.82-16.55 43.07-1.18 48.36 0 0 13.46-46.01 18.50-52.07 24.08-28.98-9.663-52.13-9.663-52.13l21.26 16.34 22.68-6.80 15.12-1.7-18.14-1.32-19.75 3.02-21.73-28.45s-8.99-7.79-.09-3.3 26.40-10.39-.8-40.25c-7.56-3.59-6.11-22.47-6.11-22.47z");
const WINDOW = new Path2D("M-0.75,-29.86 C-20.13,-18.72 -16.25,30.61 -16.25,30.61 l33.63,0.37 c0,0 3.50,-45.53 -18.14,-60.85 z");

export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.light = false;
        this.targetOffset = [0, 0];
        this.windows = WINDOWS;
        this.offset = [0, 0];
        this.size = [2000, 2000];
        this.viewport = [ctx.canvas.width / SCALE, ctx.canvas.height / SCALE];
        this.shadowBoxes = [];
        for (let i = 0; i < MAP.length; i += 4) {
            this.shadowBoxes.push(new ShadowBox(MAP[i] * 20, MAP[i + 1] * 20, MAP[i + 2] * 20, MAP[i + 3] * 20));
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
    /**
     * Check if the player collides with the collected number
     * If collides with all collected, show a message to find a exit to the player
     * @param {Player} player 
     * @param {Light} light 
     */
    checkCollisionsWithNumbers(player, light) {
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
        var len = this.shadowBoxes.length;
        for (let i = 0; i < len; i++) {
            let box = this.shadowBoxes[i];
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
            this.shadowBoxes.forEach((box) => {
                box.drawPlatform(this.ctx, this.offset, this.size);
            })
            ctx.restore();
        }

        this.drawMapWindows(shadow);

        if ((document.monetization && document.monetization.state === 'started') || !shadow) {
            this.numbers.forEach((num) => {
                num.draw(this.ctx);
            })
        }
    }
    drawMapWindows(shadow) {
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
    }

    drawWithShadows(ctx, light, player) {

        ctx.save();
        ctx.fillStyle = bricksl;
        ctx.fillRect(-10000, -10000, 20000, 20000);
        this.draw();

        light.drawGlow(ctx);
        this.drawSpiders();
    //draw the reflected shadows that player sometimes can walk over
        this.drawReflectedShadows(ctx, light);

        player.draw(ctx);
        
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(-10000, -10000, 20000, 20000);
        this.draw(true);
        this.drawSpiders();
        ctx.fillStyle = bricksl;
        ctx.fillRect(-10000, -10000, 20000, 20000);
        ctx.restore();

        this.drawCoilMage(ctx);

        //draw exit
        if (player.numbersCollected == 5) {
            ctx.save();
            ctx.translate(1800, 130);
            ctx.scale(3, 3);
            if (DOSHADOWS) {
                ctx.shadowBlur = 50;
                ctx.shadowColor = "#fff";
            }
            ctx.globalAlpha = Math.sin(TIME * 0.005) + 1.5;
            ctx.translate(-3, -3);
            ctx.fillStyle = "#fff";
            ctx.fill(WINDOW);
            ctx.restore();
        }

        ctx.fillStyle = brick;
        this.shadowBoxes.forEach((box) => {
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
    /**
     * Draw the MAGE actor that talks something to the player
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawCoilMage(ctx) {
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.translate(80, 1760);
        ctx.scale(0.85, 0.85);
        ctx.fill(MAGE);
        //ctx.fillRect(0,80,100,100);
        ctx.restore();
    }

    drawReflectedShadows(ctx, light) {
        ctx.globalCompositeOperation = "destination-out";
        this.shadowBoxes.forEach((box) => {
            box.calculateShadowAreas(light);
            box.drawShadows(this.ctx);
        });
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