import { MessageBubble } from "../misc/messageBubble";

var brick, bricksd, bricksl, bricksp, platform, hud, overlay, endmessage, SCALE = 1, SCALE2 = 1, canvas, ctx
var DOSHADOWS = true;
var TIME = performance.now();
var game 

const GRAVITY = 10;    

//variables
Object.assign(globalThis, {brick, bricksd, bricksl, bricksp, platform, hud, overlay, 
    endmessage, SCALE, SCALE2, canvas, ctx, DOSHADOWS, TIME: TIME, game
})
//constants
Object.assign(globalThis, {GRAVITY,

})
Object.assign(globalThis, {
    MessageBubble
})
