'use strict'
import utility from './utility';

export default class Cpu {
  constructor() {
    this.fontSet = new Uint8Array([
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ]);
    
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

    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
    this.carry = 0xf
    this.nnn = this.opcode & 0x0fff;
    this.nn = this.opcode & 0x00ff;
    this.n = this.opcode & 0x000f;
    this.vx = (this.opcode & 0x0f00) >> 8;
    this.vy = (this.opcode & 0x00f0) >> 4;
    switch(this.opcode & 0xf000) {
      case 0x000:
        switch(this.opcode) {
          case 0x00e0:
            for (let i = 0; i < this.display.length; i++) {
              this.display[i] = false;
            }
            break;
          case 0x00ee:
            this.sp = this.sp - 1;
            this.pc = this.stack[this.sp];
        }
        break;
      case 0x1000:
        this.pc = this.nnn;
        break;
      case 0x2000:
        this.stack[this.sp] = this.pc;
        this.sp = this.sp + 1;
        this.pc = this.nnn;
        break;
      case 0x3000:
        if (this.vReg[this.vx] === this.nn) {
          this.pc = this.pc + 2;
        }
        break;
      case 0x4000:
        if (this.vReg[this.vx] !== this.nn) {
          this.pc = this.pc + 2;
        }
        break;
      case 0x5000:
        if (this.vReg[this.vx] === this.vReg[this.vy]) {
          this.pc = this.pc + 2;          
        }
        break;
      case 0x6000:
        this.vReg[this.vx] = this.nn;
        break;
      case 0x7000:
        this.vReg[this.vx] = this.vx + this.nn;
        break;
      case 0x8000:
        switch(this.opcode & 0x000f) {
          case 0x0000:
            this.vReg[this.vx] = this.vReg[this.vy];
            break;
          case 0x0001:
            this.vReg[this.vx] = this.vReg[this.vx] | this.vReg[this.vy];
            break;
          case 0x0002:
            this.vReg[this.vx] = this.vReg[this.vx] & this.vReg[this.vy];
            break;
          case 0x0003:
            this.vReg[this.vx] = this.vReg[this.vx] ^ this.vReg[this.vy];
            break;
          case 0x0004:
            this.vReg[this.vx] = this.vReg[this.vx] + this.vReg[this.vy];
            if  (this.vReg[this.vx] > 255) {
              this.vReg[this.carry] = 1;
            }
            break;
          case 0x0005:
            this.vReg[this.vx] > this.vReg[this.vy] ?
            this.vReg[this.carry] = 1 :
            this.vReg[this.carry] = 0;
            this.vReg[this.vx] = this.vReg[this.vx] - this.vReg[this.vy];
            break;
          case 0x0006:
            this.vReg[this.carry] = this.vReg[this.vx] & 0x1;
            this.vReg[this.vx] = this.vReg[this.vx] >> 1;
            break;
          case 0x0007:
            this.vReg[this.vx] = this.vReg[this.vy] - this.vReg[this.vx];
            this.vReg[this.carry] = this.vReg[this.vy] - this.vReg[this.vx] < 0 ? 0 : 1;
            break;
          case 0x000E:
            this.vReg[this.carry] = (this.vReg[this.vx] & 0x80) >> 7;
            this.vReg[this.vx] = this.vReg[this.vx] << 1;
            break;
          
        }
        break;
      case 0x9000:
        if (this.vReg[this.vx] !== this.vReg[this.vy]) {
          this.pc = this.pc + 2;
        }
        break;
      case 0xA000:
        this.iReg = this.nnn;
        break;
      case 0xB000:
        this.pc = this.nnn + this.vReg[0x0];
        break;
      case 0xC000:
        this.vReg[this.vx] = utility.rng() & this.nn;
        break;
      case 0xD000:
        this.vReg[this.carry] = this._draw(
          this.vReg[this.vx],
          this.vReg[this.vy],
          this.memory.slice(this.iReg, this.iReg + this.n)
        );
        break;
      case 0xE000:
        switch(this.opcode & 0x00ff) {
          case 0x009e:
            if (this._pressed().indexOf(this.vReg[this.vx]) >= 0) {
              this.pc = this.pc + 2;
            }
            break;
          case 0x00a1:
            if (this._pressed().indexOf(this.vReg[this.vx]) < 0) {
              this.pc = this.pc + 2;
            }
            break;
        }
        break;
      case 0xf000:
        switch (this.opcode & 0x00ff) {
          case 0x0007:
            this.vReg[this.vx] = this.delayTimer;
            break;
          case 0x000a:
            this.waitingForInput = this.vx;
            break;
          case 0x0015:
            this.delayTimer = this.vReg[this.vx];
            break;
          case 0x0018:
            this.soundTimer = this.vReg[this.vx];
            break;
          case 0x001e:
            this.iReg = this.uint12(this.address + this.vReg[this.vx]);
            break;
          case 0x0029:
            this.address = this.vReg[this.vx] * 5;
            break;
          case 0x0033:
            const start = this.vReg[this.vx];
            this.memory[this.iReg] = parseInt(start / 100);
            start = start % 100;
            this.memory[this.iReg + 1] = parseInt(start / 10);
            start = start % 10;
            this.memory[this.iReg + 2] = start;
            break;
          case 0x0055:
            for (let i = 0; i <= this.vx; i++) {
              this.memory[this.iReg + i] = this.vReg[i];
            } 
            break;
          case 0x0065:
            for (let i = 0; i <= this.vx; i++) {
              this.vReg[i] = this.memory[this.iReg + 1];
            }
            break;
        }
        break;
    }
    this.pc = this.uint12(this.pc);
  }
  _draw = (x, y, sprite) => {
    const unset = false;
    for (let i = 0; i < sprite.length; i++) {
      let val = sprite[i];
      unset |= this._setPixel(this.uint8(x + 0), this.uint8(y + i), (val & 0x80) > 0);
      unset |= this._setPixel(this.uint8(x + 1), this.uint8(y + i), (val & 0x40) > 0);
      unset |= this._setPixel(this.uint8(x + 2), this.uint8(y + i), (val & 0x20) > 0);
      unset |= this._setPixel(this.uint8(x + 3), this.uint8(y + i), (val & 0x10) > 0);
      unset |= this._setPixel(this.uint8(x + 4), this.uint8(y + i), (val & 0x08) > 0);
      unset |= this._setPixel(this.uint8(x + 5), this.uint8(y + i), (val & 0x04) > 0);
      unset |= this._setPixel(this.uint8(x + 6), this.uint8(y + i), (val & 0x02) > 0);
      unset |= this._setPixel(this.uint8(x + 7), this.uint8(y + i), (val & 0x01) > 0);  
    }
    return unset ? 1 : 0;
  }
  _setPixel = (x, y, state) {
    if (x >= 64 || x < 0 || y >= 32 || y < 0) {
      return;
    }
    let index = y * 64 + x;
    let original = this.display[index];
    this.display[index] = original ^ state ? true : false;

    return original && !this.display[index];
  }
  _pressed = () => {
    let pressed = [];
    for (let i = 0; i < this.input.lenth; i++) {
      if (this.input[i]) {
        pressed.push(i);
      }
    }
    return pressed;
  }
  uint8 = (val) => {
    return val % 256;
  }
  uint12 = (val) => {
    return val % 4096;
  }
  load = (program) => {
    for (let i = 0; i < program.length; i++) {
      this.memory[this.programStart + i] = program[i];
    }
  }
  loadFont = () => {
    for (let i = 0; i < this.fontSet.length; i++) {
      this.memory[i] = this.fontSet[i];
    }
  }
  reset = () => {
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
    this.loadFont()
  }

}
//gitlab greysonp chip8-js