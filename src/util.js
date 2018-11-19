 const fillArray = (array, state) {
  for (let i = 0; i < array.length; i++) {
    array[i] = state;
  }
  return array;
}

export default  util = {
  fillArray: fillArray
}