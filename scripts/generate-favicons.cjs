const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const publicDir = path.join(__dirname, '../public');

// Master VillaSell Favicon SVG
const svgFavicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="villaBg" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="50%" stop-color="#3730a3" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>

  <!-- Luxury Architectural Villa Emblem Squircle -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#villaBg)" />
  <rect x="16" y="16" width="480" height="480" rx="112" fill="none" stroke="#93c5fd" stroke-opacity="0.45" stroke-width="12" />

  <!-- Villa House Icon -->
  <g transform="translate(40, 48) scale(13.5)">
    <!-- Chimney -->
    <path
      d="M21.5 8.5V5.5H24V11"
      stroke="#ffffff"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Main Villa Outer Outline & Slanted Roof -->
    <path
      d="M16 4L4 14.5H8.5V26.5H23.5V14.5H28L16 4Z"
      stroke="#ffffff"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="rgba(255, 255, 255, 0.08)"
    />

    <!-- Golden Villa Gable / Attic Pediment -->
    <polygon
      points="16,8.5 9.6,14.5 22.4,14.5"
      fill="#f59e0b"
    />

    <!-- Grand Arched Villa Entrance Doorway -->
    <path
      d="M13.5 26.5V19.5C13.5 18.2 14.6 17.2 16 17.2C17.4 17.2 18.5 18.2 18.5 19.5V26.5"
      stroke="#f59e0b"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>
</svg>`;

// Write master favicon.svg
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');
console.log('✓ Created public/favicon.svg');

// Render sizes
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 }, // Recommended by Google Search guidelines
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

const renderedPngs = {};

for (const { name, size } of sizes) {
  const resvg = new Resvg(svgFavicon, {
    fitTo: { mode: 'width', value: size }
  });
  const pngBuffer = resvg.render().asPng();
  fs.writeFileSync(path.join(publicDir, name), pngBuffer);
  renderedPngs[size] = pngBuffer;
  console.log(`✓ Created public/${name} (${size}x${size}, ${pngBuffer.length} bytes)`);
}

// Generate favicon.ico with 16, 32, 48 px PNGs
function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(images.length, 4); // count

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += img.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);
}

const icoBuffer = createIco([
  { width: 16, height: 16, buffer: renderedPngs[16] },
  { width: 32, height: 32, buffer: renderedPngs[32] },
  { width: 48, height: 48, buffer: renderedPngs[48] }
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log(`✓ Created public/favicon.ico (${icoBuffer.length} bytes)`);

// Generate site.webmanifest
const manifest = {
  name: "VillaSell - Real Estate Marketplace",
  short_name: "VillaSell",
  description: "Find your dream villa, luxury apartment, commercial property, and verified plots with zero brokerage.",
  start_url: "/",
  display: "standalone",
  background_color: "#0f172a",
  theme_color: "#2563eb",
  icons: [
    {
      src: "/favicon-48x48.png",
      sizes: "48x48",
      type: "image/png"
    },
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ]
};
fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('✓ Created public/site.webmanifest');
