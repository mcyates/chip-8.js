// const Cpu = require('../chip8/cpu');
import Cpu from "../chip8/cpu";
let cpu = new Cpu();

describe('opcode', () => {
  cpu.cycle(0xffff)
  test("this.nnn should equal the lowest 12 bits of opcode", () => {
    expect(cpu.nnn).toEqual(0x0fff);
  });
  
  test("this.nn should equal lowest 8 bits of opcode", () => {
    expect(cpu.nn).toEqual(0x00ff);
  });
  
  test('this.nib should equal lowest 4 bits of opcode', () => {
    expect(cpu.n).toEqual(0x000f);
  });
  
  test('this.vx should = 15', () => {
    expect(cpu.vx).toEqual(15);
  });
  
  test('this.vy should = 15', () => {
    expect(cpu.vy).toEqual(15);
  });
})



test('CLS instruction should clear the screen', () => {
cpu.cycle(0x00e0);
  for (let i = 0; i < cpu.display.length; ++i) {
    expect(cpu.display).toEqual(expect.arrayContaining([false]));
  };
});

test('Ret should set pc to address at top of stack', () => {
  cpu.sp = 2;
  cpu.stack[1] = 0x999;
  cpu.cycle(0x00ee);
  expect(cpu.pc).toEqual(0x999);
})

test('Ret should decrement the stack pointer', () => {
  cpu.sp = 2;
  cpu.cycle(0x00ee);
  expect(cpu.sp).toEqual(1);
});

test('JP should set pc to designated address', () => {
  cpu.cycle(0x1333);
  expect(cpu.pc).toEqual(0x333);
})