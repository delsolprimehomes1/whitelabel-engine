/**
 * Extracts dominant colors from an image file using Canvas API
 */

interface ColorCount {
  color: string;
  count: number;
}

/**
 * Converts RGB values to a hex color string
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

/**
 * Calculates the distance between two colors in RGB space
 */
const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number => {
  return Math.sqrt(
    Math.pow(r1 - r2, 2) + 
    Math.pow(g1 - g2, 2) + 
    Math.pow(b1 - b2, 2)
  );
};

/**
 * Checks if a color is too close to white or black
 */
const isNeutralColor = (r: number, g: number, b: number): boolean => {
  const brightness = (r + g + b) / 3;
  // Skip very light colors (near white)
  if (brightness > 240) return true;
  // Skip very dark colors (near black)
  if (brightness < 15) return true;
  // Skip grays (low saturation)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation < 0.15 && brightness > 200) return true;
  return false;
};

/**
 * Extracts dominant colors from an image file
 * @param file - The image file to extract colors from
 * @param maxColors - Maximum number of colors to return (default: 6)
 * @returns Promise<string[]> - Array of hex color strings
 */
export const extractColorsFromImage = (file: File, maxColors: number = 6): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Scale down for performance (max 100x100)
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const colorMap = new Map<string, number>();

      // Sample every 4th pixel for performance
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Skip neutral colors
        if (isNeutralColor(r, g, b)) continue;

        // Quantize colors to reduce similar colors (group by 16)
        const qr = Math.round(r / 16) * 16;
        const qg = Math.round(g / 16) * 16;
        const qb = Math.round(b / 16) * 16;

        const hex = rgbToHex(qr, qg, qb);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      // Convert to array and sort by frequency
      const colorCounts: ColorCount[] = Array.from(colorMap.entries())
        .map(([color, count]) => ({ color, count }))
        .sort((a, b) => b.count - a.count);

      // Cluster similar colors and keep the most frequent
      const distinctColors: string[] = [];
      const threshold = 50; // Color distance threshold for clustering

      for (const { color } of colorCounts) {
        if (distinctColors.length >= maxColors) break;

        // Parse hex to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // Check if this color is too similar to an existing one
        const isTooSimilar = distinctColors.some(existing => {
          const er = parseInt(existing.slice(1, 3), 16);
          const eg = parseInt(existing.slice(3, 5), 16);
          const eb = parseInt(existing.slice(5, 7), 16);
          return colorDistance(r, g, b, er, eg, eb) < threshold;
        });

        if (!isTooSimilar) {
          distinctColors.push(color);
        }
      }

      // Clean up
      URL.revokeObjectURL(img.src);
      resolve(distinctColors);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};
