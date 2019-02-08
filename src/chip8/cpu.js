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
    this.keyMap = {
      49: 0x1,
      50: 0x2,
      51: 0x3,
      52: 0xc,
      81: 0x4,
      87: 0x5,
      69: 0x6,
      82: 0x13,
      65: 0x7,
      83: 0x8,
      68: 0x9,
      70: 0x14,
      90: 0x10,
      88: 0x0,
      67: 0x11,
      86: 0x15
    };
    this.memory = new Uint8Array(0x1000);
    this.pc = 0x200;
    this.iR = 0;
    this.display = this.setArray(new Array(0x800), false);
    this.input = this.setArray(new Array(0x10), false);
    this.v = new Uint8Array(0x10);
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.stack = new Array(0x10);
    this.sp = 0;
    this.paused = 0;
    this.speed = 10;
  }

  loadRom = rom => {
    let length = rom.length;
    for (let i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = rom[i];
    }
  };
  run = () => {
    for (let i = 0; i < this.speed; ++i) {
      if (!this.paused) {
        this.opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        this.cycle(this.opcode);
        this.pc += 2;
      }
    }
  };

  cycle = opcode => {
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
        this.v[this.x] = this.v[this.x] + this.nn;
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
            let sum = this.v[this.x] + this.v[this.y];
            if (sum > 0xff) {
              this.v[0xf] = 1;
            } else {
              this.v[0xf] = 0;
            }
            this.v[this.x] = sum;
            break;
          case 0x0005:
            // SUB v[x], v[y] 8xy5 v[x] = v[x] - v[y]
            if (this.v[this.x] > this.v[this.y]) {
              this.v[0xf] = 1;
            } else {
              this.v[0xf] = 0;
            }
            this.v[this.x] = this.v[this.x] - this.v[this.y];
            break;
          case 0x0006:
            // SHR v[x], v[y] 8xy6 divide v[x] \ 2
            // if lowest bit of v[x] === 1 then vf = 1
            this.v[0xf] = this.v[this.x] & 0x01;
            this.v[this.x] = this.v[this.x] >> 1;
            break;
          case 0x0007:
            // SUB v[x], v[y] 8xy7 v[x] = v[y] - v[x]
            if (this.v[this.x] > this.v[this.y]) {
              this.v[0xf] = 0;
            } else {
              this.v[0xf] = 1;
            }
            this.v[this.x] = this.v[this.y] - this.v[this.x];
            break;
          case 0x000e:
            //  SHL v[x], v[y] set v[x] = v[x] shl 1
            this.v[0xf] = this.v[this.x] & 0x80;
            this.v[this.x] = this.v[this.x] << 1;
            break;
        }
        break;
    }

  };

  displayReset = () => {
    for (let i = this.display.length; i >= 0; i--) {
      this.display[i] = false;
    }
  }

  inputReset = () => {
    for (let i = 0; i < this.input.length; i++) {
      this.input[i] = false;
    }
  }

  loadFont = () => {
    for (let i = 0; i < this.fontSet.length; i++) {
      this.memory[i] = this.fontSet[i];
    }
  };

  reset = () => {
    this.delayTimer = 0;
    this.displayReset();
    this.iR = 0;
    this.memory = new Uint8Array(0x1000);
    this.pc = 0x200;
    this.soundTimer = 0;
    this.sp = 0;
    this.stack = new Array(0x10);
    this.vR = new Uint8Array(0x10);
    this.paused = 0;
    this.loadFont();
  };

  setArray = (array, val) => {
    for (let i = array.length; i >= 0; --i) {
      array[i] = val;
    }
    return array;
  };
}
