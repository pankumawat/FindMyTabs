// scripts/create-icons.js
// Generates solid-color PNG icons with no external dependencies.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

function uint32BE(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n);
  return b;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const crcVal = crc32(Buffer.concat([typeBytes, data]));
  return Buffer.concat([uint32BE(data.length), typeBytes, data, uint32BE(crcVal)]);
}

function createPNG(size, [r, g, b]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = pngChunk('IHDR', Buffer.from([
    ...uint32BE(size), ...uint32BE(size),
    8, 2, 0, 0, 0,
  ]));
  const rowSize = 1 + size * 3;
  const raw = Buffer.allocUnsafe(size * rowSize);
  for (let y = 0; y < size; y++) {
    raw[y * rowSize] = 0;
    for (let x = 0; x < size; x++) {
      const off = y * rowSize + 1 + x * 3;
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b;
    }
  }
  const idat = pngChunk('IDAT', deflateSync(raw));
  const iend = pngChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

mkdirSync('icons', { recursive: true });
for (const size of [16, 48, 128]) {
  writeFileSync(`icons/icon${size}.png`, createPNG(size, [137, 180, 250])); // #89b4fa
}
console.log('Created icons/icon16.png, icon48.png, icon128.png');
