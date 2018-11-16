'use strict';
//pc and i register can range from 0x000 - 0xfff
//memory map
/*
+---------------+= 0xFFF (4095) End of Chip-8 RAM
|               |
|               |
|               |
|               |
|               |
| 0x200 to 0xFFF|
|     Chip-8    |
| Program / Data|
|     Space     |
|               |
|               |
|               |
+- - - - - - - -+= 0x600 (1536) Start of ETI 660 Chip-8 programs
|               |
|               |
|               |
+---------------+= 0x200 (512) Start of most Chip-8 programs
| 0x000 to 0x1FF|
| Reserved for  |
|  interpreter  |
+---------------+= 0x000 (0) Start of Chip-8 RAM

*/
const memory = new ArrayBuffer(0x1000);
let chip8 = {
  memory: new Uint8Array(memory), // chip-8 ram total of 4kb
  step: null,
  running: null,
  renderer: null,

  display: new Array(2048),
  index: null,
  keys: {},
  keyState: undefined, //index register 16-bit
  pc: null, // The program Counter 16-bit
  stack:  new Array(16),
  sp: null,
  v: new Array(16), //The V Registers 8-bit
  delayTimer: null,
  soundtimer: null,

  reset: undefined, //resets chip-8 to default state
}

chip8.prototype = {
  bindkey: (key) => {
    chip8.keys[key] = true;
  },
  keyState: (key, pressed) => {

  },
  loadProgram: () => {
    for (let i = 0; i < program.length; i++) {
      chip8.memory[i + 0x200] = program[i];
    }
  },

  unbindKey: (key) => {
    chip8.keys[key] = null;
  }
}
  chip8.reset: () => {
    for (let i = 0; i < chip8.memory.length; i++) {
      chip8.memory[i] = 0;
    }
    chip8.index = 0;
    chip8.pc = 0;
    chip8.stack = new Array(16);
    chip8.sp = 0;
    chip8.v =  new Array(16);
    chip8.delayTimer = 0;
    chip8.soundtimer = 0;
  }






