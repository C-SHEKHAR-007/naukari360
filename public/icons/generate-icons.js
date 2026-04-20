// Run with: node public/icons/generate-icons.js
// Generates placeholder PWA icons. Replace with actual branding icons later.
const fs = require('fs');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateSVG(size) {
  const fontSize = Math.round(size * 0.35);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#FF6B00" rx="${Math.round(size * 0.15)}"/>
  <text x="50%" y="55%" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">N360</text>
</svg>`;
}

sizes.forEach(size => {
  fs.writeFileSync(`public/icons/icon-${size}x${size}.svg`, generateSVG(size));
  console.log(`Generated icon-${size}x${size}.svg`);
});

console.log('\nNote: Convert SVGs to PNGs for production using a tool like sharp or an online converter.');
console.log('Update manifest.json to use .svg if keeping SVG format.');
