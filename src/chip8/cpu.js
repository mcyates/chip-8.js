export default class Cpu {
  constructor() {
    this.memory = new Uint8Array(4096);
    this.pc = 0x200;
    this.iR = 0;
    this.display = this.setArray(new Array(0x800), false);
    this.input = this.setArray(new Array(16), false)
    this.vR = new Uint8Array(0x10);
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.stack = new Array(0x10);
    this.sp = 0;
    this.paused = 0;
    this.speed = 10;
  }

  loadRom = (rom)  => {
    let length = rom.length;
    for (let i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = rom[i];
    }
  }
  run = () => {
    for (let i = 0; i < this.speed; ++i) {
      if (!this.paused) {
        this.opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        this.cycle(this.opcode);
      }
    }
  }

  cycle = (opcode) => {
    this.carry = 0xf;
    // get the 12 lowest bits of opcode
    this.nnn = opcode & 0x0fff;
    //get the 8 lowest bits of opcode
    this.nn = opcode & 0x00ff;
    // get the lowest nibble of opcode
    this.n = opcode & 0x000f;
    this.vx = (opcode & 0x0f00) >> 8;
    this.vy = (opcode & 0x00f0) >> 4;
    
    switch (opcode & 0xf000) {
      case 0x0000:
        switch (opcode) {
          case 0x00e0:
          // CLS clear the screen;
            for (let i = 0; i < this.display.length; i++) {
              this.display[i] = false;
            }
            break;
          case 0x00ee:
          // RET set pc to address at the top of stack
          this.sp--;
          this.pc = this.stack[this.sp];
          break;
        }
        break;
      case 0x1000:
        this.pc = this.nnn;
    }
  }

  setArray = (array, val) => {
    
    for (let i = array.length; i >= 0; --i) {
      array[i] = val;
    }
    return array;
  }
}
