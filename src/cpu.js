export class cpu {
  constructor() {
    this.memory = new Uint8Array(0x1000);
    this.vReg = new Uint8Array(16);
  }
}