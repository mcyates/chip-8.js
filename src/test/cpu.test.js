// const Cpu = require('../chip8/cpu');
import Cpu from "../chip8/cpu";
let cpu = new Cpu();

afterEach(() => {
  cpu.reset();
});

describe("opcode", () => {
  cpu.cycle(0xffff);
  test("this.nnn should equal the lowest 12 bits of opcode", () => {
    expect(cpu.nnn).toEqual(0x0fff);
  });

  test("this.nn should equal lowest 8 bits of opcode", () => {
    expect(cpu.nn).toEqual(0x00ff);
  });

  test("this.nib should equal lowest 4 bits of opcode", () => {
    expect(cpu.n).toEqual(0x000f);
  });

  test("this.vx should = 15", () => {
    expect(cpu.x).toEqual(15);
  });

  test("this.vy should = 15", () => {
    expect(cpu.y).toEqual(15);
  });
});

test("CLS instruction should clear the screen", () => {
  cpu.cycle(0x00e0);
  for (let i = 0; i < cpu.display.length; ++i) {
    expect(cpu.display).toEqual(expect.arrayContaining([false]));
  }
});

test("Ret should set pc to address at top of stack", () => {
  cpu.sp = 1;
  cpu.stack[0] = 0x999;
  cpu.cycle(0x00ee);
  expect(cpu.pc).toEqual(0x999);
});

test("Ret should decrement the stack pointer", () => {
  cpu.sp = 1;
  cpu.cycle(0x00ee);
  expect(cpu.sp).toEqual(0);
});

test("JP should set pc to designated address", () => {
  cpu.cycle(0x1333);
  expect(cpu.pc).toEqual(0x333);
});

test("Call should put pc on top of the stack", () => {
  cpu.cycle(0x2200);
  expect(cpu.stack[cpu.sp - 1]).toEqual(0x200);
});

test("Call should increment sp", () => {
  cpu.cycle(0x2200);
  expect(cpu.sp).toEqual(1);
});

test("CAll should set pc to = nnn", () => {
  cpu.cycle(0x2400);
  expect(cpu.pc).toEqual(0x400);
});

test("SE Vx, byte should increment pc if Vx === nn", () => {
  cpu.v[5] = 0x0003;
  cpu.cycle(0x3503);
  expect(cpu.pc).toEqual(0x204);
});

test("SNE Vx, byte should increment pc if Vx !== nn", () => {
  cpu.v[3] = 0x0004;
  cpu.cycle(0x4333);
  expect(cpu.pc).toEqual(0x204);
});

test("SE Vx, Vy should increment pc if Vx === Vy", () => {
  cpu.v[4] = 3;
  cpu.v[5] = 3;
  cpu.cycle(0x5450);
  expect(cpu.pc).toEqual(0x204);
});

test("LD vX should put nn into vX", () => {
  cpu.cycle(0x6433);
  expect(cpu.v[4]).toEqual(0x0033);
});

test("v[x] should be the sum of v[x] + nn", () => {
  cpu.v[5] = 0x0004;
  cpu.cycle(0x7505);
  expect(cpu.v[cpu.x]).toEqual(0x0009);
});

test("8xy0 v[y] should be stored in v[x]", () => {
  cpu.v[1] = 3;
  cpu.cycle(0x8210);
  expect(cpu.v[cpu.x]).toEqual(3);
});
describe("8xy1", () => {
  test("8xy1 0x0040 | 0x0004 should = 0x0044", () => {
    cpu.v[1] = 0x0040;
    cpu.v[2] = 0x0004;
    cpu.cycle(0x8121);
    expect(cpu.v[cpu.x]).toEqual(0x0044);
  });
  test("8xy1 0x0000 | 0x0000 should = 0;]", () => {
    cpu.v[1] = 0x0000;
    cpu.v[2] = 0x0000;
    cpu.cycle(0x8121);
    expect(cpu.v[cpu.x]).toEqual(0x0000);
  });
});

describe("8xy2", () => {
  test("0x0444 & 0x0044 should = 0x0044", () => {
    cpu.v[1] = 0x0444;
    cpu.v[2] = 0x0044;
    cpu.cycle(0x8122);
    expect(cpu.v[cpu.x]).toEqual(0x0044);
  });
  test("8xy2 0x4400 & 0x0044 should = 0", () => {
    cpu.v[1] = 0x4400;
    cpu.v[2] = 0x0044;
    cpu.cycle(0x8122);
    expect(cpu.v[cpu.x]).toEqual(0x0000);
  });
});

