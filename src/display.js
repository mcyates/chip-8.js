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
    const xPadding = pixelWidth * this.padding;
    const yPadding = pixelHeight * this.padding;

    // clear the screen
    ctx.fillStyle = this.getFillStyle(this.bgColor);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //draw every pixel
    this.brightness.forEach((oBrightness, i, array) => {
      let nBrightness = 0;
      if (this.buffer[i]) {
        nBrightness = 1;
      } else if (array[i] > 0) {
        nBrightness = Math.max(oBrightness - this.fade, 0);
      }
      array[i] = nBrightness;

      //paint pixels on canvas
      ctx.fillStyle = this.fillStyleAtBrightness(nBrightness);
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      ctx.fillRect(
        (pixelWidth * x) + (xPadding * x),
        (pixelHeight * y) + (yPadding * y),
        pixelWidth - xPadding,
        pixelHeight - yPadding
      );
    });
  }
  fillStyleAtBrightness = (brightness) => {
    //invert the brightness
    brightness = 1 - brightness;
    let actual = [0, 0, 0];
    actual.forEach((val, i) => {
      let diff = this.pixelColor[i] - this.bgColor[i];
      const brightnessFactor = diff * brightness;
      actual[i] = Math.round(this.pixelColor[i] - brightnessFactor);
    });
    return this.getFillStyle(actual);
  }
  getFillStyle = (colorArray) => {
    return 'rgb(' + colorArray[0] + ', ' + colorArray[1] + ', ' + colorArray[2] + ')';
  };
  Factory = (options) => {
    this.options = options;
  }
  build = (canvas) => {
    return new Display(canvas, this.options);
  }
}