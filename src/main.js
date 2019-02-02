import Chip8 from './chip8/chip8';
import hexdump from './hexdump/hexdump';
'use strict'

const chip8 = new Chip8();

chip8.popSelect(chip8.romSelector)


chip8.romSelector.addEventListener('change',(e) => {
  if (e.target.value != "") {
    
    Rom = chip8.loadRom(e.target.value);
    Rom.then(data => {
      // console.log(disassembler(data))
    })
  }
}, false);

// console.log(chip8.romSelector.value)
const dissambler = async () => {
  let Rom = await chip8.loadRom("INVADERS")
  console.log(Rom)
}

console.log(hexdump('BLITZ'));