describe("8xy3", () => {
  test("8xy3 1 ^ 1 should = 0", () => {
    cpu.v[1] = 1;
    cpu.v[2] = 1;
    cpu.cycle(0x8123);
    expect(cpu.v[cpu.x]).toEqual(0);
  });
  test("8xy3 1 ^ 0 should = 1", () => {
    cpu.v[1] = 0;
    cpu.v[2] = 1;
    cpu.cycle(0x8123);
    expect(cpu.v[cpu.x]).toEqual(1);
  });
  test("8xy3 0 ^ 0 should = 0", () => {
    cpu.v[1] = 0;
    cpu.v[2] = 0;
    cpu.cycle(0x8123);
    expect(cpu.v[cpu.x]).toEqual(0);
  });
});

describe("8xy4", () => {
  test("3 + 4 = 7", () => {
    cpu.v[1] = 3;
    cpu.v[2] = 4;
    cpu.cycle(0x8124);
    expect(cpu.v[cpu.x]).toEqual(0x0007);
  });
  test("sum > 255 v[0xf] = 1", () => {
    cpu.v[1] = 0xff;
    cpu.v[2] = 0x01;
    cpu.cycle(0x8124);
    expect(cpu.v[0xf]).toEqual(1);
    expect(cpu.v[cpu.x]).toEqual(0);
  });
  test("sum < 255 v[0xf] = 0", () => {
    cpu.v[1] = 0xfe;
    cpu.v[2] = 0x01;
    cpu.cycle(0x8124);
    expect(cpu.v[1]).toEqual(255);
    expect(cpu.v[0xf]).toEqual(0);
  });
});

describe("8xy5", () => {
  test("5 - 4 should = 1", () => {
    cpu.v[1] = 5;
    cpu.v[2] = 4;
    cpu.cycle(0x8125);
    expect(cpu.v[cpu.x]).toEqual(1);
  });
  test("5 - 6 should = 255", () => {
    cpu.v[1] = 5;
    cpu.v[2] = 6;
    cpu.v[0xf] = 1;
    cpu.cycle(0x8125);
    expect(cpu.v[cpu.x]).toEqual(0xff);
    expect(cpu.v[0xf]).toEqual(0);
  });
  test("v[0xf] should = 1 if there isn't a borrow", () => {
    cpu.v[1] = 5;
    cpu.v[2] = 3;
    cpu.v[0xf] = 0;
    cpu.cycle(0x8125);
    expect(cpu.v[cpu.x]).toEqual(2);
    expect(cpu.v[0xf]).toEqual(1);
  });
});

describe("8xy6", () => {
  test("sets vf to least significant bit", () => {
    cpu.v[1] = 8;
    cpu.v[0xf] = 1;
    cpu.cycle(0x8116);
    expect(cpu.v[0xf]).toEqual(0);

    cpu.v[1] = 9;
    cpu.v[0xf] = 0;
    cpu.cycle(0x8116);
    expect(cpu.v[0xf]).toEqual(1);
  });
  test("shift v[x] right by one", () => {
    cpu.v[1] = 8;
    cpu.cycle(0x8116);
    expect(cpu.v[cpu.x]).toEqual(4);
  });
});

describe("8xy7", () => {
  test("vx = vy - vx", () => {
    cpu.v[1] = 8;
    cpu.v[2] = 10;
    cpu.cycle(0x8127);
    expect(cpu.v[cpu.x]).toEqual(2);
  });
  test("set v[0xf] to zero when there is a borrow", () => {
    cpu.v[1] = 11;
    cpu.v[2] = 10;
    cpu.v[0xf] = 1;
    cpu.cycle(0x8127);
    expect(cpu.v[0xf]).toEqual(0);
    expect(cpu.v[cpu.x]).toEqual(0xff);
  });
  test("set v[0xf] to 0 when there isn't a borrow", () => {
    cpu.v[1] = 10;
    cpu.v[2] = 10;
    cpu.v[0xf] = 0;
    cpu.cycle(0x8127);
    expect(cpu.v[0xf]).toEqual(1);
    expect(cpu.v[cpu.x]).toEqual(0);
  });
});

