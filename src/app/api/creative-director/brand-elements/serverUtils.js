import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';

export const safeId = value => String(value || 'unknown').replace(/[^a-z0-9_-]/gi, '_').slice(0, 80);
export const patternHash = base64 => createHash('sha256').update(Buffer.from(base64, 'base64')).digest('hex');
export const safeLog = (phase, data = {}) => console.info('Brand elements pilot:', { phase, count: data.count ?? null, model: data.model || null, status: data.status ?? null, errorId: safeId(data.errorId) });

export function inspectTransparentPng(base64) {
  try {
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length < 100 || !buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return null;
    let offset = 8, width, height, colorType, bitDepth, interlace, idat = [];
    while (offset + 12 <= buffer.length) {
      const length = buffer.readUInt32BE(offset); const type = buffer.toString('ascii', offset + 4, offset + 8); const data = buffer.subarray(offset + 8, offset + 8 + length);
      if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; interlace = data[12]; }
      if (type === 'IDAT') idat.push(data);
      offset += length + 12;
      if (type === 'IEND') break;
    }
    if (width !== 1024 || height !== 1024 || bitDepth !== 8 || ![4, 6].includes(colorType) || interlace !== 0 || !idat.length) return null;
    const channels = colorType === 6 ? 4 : 2; const stride = width * channels; const raw = inflateSync(Buffer.concat(idat));
    if (raw.length !== (stride + 1) * height) return null;
    let previous = Buffer.alloc(stride), cursor = 0, transparent = false, opaque = false, marginOpaque = 0, marginPixels = 0;
    const solidColors = new Set();
    for (let y = 0; y < height; y++) {
      const filter = raw[cursor++], row = Buffer.alloc(stride);
      for (let x = 0; x < stride; x++) {
        const value = raw[cursor++], left = x >= channels ? row[x - channels] : 0, up = previous[x], upperLeft = x >= channels ? previous[x - channels] : 0;
        if (filter === 0) row[x] = value;
        else if (filter === 1) row[x] = (value + left) & 255;
        else if (filter === 2) row[x] = (value + up) & 255;
        else if (filter === 3) row[x] = (value + Math.floor((left + up) / 2)) & 255;
        else if (filter === 4) { const p = left + up - upperLeft, pa = Math.abs(p-left), pb = Math.abs(p-up), pc = Math.abs(p-upperLeft); row[x] = (value + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upperLeft)) & 255; }
        else return null;
      }
      for (let x = channels - 1; x < stride; x += channels) {
        const alpha = row[x], pixelX = Math.floor(x / channels), inMargin = pixelX < 102 || pixelX >= 922 || y < 102 || y >= 922;
        if (alpha < 245) transparent = true; if (alpha > 250) opaque = true;
        if (alpha > 220) {
          const r = colorType === 6 ? row[x - 3] : row[x - 1], g = colorType === 6 ? row[x - 2] : r, b = colorType === 6 ? row[x - 1] : r;
          solidColors.add(`${r >> 5}:${g >> 5}:${b >> 5}`);
        }
        if (inMargin) { marginPixels++; if (alpha > 25) marginOpaque++; }
      }
      previous = row;
    }
    return transparent && opaque && solidColors.size <= 8 && marginOpaque / marginPixels < 0.01 ? { width, height, bytes: buffer.length } : null;
  } catch { return null; }
}

export function validateGeneratedElementPngs(elements) {
  if (!Array.isArray(elements) || elements.length !== 3) return false;
  return elements.every(element => element?.mimeType === 'image/png' && Boolean(inspectTransparentPng(element.base64)));
}
