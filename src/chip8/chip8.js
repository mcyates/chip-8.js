import Cpu from './cpu';
export default class Chip8 {
  constructor() {
    this.cpu = new Cpu()
    this.roms = [
    "15PUZZLE",
    "BLINKY",
    "BLITZ",
    "BRIX",
    "CONNECT4",
    "GUESS",
    "HIDDEN",
    "IBM",
    "INVADERS",
    "KALEID",
    "MAZE",
    "MERLIN",
    "MISSILE",
    "PONG",
    "PONG2",
    "PUZZLE",
    "SYZYGY",
    "TANK",
    "TETRIS",
    "TICTAC",
    "UFO",
    "VBRIX",
    "VERS",
    "WIPEOFF"
    ]
    this.romSelector = document.getElementById('rom_selector');
  }

  // loadRom = async (name) => {
  //   return await fetch(`./roms/${name}`)
  //   .then(res => res.arrayBuffer())
  //   .then(data => {
  //     let rom = new Uint8Array(data);
  //     return rom
  //     // chip = this.cpu.loadRom(this.reset())
  //   })
  // }
  // populates the romSelector with roms
  popSelect = (el) => {
    for (let i = 0, romsCount = this.roms.length; i < romsCount; i++) {
      let option = document.createElement('option');
      let rom = this.roms[i];
      option.value = option.innerHTML = rom;
      el.appendChild(option);
    }

  }
}