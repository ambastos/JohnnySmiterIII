import { Level } from '../entities/level.js';
import { Particles } from '../entities/particles.js';
import { Spider } from '../entities/spider.js';
import { music } from '../misc/song.js';


//draw the bricks(walls of the game)
function createBrickTile (size, color) {

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var brickWidth = 80 * size;
    var morter = 2 * size;
    var brickHeight = 40 * size;
    canvas.height = canvas.width = brickWidth * 5.3;
    ctx.save();
    ctx.fillStyle = "#111";
    //ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = "#222";    
    var y1 = 0;
    for (let y = 0; y < 70; y++) {
        var x1 = -(y % 2) * brickWidth * 0.5;
        for (let x = 0; x < 70; x++) {
            // var x1=x*(brickWidth+morter) - (y%2)*brickWidth*0.5;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "#000";
            ctx.fillRect(x1, y1, brickWidth, brickHeight);
            ctx.shadowBlur = 2;
            ctx.shadowColor = "#555";
            ctx.fillRect(x1 + 3, y1 + 3, brickWidth - 6, brickHeight - 6);
            x1 += (brickWidth * (0.75 + (Math.random() + 0.5) * 0.25) + morter);
        }
        y1 += brickHeight + morter;
    }
    ctx.restore();
    color = Math.floor(color * 255);
    ctx.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
    ctx.globalCompositeOperation = "multiply";
    //ctx.globalAlpha=color;
    ctx.fillRect(0, 0, 500, 500);
    return canvas;
}        
class Game {    
    constructor() {
        /**@type Level */
        this.level = null 
        this.playing = false
        document.addEventListener("mousedown", () => {
        if (!this.playing) {
            this.playing = true; 
            setTimeout(music, 1500);
        }
})
    }
}
//initialize the game
Game.prototype.initialize = function() {
    //draw the INTRO screen
    const _this = this
    setTimeout(() => {
        console.log("initialize")
        hud = document.querySelector("#hud");
        overlay = document.querySelector("#overlay");
        endmessage = document.querySelector("#endMessage");
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        //create brick Tiles
        brick = ctx.createPattern(createBrickTile(0.7, 0.5), 'repeat');
        bricksd = ctx.createPattern(createBrickTile(0.5, 0.4), 'repeat');
        bricksl = ctx.createPattern(createBrickTile(0.5, 0.7), 'repeat');
        bricksp = ctx.createPattern(createBrickTile(1, 0.4), 'repeat');

        _this.resize();

        var particles = new Particles();
        particles.width = innerWidth;
        particles.height = innerHeight;

        var title = true;
        var Spider1 = new Spider(0, 0, 0);
        var Spider2 = new Spider(0, 0, 0);
        var spiderScale = 1.5;
        var size = [particles.width, particles.height];
        var offset = [0, 0];
        
        var animate = () => {
            if (title) {
                TIME = performance.now();
                var inset = 0.1 * canvas.width;
                Spider1.height = canvas.height / SCALE * 0.8 / spiderScale;
                Spider2.height = canvas.height / SCALE * 0.8 / spiderScale;
                Spider2.x = (canvas.width / SCALE - inset) / spiderScale;
                Spider1.x = inset / spiderScale;
                ctx.save();
                ctx.scale(SCALE, SCALE);
                ctx.fillStyle = bricksd;
                ctx.fillRect(0, 0, canvas.width / SCALE, canvas.height / SCALE);
                 ctx.fillStyle = brick;
                
                ctx.fillRect(0, canvas.height / SCALE * 0.9, canvas.width / SCALE, canvas.height / SCALE);
                ctx.fillStyle = bricksp;
                if (DOSHADOWS) {
                    ctx.shadowBlur = canvas.height * 0.03;
                    ctx.shadowColor = "#000";
                }
                ctx.save();
                ctx.translate(0, canvas.height / SCALE * 0.9);
                ctx.fillRect(0, 0, canvas.width / SCALE, canvas.height * 0.03);
                ctx.restore();
                ctx.scale(spiderScale, spiderScale);
                ctx.fillStyle = "#000";
                Spider1.draw(ctx);
                Spider2.draw(ctx);
                ctx.restore();
                //animate the game every 60fps
                particles.tick(0.01);
                particles.draw(ctx, offset, size);
                requestAnimationFrame(animate);
            }
        };
        animate();
    //buttom to start the game
        document.querySelector("b").onclick = () => {
            overlay.className = "show";
            setTimeout(() => {
                overlay.className = "";
                document.querySelector("main").style.display = "none";
                document.querySelector("#hud").style.display = "block";
                title = false;
                this.level = new Level(ctx);
                if (!document.fullscreenElement) {
                    document.body.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }, 1500)
        }
    },100)
}

Game.prototype.resize = () => {
    console.log("resize ")
    SCALE2 = 512 / Math.min(innerWidth, innerHeight);
    canvas.width = Math.max(innerWidth, innerHeight) * SCALE2;
    canvas.height = Math.min(innerWidth, innerHeight) * SCALE2;
    ctx.font = "bold " + (60 * SCALE2) + "px Arial";
}
window.onresize = Game.prototype.resize
export {Game}