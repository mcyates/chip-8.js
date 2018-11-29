import Cpu from "./cpu";
class Chip8 {
  constructor() {
    this.cpu = new Cpu();
  }
  start = () => {

  }
}
chip8.cpu.load([0x1, 0x0, 0x1]);
console.log(chip8.cpu.programStart);