describe("8xye", () => {
  test("shift v[x] left by one", () => {
    cpu.v[1] = 8;
    cpu.cycle(0x811e);
    expect(cpu.v[cpu.x]).toEqual(0x10);
  });
  test("set v[0xf] to val of largest bit of v[x] before shift", () => {
    cpu.v[1] = 0x08;
    cpu.v[0xf] = 1;
    cpu.cycle(0x811e);
    expect(cpu.v[0xf]).toEqual(0);

    cpu.v[1] = 0x88;
    cpu.v[0xf] = 0;
    cpu.cycle(0x811e);
    expect(cpu.v[0xf]).toEqual(0x80);
  });
});

describe("9xy0", () => {
  test("if vx !== vy increment pc", () => {
    cpu.v[1] = 2;
    cpu.v[2] = 3;
    cpu.cycle(0x9120);
    expect(cpu.pc).toEqual(0x204);
  });
  test("if vx === vy don't increment pc", () => {
    cpu.v[1] = 2;
    cpu.v[2] = 2;
    cpu.cycle(0x9120);
    expect(cpu.pc).toEqual(0x200);
  });
});

test("Annn", () => {
  cpu.cycle(0xa300);
  expect(cpu.i).toEqual(0x300);
});

test("Bnnn", () => {
  cpu.v[0] = 0x01;
  cpu.cycle(0xb001);
  expect(cpu.pc).toEqual(0x0002);
});

test("CXNN", () => {
  const originalRand = Math.random;
  Math.random = () => 1;
  cpu.cycle(0xc102);
  expect(cpu.v[cpu.x]).toEqual(2);
  Math.random = originalRand;
});

describe("DXYN", () => {
  beforeEach(() => {
    cpu.i = 0;
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        cpu.memory[i + j] = 0x80;
      }
    }
  });
  test("draw a sprite at Vx, Vy", () => {
    let count = 0;
    cpu.setPixel = (x, y) => {
      if (count === 0) {
        expect(x).toEqual(5);
        expect(y).toEqual(8);
        count++;
      }
      cpu.v[1] = 5;
      cpu.v[2] = 8;
      cpu.cycle(0xd122);
    };
  });
  test("draw a sprite with a width of 8 pixels", () => {
    let xs = [];
    cpu.setPixel = (x, y) => {
      xs.push(x);
      if (xs.length === 8) {
        let width = xs[xs.length - 1] - xs[0];
        expect(width).toEqual(8);
      }
    };
    cpu.v[1] = 5;
    cpu.v[2] = 6;
    cpu.cycle(0xd121);
  });
  test('draw a sprite with height of 8 pixels', () => {
    let ys = [];
    cpu.setPixel = (x,y) => {
      ys.push(y);
      if (ys.length === 3 * 8) {
        let height = ys[ys.length - 1] - ys[0];
        expect(height).toEqual(3);
      }
    }
    cpu.v[1] = 5;
    cpu.v[2] = 6;
    cpu.cycle(0xd123);
  });

  test('set vf to 1 if any collisions happen', () => {
    cpu.setPixel = () => true;
    cpu.cycle(0xd121);
    expect(cpu.v[0xf]).toEqual(1)
  });
  test('set vf to 0 if there are no collisions', () => {
    cpu.setPixel = () => false;
    cpu.cycle(0xd121);
    expect(cpu.v[0xf]).toEqual(0)
  });
});

describe('EX9E', () => {
  test('skips next instruct if key in Vx is pressed', () => {
    cpu.v[1] = 5;
    cpu.pressed = (key) => {
      expect(key).toEqual(5);
      return true;
    }
    cpu.cycle(0xe19e);
    expect(cpu.pc).toEqual(0x204);
  });
  test('shouldn\'t skip if the key is not pressed.', () => {
    cpu.v[2] = 6;
    cpu.pressed = (key) => {
      expect(key).toEqual(6);
      return false;
    }
    cpu.cycle(0xe29e);
    expect(cpu.pc).toEqual(0x200);
  });
});

describe('exa1', () => {
  test("skips the next instruction if the key stored in VX isn't pressed", function() {
    cpu.v[3] = 7;

    cpu.pressed = (key) => {
      expect(key).toEqual(7);
      return false;
    }

    cpu.cycle(0xe3a1);
    expect(cpu.pc).toEqual(0x204);
  });

  test("doesn't skip the next instruction if the key stored in VX is pressed", function() {
    cpu.v[4] = 8;

    cpu.pressed = (key) => {
      expect(key).toEqual(8);
      return true;
    }

    cpu.cycle(0xe4a1);
    expect(cpu.pc).toEqual(0x200);
});
});