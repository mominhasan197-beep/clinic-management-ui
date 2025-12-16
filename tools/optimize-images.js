const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const targetDirs = ['treatments', 'machines'];
const widths = [400, 800, 1200];
const formats = ['webp', 'avif'];

async function optimize() {
  const manifest = {};

  for (const dir of targetDirs) {
    const srcDir = path.join(assetsDir, dir);
    if (!fs.existsSync(srcDir)) {
      console.warn(`Directory not found: ${srcDir}`);
      continue;
    }

    const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g)$/i.test(f));

    for (const file of files) {
      const inputPath = path.join(srcDir, file);
      const name = path.parse(file).name;
      // Key is now relative path e.g. "treatments/foo.png"
      const relativeKey = `${dir}/${file}`;
      manifest[relativeKey] = { variants: {}, placeholder: '' };

      // generate variants
      for (const w of widths) {
        for (const fmt of formats) {
          const outName = `${name}-${w}.${fmt}`;
          const outPath = path.join(srcDir, outName);

          // Check if exists to skip re-processing? (Optional, but let's overwrite for now to be safe)
          await sharp(inputPath)
            .resize({ width: w })
          [fmt]({ quality: 80 })
            .toFile(outPath);

          manifest[relativeKey].variants[`${w}_${fmt}`] = `assets/${dir}/${outName}`;
        }
      }

      // generate small placeholder (blurred tiny webp)
      const placeholderBuffer = await sharp(inputPath)
        .resize({ width: 20 })
        .webp({ quality: 40 })
        .toBuffer();
      manifest[relativeKey].placeholder = `data:image/webp;base64,${placeholderBuffer.toString('base64')}`;

      console.log(`Optimized ${relativeKey}`);
    }
  }

  // Save manifest to assets root
  fs.writeFileSync(path.join(assetsDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Wrote assets/manifest.json');
}

optimize().catch(err => { console.error(err); process.exit(1); });
