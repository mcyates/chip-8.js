"use strict"
import Chip8 from "./chip8/chip8";


// let canvas = document.querySelector('canvas');
// let ctx = canvas.getContext('2d');

let chip8 = new Chip8();

chip8.popSelect(chip8.romSelector);

chip8.romSelector.addEventListener(
  "change",
  e => {
    if (e.target.value != "") {
      chip8.reset();
      chip8.loadRom(e.target.value)
      chip8.start()
    }
  },
  false
);
document.addEventListener('keydown', (e) => {
  chip8.input.onkeyDown(e);
});

document.addEventListener('keyup', (e) => {
  chip8.input.onKeyUp(e);
});
