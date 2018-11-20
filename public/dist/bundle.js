/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/cpu.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/cpu.js":
/*!********************!*\
  !*** ./src/cpu.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\n\n\nconst fontSet = new Uint8Array([0xF0, 0x90, 0x90, 0x90, 0xF0, // 0\n0x20, 0x60, 0x20, 0x20, 0x70, // 1\n0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2\n0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3\n0x90, 0x90, 0xF0, 0x10, 0x10, // 4\n0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5\n0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6\n0xF0, 0x10, 0x20, 0x40, 0x40, // 7\n0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8\n0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9\n0xF0, 0x90, 0xF0, 0x90, 0x90, // A\n0xE0, 0x90, 0xE0, 0x90, 0xE0, // B\n0xF0, 0x80, 0x80, 0x80, 0xF0, // C\n0xE0, 0x90, 0x90, 0x90, 0xE0, // D\n0xF0, 0x80, 0xF0, 0x80, 0xF0, // E\n0xF0, 0x80, 0xF0, 0x80, 0x80 // F\n]);\nconst programStart = 0x200;\nconst dHeight = 64;\nconst dWidth = 32;\n\nlet chip8 = () => {\n  console.log(undefined); //4096 bytes of memory\n\n  let memory = new ArrayBuffer(0x1000);\n  undefined.memory = new Uint8Array(memory); // 16 8bit v registers 0-F\n\n  undefined.vReg = new Uint8Array(16); // 1 16bit(2-byte) address or index register\n\n  undefined.iReg = 0; // 12-bit program counter\n\n  undefined.pc = programStart; // a timer that counts down to 0 at 60hz when non-zero\n\n  undefined.dTimer = 0; // plays sound when non-zero counts down at 60hz\n\n  undefined.sTimer = 0; // stack pointer 1 16-bit address that points to the top of the stack\n\n  undefined.sp = 0; // the stack is a array of 16 16-bit values\n\n  undefined.stack = new Uint16Array(16); // whether the system is currently waiting for input before proceeding\n\n  undefined.inputWait = -1; // an array of booleans that indicates if a pixel is on or off\n\n  undefined.display = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"fillArray\"])(new Array(dWidth * dHeight), false); // a boolean array that indicates if a key has been pressed\n\n  undefined.input = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"fillArray\"])(new Array(16), false);\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY3B1LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NwdS5qcz8yZjczIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHsgZmlsbEFycmF5IH0gZnJvbSAnLi91dGlsJztcclxuXHJcblxyXG5jb25zdCBmb250U2V0ID0gbmV3IFVpbnQ4QXJyYXkoW1xyXG4gIDB4RjAsIDB4OTAsIDB4OTAsIDB4OTAsIDB4RjAsIC8vIDBcclxuICAweDIwLCAweDYwLCAweDIwLCAweDIwLCAweDcwLCAvLyAxXHJcbiAgMHhGMCwgMHgxMCwgMHhGMCwgMHg4MCwgMHhGMCwgLy8gMlxyXG4gIDB4RjAsIDB4MTAsIDB4RjAsIDB4MTAsIDB4RjAsIC8vIDNcclxuICAweDkwLCAweDkwLCAweEYwLCAweDEwLCAweDEwLCAvLyA0XHJcbiAgMHhGMCwgMHg4MCwgMHhGMCwgMHgxMCwgMHhGMCwgLy8gNVxyXG4gIDB4RjAsIDB4ODAsIDB4RjAsIDB4OTAsIDB4RjAsIC8vIDZcclxuICAweEYwLCAweDEwLCAweDIwLCAweDQwLCAweDQwLCAvLyA3XHJcbiAgMHhGMCwgMHg5MCwgMHhGMCwgMHg5MCwgMHhGMCwgLy8gOFxyXG4gIDB4RjAsIDB4OTAsIDB4RjAsIDB4MTAsIDB4RjAsIC8vIDlcclxuICAweEYwLCAweDkwLCAweEYwLCAweDkwLCAweDkwLCAvLyBBXHJcbiAgMHhFMCwgMHg5MCwgMHhFMCwgMHg5MCwgMHhFMCwgLy8gQlxyXG4gIDB4RjAsIDB4ODAsIDB4ODAsIDB4ODAsIDB4RjAsIC8vIENcclxuICAweEUwLCAweDkwLCAweDkwLCAweDkwLCAweEUwLCAvLyBEXHJcbiAgMHhGMCwgMHg4MCwgMHhGMCwgMHg4MCwgMHhGMCwgLy8gRVxyXG4gIDB4RjAsIDB4ODAsIDB4RjAsIDB4ODAsIDB4ODAgIC8vIEZcclxuXSk7XHJcblxyXG5jb25zdCBwcm9ncmFtU3RhcnQgPSAweDIwMDtcclxuY29uc3QgZEhlaWdodCA9IDY0O1xyXG5jb25zdCBkV2lkdGggPSAzMjtcclxuXHJcbmxldCBjaGlwOCA9ICgpID0+IHtcclxuICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAvLzQwOTYgYnl0ZXMgb2YgbWVtb3J5XHJcbiAgbGV0IG1lbW9yeSA9IG5ldyBBcnJheUJ1ZmZlcigweDEwMDApOyBcclxuICB0aGlzLm1lbW9yeSA9IG5ldyBVaW50OEFycmF5KG1lbW9yeSk7XHJcblxyXG4gIC8vIDE2IDhiaXQgdiByZWdpc3RlcnMgMC1GXHJcbiAgdGhpcy52UmVnID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xyXG5cclxuICAvLyAxIDE2Yml0KDItYnl0ZSkgYWRkcmVzcyBvciBpbmRleCByZWdpc3RlclxyXG4gIHRoaXMuaVJlZyA9IDA7IFxyXG5cclxuICAvLyAxMi1iaXQgcHJvZ3JhbSBjb3VudGVyXHJcbiAgdGhpcy5wYyA9IHByb2dyYW1TdGFydDtcclxuXHJcbiAgLy8gYSB0aW1lciB0aGF0IGNvdW50cyBkb3duIHRvIDAgYXQgNjBoeiB3aGVuIG5vbi16ZXJvXHJcbiAgdGhpcy5kVGltZXIgPSAwO1xyXG5cclxuICAvLyBwbGF5cyBzb3VuZCB3aGVuIG5vbi16ZXJvIGNvdW50cyBkb3duIGF0IDYwaHpcclxuICB0aGlzLnNUaW1lciA9IDA7IFxyXG5cclxuICAvLyBzdGFjayBwb2ludGVyIDEgMTYtYml0IGFkZHJlc3MgdGhhdCBwb2ludHMgdG8gdGhlIHRvcCBvZiB0aGUgc3RhY2tcclxuICB0aGlzLnNwID0gMDtcclxuXHJcbiAgLy8gdGhlIHN0YWNrIGlzIGEgYXJyYXkgb2YgMTYgMTYtYml0IHZhbHVlc1xyXG4gIHRoaXMuc3RhY2sgPSBuZXcgVWludDE2QXJyYXkoMTYpO1xyXG5cclxuICAvLyB3aGV0aGVyIHRoZSBzeXN0ZW0gaXMgY3VycmVudGx5IHdhaXRpbmcgZm9yIGlucHV0IGJlZm9yZSBwcm9jZWVkaW5nXHJcbiAgdGhpcy5pbnB1dFdhaXQgPSAtMSBcclxuXHJcbiAgLy8gYW4gYXJyYXkgb2YgYm9vbGVhbnMgdGhhdCBpbmRpY2F0ZXMgaWYgYSBwaXhlbCBpcyBvbiBvciBvZmZcclxuICB0aGlzLmRpc3BsYXkgPSBmaWxsQXJyYXkobmV3IEFycmF5KGRXaWR0aCAqIGRIZWlnaHQpLCBmYWxzZSk7XHJcblxyXG4gIC8vIGEgYm9vbGVhbiBhcnJheSB0aGF0IGluZGljYXRlcyBpZiBhIGtleSBoYXMgYmVlbiBwcmVzc2VkXHJcbiAgdGhpcy5pbnB1dCA9IGZpbGxBcnJheShuZXcgQXJyYXkoMTYpLCBmYWxzZSk7XHJcblxyXG59XHJcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJBO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/cpu.js\n");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: fillArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillArray\", function() { return fillArray; });\nconst fillArray = (array, state) => {\n  for (let i = 0; i < array.length; i++) {\n    array[i] = state;\n  }\n\n  return array;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy91dGlsLmpzP2UwZWIiXSwic291cmNlc0NvbnRlbnQiOlsiIGV4cG9ydCBjb25zdCBmaWxsQXJyYXkgPSAoYXJyYXksIHN0YXRlKSA9PiB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgYXJyYXlbaV0gPSBzdGF0ZTtcclxuICB9XHJcbiAgcmV0dXJuIGFycmF5O1xyXG59XHJcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/util.js\n");

/***/ })

/******/ });