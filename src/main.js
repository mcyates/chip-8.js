import Chip8 from './chip8/chip8';

const chip8 = new Chip8();

chip8.popSelect(chip8.romSelector)

chip8.romSelector.addEventListener('change',(e) => {
  if (e.target.value != "") {
    chip8.loadRom(e.target.value);
    romSelector.blur();
    canvas.focus();
  }
})

