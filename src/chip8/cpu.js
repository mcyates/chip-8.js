export default class Cpu {
  constructor() {
    this.fontSet = new Uint8Array([
      0xf0, 0x90, 0x90, 0x90, 0xf0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xf0, 0x10, 0xf0, 0x80, 0xf0, // 2
      0xf0, 0x10, 0xf0, 0x10, 0xf0, // 3
      0x90, 0x90, 0xf0, 0x10, 0x10, // 4
      0xf0, 0x80, 0xf0, 0x10, 0xf0, // 5
      0xf0, 0x80, 0xf0, 0x90, 0xf0, // 6
      0xf0, 0x10, 0x20, 0x40, 0x40, // 7
      0xf0, 0x90, 0xf0, 0x90, 0xf0, // 8
      0xf0, 0x90, 0xf0, 0x10, 0xf0, // 9
      0xf0, 0x90, 0xf0, 0x90, 0x90, // A
      0xe0, 0x90, 0xe0, 0x90, 0xe0, // B
      0xf0, 0x80, 0x80, 0x80, 0xf0, // C
      0xe0, 0x90, 0x90, 0x90, 0xe0, // D
      0xf0, 0x80, 0xf0, 0x80, 0xf0, // E
      0xf0, 0x80, 0xf0, 0x80, 0x80 // F
    ]);

    this.memBuffer = new ArrayBuffer(0x1000);
    this.memory = new Uint8Array(this.memBuffer);
    this.pc = 0x200;
    this.pStart = 0x200;
    this.i = 0x000;
    this.display = this.setArray(new Array(0x800), false);
    this.displayHeight = 32;
    this.displayWidth = 64;
    this.input = this.setArray(new Array(0x10), false);
    this.v = new Uint8Array(0x10);
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.randomNG = this.rng()
    this.stack = new Array(0x10);
    this.sp = 0;
    this.paused = -1;
    this.speed = 10;
  }

  loadRom = rom => {
    this.memory.set(rom, 0x200);
  };
  run = () => {
      if (this.paused >= 0) {
        let pressed = this.pressed();
        if (pressed.length > 0) {
          this.v[this.paused] = pressed[0];
          this.paused = -1;
        }
      }
      this.opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
      this.cycle(this.opcode);
      // console.log((this.opcode).toString(16))
      this.pc += 2;
  };
  getDisplayBuffer = () => {
    return this.display;
  }
  setInputState = (state) => {
    this.input = state;
  }
  updateTimers = () => {
    this.delayTimer = Math.max(0, this.delayTimer - 1);
    this.soundTimer = Math.max(0, this.soundTimer - 1);
  }
  rng = () => {
    return new Uint8Array([Math.floor(Math.random() & 256)])[0]
  }
  cycle = (opcode) => {
    // get the 12 lowest bits of opcode
    this.nnn = opcode & 0x0fff;
    //get the 8 lowest bits of opcode
    this.nn = opcode & 0x00ff;
    // get the lowest nibble of opcode
    this.n = opcode & 0x000f;
    // the lower 4 bits of the high byte of the instruction
    this.x = (opcode & 0x0f00) >> 8;
    // upper 4 bits of the low byte of the instruction
    this.y = (opcode & 0x00f0) >> 4;

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
        // JP addr 1nnn sets pc to nnn
        this.pc = this.nnn;
        break;
      case 0x2000:
        // CALL addr 2nnn increment sp then puts current pc on top of stack pc set to nnn
        this.stack[this.sp] = this.pc;
        this.sp++;
        this.pc = this.nnn;
        break;
      case 0x3000:
        // SE Vx, byte 3xkk skip next instruction if V[x] = nn
        if (this.v[this.x] === this.nn) {
          this.pc += 2;
        } 
        break;
      case 0x4000:
        // SNE Vx, byte 4xkk compare v[x] to nn advance pc if not equal
        if (this.v[this.x] !== this.nn) {
          this.pc += 2;
        }
        break;
      case 0x5000:
      // SE V[x], V[y] 5xy0 compare v[x] to v[y] advance pc if equal
        if (this.v[this.x] === this.v[this.y]) {
          this.pc += 2;
        }
        break;
      case 0x6000:
        // LD v[x], byte 6xnn put nn into register v[x]
        this.v[this.x] = this.nn;
        break;
      case 0x7000:
        // ADD v[x], Byte add nn + v[x] to v[x]
        this.v[this.x] += this.nn;
        break;
      case 0x8000:
        switch (opcode & 0x000f) {
          case 0x0000:
            // LD v[x], v[y] 8xy0 store v[y] in v[x]
            this.v[this.x] = this.v[this.y]; 
            break;
          case 0x0001:
            // OR v[x], v[y] 8xy1 stores v[x] | v[y] in v[x];
            this.v[this.x] = (this.v[this.x] | this.v[this.y]);
            break;
          case 0x0002:
            // AND v[x], v[y] 8xy2 stores v[x] & v[y] in v[x];
            this.v[this.x] = this.v[this.x] & this.v[this.y];
            break;
          case 0x0003:
            // XOR v[x], v[y] 8xy3 stores v[x] ^ v[y] in v[x];
            this.v[this.x] = this.v[this.x] ^ this.v[this.y];
            break;
          case 0x0004:
            // ADD v[x], v[y] 8xy4 v[x] + v[y] if result > 255 v[f] = 1 else 0
            // lowest 8-bits are then stored in v[x];
            this.v[0xf] = this.v[this.x] + this.v[this.y] > 255 ? 1 : 0;
            this.v[this.x] += this.v[this.y];
            break;
          case 0x0005:
            // SUB v[x], v[y] 8xy5 v[x] = v[x] - v[y]
            this.v[0xf] = this.v[this.x] - this.v[this.y] < 0 ? 0 : 1;
            this.v[this.x] -= this.v[this.x] >> 1;
            break;
          case 0x0006:
            // SHR v[x], v[y] 8xy6 divide v[x] \ 2
            // if lowest bit of v[x] === 1 then vf = 1
            this.v[0xf] = this.v[this.x] & 0x01;
            this.v[this.x] = this.v[this.x] >> 1;
            break;
          case 0x0007:
            // SUB v[x], v[y] 8xy7 v[x] = v[y] - v[x]
            this.v[0xf] = this.v[this.y] - this.v[this.x] < 0 ? 0 : 1;
            this.v[this.x] = this.v[this.y] - this.v[this.x];
            break;
          case 0x000e:
            //  SHL v[x], v[y] set v[x] = v[x] shl 1
            this.v[0xf] = (this.v[this.x] & 0x80) >> 7;
            this.v[this.x] = this.v[this.x] << 1;
            break;
        }
        break;
      case 0x9000:
        // SNE v[x], v[y] Skip next instruction if v[x] is not equal to v[y];
        if (this.v[this.x] !== this.v[this.y]) {
          this.pc += 4;
        }
        break;
      case 0xa000:
        // LD i, nnn Annn i = nnn
        this.i = this.nnn;
        break;
      case 0xb000:
        // JP V0, nnn Bnnn jump to location v0 + nnn
        this.pc = this.nnn + this.v[0];
        break;
      case 0xc000:
        // RND Vx, byte CXNN set Vx =  random byte & nnn
        this.v[this.x] = this.rng() & this.nnn;
        break;
      case 0xd000:
        // DRW Vx, Vy, n DXYN display n-byte sprite at memory location i at (Vx, Vy),
        // set Vf = collison
        this.v[0xf] = this.draw(
          this.v[this.x],
          this.v[this.y],
          this.memory.slice(this.i, this.i + this.n)
        )
        break;
        case 0xe000:
          switch(this.nn) {
            case 0x009e:
              // SKP Vx ex9e  skip next instruction if key with val of vx is pressed;
              if (this.pressed().indexOf(this.v[this.x]) >= 0) {
                this.pc += 2;
              }
              break;
            case 0x00a1:
              // SKNP Vx exa1 skip next instruction if key with val of Vx is not pressed
              if (!this.pressed().indexOf(this.v[this.x]) < 0) {
                this.pc += 2;
              }
              break;
          }
        break;
        case 0xf000:
          switch (opcode & this.nn) {
            case 0x0007:
              // LD Vx DT set vx = delayTimer
              this.v[this.x] = this.delayTimer;
              break;
            case 0x000a:
              // LD Vx, k Fx0a wait for a keypress then store in Vx
              this.paused = this.x;
              break;
            case 0x0015:
              // LD DT, Vx fx15 set delayTimer = Vx
              this.delayTimer = this.v[this.x];
              break;
            case 0x0018:
              // LD ST, Vx set soundTimer = Vx
              this.soundTimer = this.v[this.x];
              break;
            case 0x0029:
              // LD f, Vx fx29 set i = location of sprite for digit Vx;
              this.i = this.v[this.x] * 5;
              break;
            case 0x0033:
              // LD B, Vx Fx33 store bcd representation of Vx in memory[i];
              let start = this.v[this.x];
              this.memory[this.i] = parseInt(start / 100);
              start = start % 100;
              this.memory[this.i + 1] = parseInt(start / 10);
              start = start % 10;              
              this.memory[this.i + 2] = start;
              break;
            case 0x0055:
              // LD [i], Vx Fx55 store all vReg in memory starting at i
              for (let j = 0; j <= this.x; j++) {
                this.memory[this.i + j] = this.v[j];
              }
              break;
            case 0x0065:
              // LD Vx, [i] Fx65 read all vReg from memory[i]
              for (let j = 0; j <= this.x; j++) {
                this.v[j] = this.memory[this.i + j];
              }
              break;
            case 0x001e:
              // ADD I, Vx fx1e set i = i + Vx
              // this.i += this.v[this.x];
              this.i = this.uint12(this.i + this.v[this.x]);
              break;
          }
        break;
    }
    // this.pc = this.uint12(this.pc);
  };
  loadFont = () => {
    for (let i = 0; i < this.fontSet.length; i++) {
      this.memory[i] = this.fontSet[i];
    }
  };
  pressed = () => {
    let pressed = [];
    for (let i = 0; i < this.input.length; i++) {
      if (this.input[i]) {
        pressed.push(i);
      }
    }
    return pressed;
  }
  reset = () => {
    this.delayTimer = 0;
    this.display = this.setArray(new Array(0x800), false);
    this.input = this.setArray(new Array(16), false);
    this.i = 0;
    this.memory = new Uint8Array(this.memBuffer);
    this.pc = 0x200;
    this.soundTimer = 0;
    this.sp = 0;
    this.stack = new Array(0x10);
    this.v = new Uint8Array(0x10);
    this.paused = 0;
    this.loadFont();
  };

  setArray = (array, val) => {
    for (let i = array.length; i >= 0; --i) {
      array[i] = val;
    }
    return array;
  };
  draw = (x, y, sprite) => {
    let unset = false;
    for (let i = 0; i < sprite.length; i++) {
      let val = sprite[i];
      unset |= this.setPixel(this.uint8(x + 0), this.uint8(y + i), (val & 0x80) > 0);
      unset |= this.setPixel(this.uint8(x + 1), this.uint8(y + i), (val & 0x40) > 0);
      unset |= this.setPixel(this.uint8(x + 2), this.uint8(y + i), (val & 0x20) > 0);
      unset |= this.setPixel(this.uint8(x + 3), this.uint8(y + i), (val & 0x10) > 0);
      unset |= this.setPixel(this.uint8(x + 4), this.uint8(y + i), (val & 0x08) > 0);
      unset |= this.setPixel(this.uint8(x + 5), this.uint8(y + i), (val & 0x04) > 0);
      unset |= this.setPixel(this.uint8(x + 6), this.uint8(y + i), (val & 0x02) > 0);
      unset |= this.setPixel(this.uint8(x + 7), this.uint8(y + i), (val & 0x01) > 0);
    }
    return unset ? 1 : 0;
  }
  setPixel = (x, y, state) => {
    let width = this.displayWidth;
    let height = this.displayHeight;

    // wrap pixel around if it leaves border of screen;
    if (x >= width || x < 0 || y >= height || y < 0) {
      return;
    }

    let index = x + (y * width);
    let original = this.display[index];
    this.display[index] = original ^ state ? true : false;
    return original && !this.display[location];
  };
  uint8 = (val) => {
    return val % 256;
  }
  uint12 = (val) => {
    return val % 4096;
  }
};
