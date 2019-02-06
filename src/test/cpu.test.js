// const Cpu = require('../chip8/cpu');
import Cpu from "../chip8/cpu";
let cpu = new Cpu();

cpu.cycle(0xffff);
console.log(cpu.n)

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