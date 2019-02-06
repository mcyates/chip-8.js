export default class Cpu {
  constructor() {
    this.memory = new Uint8Array(4096);
    this.pc = 0x200;
    this.i = 0;
    this.display = this.setArray(new Array(0x800), false);
    this.input = this.setArray(new Array(16), false)
    this.v = new Uint8Array(0x10);
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.stack = new Array(0x10);
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
    this.nnn = opcode & 0x0fff;
    this.nn = opcode & 0x00ff;
    this.n = opcode & 0x000f;
    this.vx = (opcode & 0x0f00) >> 8;
    this.vy = (opcode & 0x00f0) >> 4;
  }

  setArray = (array, val) => {
    
    for (let i = array.length; i >= 0; --i) {
      array[i] = val;
    }
    return array;
  }
}
