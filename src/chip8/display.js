export default class Display {
  constructor(canvas) {
    this.height = 32;
    this.width = 64;
    this.padding = 0.08;
    this.fade = 0.33;
    this.pixColor = this.hexToRgb("#5e6629");
    this.backColor = this.hexToRgb("#e1e3d8");
    this.options = {};
    this.canvas = canvas;
    this.brightness = this.fillArray(new Array(this.width * this.height), 0);
    this.filteredBuffer = this.fillArray(
      new Array(this.width * this.height),
      0
    );
  }
  reset = () => {
    this.brightness = this.fillArray(new Array(this.width * this.height), 0);
    this.filteredBuffer = this.fillArray(
      new Array(this.width * this.height),
      0
    );
    this.draw(this.fillArray(new Array(this.width * this.height), false));
  };

  draw = buffer => {
    const ctx = this.canvas.getContext("2d");
    let pWidth = this.canvas.width / (this.width + this.width * this.padding);
    let pHeight =
      this.canvas.height / (this.height + this.height * this.padding);
    let hPadding = pWidth * this.padding;
    let vPadding = pHeight * this.padding;

    // clear screen
    ctx.fillStyle = this.getFillStyle(this.backColor);
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw all pixels
    this.brightness.forEach(function(oldBrightness, i, array) {
      let newBrightness = 0;
      //fade out pixels that aren't active anymore
      if (buffer[i]) {
        newBrightness = 1;
      } else if (array[i] > 0) {
        newBrightness = Math.max(oldBrightness - this.fade, 0);
      }
      array[i] = newBrightness;
      // draw pixel on canvas
      ctx.fillStyle = this.fillStyleAtBrightness(newBrightness);
      let x = i % this.width;
      let y = Math.floor(i / this.width);
      ctx.fillRect(
        pWidth * x + hPadding * x,
        pHeight * y + vPadding * y,
        pWidth - hPadding,
        pHeight - vPadding
      );
    }, this);
  };
  fillStyleAtBrightness = brightness => {
    brightness = 1 - brightness;
    let actual = [0, 0, 0];
    actual.forEach((val, i) => {
        let diff = this.pixColor[i] - this.backColor[i];
        let brightnessFactor = diff * brightness;
        actual[i] = Math.round(this.pixColor[i] - brightnessFactor);
      });
    return this.getFillStyle(actual);
  };
  getFillStyle = colorArray => {
    return `rgb(${colorArray[0]}, ${colorArray[0]}, ${colorArray[0]})`;
  };
  hexToRgb = hex => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ]
      : null;
  };
  factory = options => {
    this.options = options;
  };
  build = canvas => new Display(this.canvas, this.options);

  fillArray = (array, state) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = state;
    }
    return array;
  };
}
