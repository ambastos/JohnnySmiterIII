import { Game } from "../core/game.js"
import { Player } from "../entities/player.js"
import { Level } from "../entities/level.js"
import { Map } from "../entities/map.js"
import { MessageBubble } from "../misc/messageBubble.js"
import {EventEmitter} from 'events'

export class Debugger {
    constructor(game) {
         /** @type Game     */
        this.game = game
        this.emitter = new EventEmitter()
        this._playerIsDead
        /**@type Level */
        this.level = null
        /**@type Player */
        this.player  = null
        /**@type Map */
        this.map = null
        this.initialize()
    }
    initialize() {
        //Change some events in the Game class
        
        Object.defineProperties(this.game, {
            level:{
                configurable: true,
                set: (levelValue)=>{                    
                    this.emitter.emit("game-level",levelValue)
                },
                get:()=>{
                    return this.level
                }
            },
            debug:{
                writable: true,
                value: false}
        })        
        this.emitter.on("game-level",(levelValue)=>{
            this.level = levelValue            
            this.player = this.level.player
            this.map = this.player.map            
        })
        window.addEventListener("keydown", (ev)=>{            
            if (ev.key == '1') {                
                this.game.debug = !this.game.debug
            }
        })        
        
        window.addEventListener("keydown", (ev)=>{
            if (!this.game.debug) return
            const key = ev.key.toLowerCase()
            switch (key) {
                case '3':
                    this._makeImortal()
                    break;            
                case '4':
                    this._makeMortal()
                    break;
            }
        }) 
    }
    _makeImortal() {
        this._playerIsDead = this.player.isDead
        this.player.isDead = ()=>{
            return false
        }
        let pos = {x:this.player.bound.x-this.map.targetOffset[0], 
            y:this.player.bound.y - 80 - this.map.targetOffset[1]}
        new MessageBubble("The player is imortal! Press [4] to make mortal again",
            pos.x, pos.y, 3000,true).show()
    }
    _makeMortal() {
        this.player.isDead = this._playerIsDead
        let pos = {x:this.player.bound.x-this.map.targetOffset[0], 
            y:this.player.bound.y - 80 - this.map.targetOffset[1]}
        new MessageBubble("The player is mortal again! Press [3] to make the player imortal.",
            pos.x, pos.y,3000, true).show()
    }
}