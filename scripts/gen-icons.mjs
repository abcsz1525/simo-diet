import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const svg = readFileSync(join(publicDir, "icon.svg"));

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

for (const { name, size, maskable } of sizes) {
  let pipeline = sharp(svg, { density: 600 }).resize(size, size, {
    fit: "contain",
    background: "#F4C600",
  });
  if (maskable) {
    // Maskable нуждается в "safe area" — добавим внутренний padding 10%
    const inner = Math.round(size * 0.8);
    pipeline = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: "#F4C600",
      },
    })
      .composite([
        {
          input: await sharp(svg, { density: 600 })
            .resize(inner, inner, { fit: "contain", background: { r: 244, g: 198, b: 0, alpha: 1 } })
            .png()
            .toBuffer(),
          top: Math.round((size - inner) / 2),
          left: Math.round((size - inner) / 2),
        },
      ])
      .png();
  }
  const out = await pipeline.png().toBuffer();
  writeFileSync(join(publicDir, name), out);
  console.log(`✓ ${name} (${size}×${size})`);
}

console.log("Done.");
