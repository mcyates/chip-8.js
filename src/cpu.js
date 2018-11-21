'use strict'
import utility from './utility';

export default class Cpu {
  constructor() {
    this.programStart = 0x200;
    this.delayTimer = 0;
    this.display = utility.setArray(new Array(2048), false);
    this.input = utility.setArray(new Array(16), false);
    this.iReg = 0;
    this.memory = new Uint8Array(0x1000);
    this.pc = this.programStart;
    this.soundTimer = 0;
    this.sp = 0;
    this.stack = new Array(16)
    this.vReg = new Uint8Array(16);
    this.waitingForInput = -1;
    
  }
  load = (program) => {
    for (let i = 0; i < program.length; i++) {
      this.memory[this.programStart + i] = program[i];
    }
  }
}
//gitlab greysonp chip8-js