import './core/global.js'
import {Game} from './core/game.js'
import { Debugger } from './utils/debugger.js'

document.monetization={state:"started"}
game = new Game()
game.initialize()

//for debugging
globalThis.debug = new Debugger(game)
