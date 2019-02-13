"use strict"
import Chip8 from "./chip8/chip8";
import Cpu from "./chip8/cpu";
import Display from "./chip8/display";
import Input from "./chip8/input";

// let canvas = document.querySelector('canvas');
// let ctx = canvas.getContext('2d');

const chip8 = new Chip8(
  new Cpu(),
  new Display(document.querySelector("canvas")),
  new Input(document)
);

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


