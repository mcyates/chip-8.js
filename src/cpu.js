'use strict';
import util from './util';


const fontSet = new Uint8Array([
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
]);

const programStart = 0x200;
const dHeight = 64;
const dWidth = 32;

let chip8 = () => {
  //4096 bytes of memory
  let memory = new ArrayBuffer(0x1000); 
  this.memory = new Uint8Array(memory);

  // 16 8bit v registers 0-F
  this.vReg = new Uint8Array(16);

  // 1 16bit(2-byte) address or index register
  this.iReg = 0; 

  // 12-bit program counter
  this.pc = programStart;

  // a timer that counts down to 0 at 60hz when non-zero
  this.dTimer = 0;

  // plays sound when non-zero counts down at 60hz
  this.sTimer = 0; 

  // stack pointer 1 16-bit address that points to the top of the stack
  this.sp = 0;

  // the stack is a array of 16 16-bit values
  this.stack = new Uint16Array(16);

  // whether the system is currently waiting for input before proceeding
  this.inputWait = -1 

  // an array of booleans that indicates if a pixel is on or off
  this.display = util.fillArray(new Array(dWidth * dHeight), false);

  // a boolean array that indicates if a key has been pressed
  this.input = util.fillArray(new Array(16), false);

  console.log(this)
}