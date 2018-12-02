import utility from './utility';

export class Display  {
  constructor(canvas) {
    this.width = 64;
    this.height = 32;
    this.padding = 0.08;
    this.fade = 0.40;
    this.pixelColor = [0, 90, 0];
    this.bgColor = [227, 226, 226];
    this.canvas = canvas;
    this.brightness = utility.setArray(new Array(0x800), 0); 
    this.fBuffer = utility.setArray(new Array(0x800));
  }
  reset = () => {
    for (let i = 0; i < this.brightness.length; i++) {
      this.brightness[i] = 0;
    }
    for (let i = 0; i < this.fBuffer.length; i++) {
      this.brightness[i] = 0;
    }
    this.draw(utility.setArray(new Array(0x800), false));
  }
  draw = (buffer) => {
    const canvas = this.canvas.getContext('2d');
    const pixelWidth = this.canvas.width / (this.width + this.width * this.padding);
    const pixelHeight = this.canvas.height / (this.height + this.height * this.padding);
    
  }
}