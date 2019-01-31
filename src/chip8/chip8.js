

export default class Chip8 {
  constructor() {
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

  loadRom = (rom) => {
    let request = new XMLHttpRequest;
    request.onload = () => {
      // if (request.response)
      console.log(request.response)
    }
  }
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