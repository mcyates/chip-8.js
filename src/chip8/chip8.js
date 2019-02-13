import Cpu from "./cpu";
import Display from "./display";
import Input from "./input";
export default class Chip8 {
  constructor() {
    this.cpu =  new Cpu();
    this.display = new Display(document.querySelector("canvas"))
    this.input = new Input();
    this.roms = [
    "15PUZZLE",
    "BC_test",
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
    this.document = document;
    this.romSelector = document.getElementById('rom_selector');
  }
  start = () => {
    this.timerId = setInterval(() => {
      for (let i = 0; i < 100; i++) {
        this.cpu.run();
      }
      this.cpu.setInputState(this.input.getInputState())
      this.display.draw(this.cpu.getDisplayBuffer());
      //update cpu timers
      this.cpu.updateTimers();
    }, 16);
  }
  reset = () => {
    clearInterval(this.timerId);
    this.input.reset();
    this.cpu.reset();
  }

  loadRom = async (name) => {
    return await fetch(`./roms/${name}`)
    .then(res => res.arrayBuffer())
    .then(data => {
      let rom = new Uint8Array(data);
      this.cpu.loadRom(rom)
    })
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