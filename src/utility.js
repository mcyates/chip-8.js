export default class utility {
  static setArray = (array, state) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = state;
    }
    return array
  }
  static rng = () => {
    return Math.random()*256|0;
  }
}




