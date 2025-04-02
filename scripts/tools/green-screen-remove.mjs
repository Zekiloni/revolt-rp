import * as fs from 'fs';
import * as path from 'path';
import { Image } from 'image-js';

const inputDir = './input';
const outputDir = './output';

async function processImages() {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
    const files = await fs.promises.readdir(inputDir);

    for (const file of files) {
      if (!file.match(/\.(png|jpg|jpeg|gif)$/i)) continue;

      const inputFilePath = path.join(inputDir, file);
      const outputFileName = path.parse(file).name + '.png'; // Force PNG output for transparency
      const outputFilePath = path.join(outputDir, outputFileName);

      console.log(`Processing ${file}...`);

      let image = await Image.load(inputFilePath);

      // Create a cropped image if needed (adjusting the crop parameters based on the image)
      const croppedImage = image.crop({
        x: Math.floor(image.width / 4.5),
        y: 0,
        width: Math.min(image.height, image.width - Math.floor(image.width / 4.5)),
        height: image.height
      });

      // Create a new RGBA image with alpha channel
      const result = new Image({
        width: croppedImage.width,
        height: croppedImage.height,
        components: croppedImage.components, // RGBA
        alpha: true
      });

      // Sample the background green color (from the corners and edges)
      const samples = [];
      // Sample from corners and edges
      [0, croppedImage.width-1].forEach(x => {
        [0, croppedImage.height-1].forEach(y => {
          samples.push(croppedImage.getPixelXY(x, y));
        });
      });

      // Calculate average background color
      const avgBgColor = samples.reduce((acc, pixel) => {
        return [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]];
      }, [0, 0, 0]).map(v => v / samples.length);

      // Process each pixel with improved green screen detection
      for (let x = 0; x < croppedImage.width; x++) {
        for (let y = 0; y < croppedImage.height; y++) {
          const pixel = croppedImage.getPixelXY(x, y);
          const r = pixel[0];
          const g = pixel[1];
          const b = pixel[2];

          // More sophisticated green screen detection
          // Calculate color distance from the background color
          const colorDistance = Math.sqrt(
            Math.pow(r - avgBgColor[0], 2) +
            Math.pow(g - avgBgColor[1], 2) +
            Math.pow(b - avgBgColor[2], 2)
          );

          // Calculate green dominance
          const greenDominance = g / (r + b + 1); // Add 1 to avoid division by zero

          // The closer to bg color and higher the green dominance, the more transparent
          if (colorDistance < 80 && greenDominance > 0.9) {
            result.setPixelXY(x, y, [0, 0, 0, 0]); // Fully transparent
          }
          // Partial transparency for semi-transparent areas (like bottle caps)
          else if (colorDistance < 120 && greenDominance > 0.7) {
            // Calculate alpha based on distance and dominance
            const alpha = Math.max(0, Math.min(255, (120 - colorDistance) * 2));
            result.setPixelXY(x, y, [r, g, b, 255 - alpha]);
          }
          else {
            // Copy the original pixel with full alpha
            result.setPixelXY(x, y, [r, g, b, 255]);
          }
        }
      }

      await result.save(outputFilePath);
      console.log(`Processed and saved ${file} to ${outputFilePath}`);
    }

    console.log('All images processed successfully!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages().then(() => console.log('Done!'));
