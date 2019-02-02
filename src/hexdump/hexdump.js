export default async (file) => {
  let program = await loadRom(file);
  let lines = [];
  for (let i = 0; i < program.length; i += 16) {
    let block = program.slice(i, i + 16);
    lines.push(block);
  }
  return lines
}

const loadRom = (name) => {
  return fetch(`../roms/${name}`)
  .then(res => res.arrayBuffer())
  .then(data => {
    let rom = new Uint8Array(data);
    return rom
  })
}

