import { KeyStates } from '../core/keyStates.js';
import { MessageBubble } from '../misc/messageBubble.js';
import { dead, twinkle } from '../misc/song.js';
import { Light } from './light.js';
import {Map} from './map.js' 
import { Particles } from './particles.js';
import { Player } from './player.js';

export class Level {
    constructor(ctx) {
        this.ctx = ctx;

        this.map = new Map(this.ctx);
        this.player = new Player(1800, 1800, this.map);
        this.light = new Light(1600, 1900);
        //this.player = new Player(1400,100,this.map);
        //this.light = new Light(1600,100);

        this.keyStates = new KeyStates;
        this.particles = new Particles;
        this.lastTime = T;
        this.badFrame = 0;
        this.started = false;
        this.numbersCollected = 0;
        document.addEventListener("mousedown", (e) => {
            if (e.buttons === 1 && this.started) {
                twinkle();
                this.light.setTarget(e.clientX * SCALE2 / SCALE + this.map.offset[0], e.clientY * SCALE2 / SCALE + this.map.offset[1]);
            }
        });

        setTimeout(() => {
            var pp = [this.player.bound.x - this.map.targetOffset[0], this.player.bound.y - this.map.targetOffset[1] - 100];
            var lp = [this.light.x - this.map.targetOffset[0], this.light.y - this.map.targetOffset[1] - 50];
            var opening = [
                [lp, "Greetings strange soul, I am Ellysias, a Ferry God. You seem out of place in this realm - may I ask your business?"],
                [pp, "I'm Johnny. I was battling an ancient witch in my home realm of Jar when she cast some kind of spell and I found myself here."],
                [lp, "I may be able to help. It would seem you have fallen foul of the lost page of the Necronomicon - Page 404 - containing the curse of the Shadow Walker."],
                [lp, "To break the curse and be restored to your former self and realm, you must find the three sacred numbers and read them aloud."],
                [lp, "I will help guide you with my fairy light. Just point where you wish me to go and I will light your path [mouse]"],
                [lp, "You can navigate this place with your legs [keyboard A, D]"],
                [pp, "um..I did already know how to walk, but thank your for your kind assistance."]
            ];
            var diag = () => {
                if (opening.length > 0) {
                    var p = opening.shift();
                    (new MessageBubble(p[1], p[0][0], p[0][1], 7500)).show().then(diag);
                } else {
                    this.started = true;
                }
            };
            diag();
        }, 1000);
        this.loop();
    }
    reset() {
        dead();
        this.map.light = true;
        setTimeout(() => {
            overlay.className = "show";
            this.player.bound.x = 10000;
        }, 500);
        setTimeout(() => {
            this.map = new Map(this.ctx);
            this.player = new Player(1800, 1800, this.map);
            this.light = new Light(1600, 1900);
            overlay.className = "show";
        }, 1000);
        setTimeout(() => {
            overlay.className = "";
            this.started = true;
            hud.innerHTML = 'X X X';
        }, 2000)
    }
    loop() {
        T = performance.now();
        var ctx = this.ctx;
        ctx.save();
        ctx.scale(SCALE, SCALE);
        //var stepSpeed=10;
        var stepSpeed = 10 * 2;
        var player = this.player;
        var newangle = Math.atan2(player.floorNormal[0], -player.floorNormal[1]);
        player.man.floorAngle += (newangle - player.man.floorAngle) * 0.3;
        if (this.started) {
            if (this.keyStates.states[39] || this.keyStates.states[68]) {
                player.velocity[0] = -player.floorNormal[1] * stepSpeed;
                player.velocity[1] = player.floorNormal[0] * stepSpeed * 2;
            }
            if (this.keyStates.states[37] || this.keyStates.states[65]) {
                player.velocity[0] = player.floorNormal[1] * stepSpeed;
                player.velocity[1] = -player.floorNormal[0] * stepSpeed * 2;
            }
        }
        var speed = Math.sqrt(player.velocity[0] * player.velocity[0] + player.velocity[1] * player.velocity[1]);
        this.player.man.mag = Math.min(0.85, Math.abs(speed) / 10 * 0.5 + 0.5);

        this.map.checkCollitions(this.player, this.light);
        var time = T;
        if (time - this.lastTime > 15) {
            this.badFrame++;
            if (this.badFrame > 20) DOSHADOWS = false;
        } else {
            this.badFrame = Math.max(this.badFrame - 1, 0);
        }
        var dt = Math.max(0.5, Math.min(1, (time - this.lastTime) / 15));
        this.lastTime = time;
        this.light.tick(0.55 * dt);
        this.particles.tick(0.015 * dt);
        this.player.tick(0.55 * dt, this.map.boxes);

        this.map.setCenter(this.player.bound);
        ctx.save();
        this.map.setTranslation(ctx, 0.55 * dt);



        this.map.drawWithShadows(ctx, this.light, this.player);
        this.light.draw(ctx);

        if (this.player.isDead()) {
            this.reset();
        }

        ctx.restore();
        ctx.save();
        this.map.setTranslation(ctx, 0);

        this.particles.draw(ctx, this.map.offset, this.map.viewport);
        ctx.restore();


        var pos = this.player.bound;
        var dx = pos.x - 50;
        var dy = pos.y - 1850;
        var d = Math.sqrt(dx * dx + dy * dy);

        if (!this.coiled && d < 200) {
            this.coiled = true;
            var p = [200 - this.map.targetOffset[0], 1800 - this.map.targetOffset[1]];
            var s = (document.monetization && document.monetization.state == "started") ?
                "I'm the great mage Coil. I will grant you the ability to see your desire within the shadows" :
                "I'm the great mage <a href=\"https://coil.com/\" target=\"_blank\">Coil</a>, cross my hands with silver and I will let you see your desire within the shadows.";
            (new MessageBubble(s, p[0], p[1], 7500, true)).show();
        }

        var dx = pos.x - 1850;
        var dy = pos.y - 100;
        var d = Math.sqrt(dx * dx + dy * dy);
        var gameover = false;
        if (d < 100 && this.player.numbersCollected == 5) {
            overlay.className = "show";
            endmessage.className = "show";
            gameover = true;
        }

        ctx.restore();
        if (!gameover) requestAnimationFrame(this.loop.bind(this));
    }
}
