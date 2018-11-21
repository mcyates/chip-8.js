import Cpu from './cpu';
let cpu = new Cpu();
cpu.load([0x1,0x0,0x1]);
console.log(cpu.programStart);