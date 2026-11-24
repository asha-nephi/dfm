const sharp = require("sharp");

const size = 160;
const pad = 18;

const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="28" fill="#F7F5F0"/>
  <g transform="translate(${pad}, ${pad}) scale(${(size - pad * 2) / 40})">
    <path d="M20 2 L35.3 11 V29 L20 38 L4.6 29 V11 Z" fill="#183A2F" />
    <path d="M20 2 L35.3 11 V29 L20 20 Z" fill="#B68D4C" />
    <path d="M14 12 H19.5C24.5 12 28 15.5 28 20C28 24.5 24.5 28 19.5 28H14V12Z" fill="#F7F5F0" />
    <path d="M14 12 H19C22.5 12 25 15.2 25 20C25 24.8 22.5 28 19 28H14V12Z" fill="#183A2F" />
  </g>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile("public/email-logo.png")
  .then(() => console.log("written"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
