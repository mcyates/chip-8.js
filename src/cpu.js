export default class Cpu {
  constructor() {
    this.memory = new Uint8Array(0x1000);
    this.iReg = 0;
    this.vReg = new Uint8Array(16);
  }
}
