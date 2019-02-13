export default class Input {
  constructor() {
    this.keyMap = {
      49: 1,  // 1 -> 1
      50: 2,  // 2 -> 2
      51: 3,  // 3 -> 3
      52: 12, // 4 -> C
      81: 4,  // Q -> 4
      87: 5,  // W -> 5
      69: 6,  // E -> 6
      82: 13, // R -> D
      65: 7,  // A -> 7
      83: 8,  // S -> 8
      68: 9,  // D -> 9
      70: 14, // F -> E
      90: 10, // Z -> A
      88: 0,  // X -> 0
      67: 11, // C -> B
      86: 15  // V -> F    
    }
    this.input = new Array(16);
  }
  onKeyUp(e) {
      let index = this.keyMap[e.keyCode];
      console.log(e.keycode)
      if (typeof index != 'undefined') {
        this.input[index] = true;
      }
  };
  onkeyDown(e) {
      let index = this.keyMap[e.keyCode];
      if (typeof index != 'undefined') {
        this.input[index] = false;
      }     
  }
  reset = () => {
    for (let i = 0; i < this.input.length; i++) {
      this.input[i] = false;
    }
  }
  getInputState = () => {
   return this.input;
  }
}


