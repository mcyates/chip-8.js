"use strict"
import Chip8 from "./chip8/chip8";
import hexDump from 'hexdump-js';

const chip8 = new Chip8();

chip8.popSelect(chip8.romSelector);

chip8.romSelector.addEventListener(
  "change",
  e => {
    if (e.target.value != "") {
      // console.log(e.target.value)
      // chip8.loadRom(e.target.value)
      dissambler(e.target.value);
    }
  },
  false
);

const loadBuffer = name => {
  return fetch(`./roms/${name}`)
    .then(res => res.arrayBuffer())
    .then(data => {
      return hexDump(data);
    });
};

// console.log(chip8.romSelector.value)
const dissambler = async (name) => {
  let Rom = await loadBuffer(name);
  console.log(Rom)
};

