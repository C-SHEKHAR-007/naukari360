/**
 * Cloudinary image optimization utilities.
 * Transforms image URLs to use Cloudinary's on-the-fly optimization.
 */

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "scale" | "thumb" | "limit";
  gravity?: "auto" | "face" | "center";
}

/**
 * Transform a Cloudinary URL with optimization parameters.
 * Returns the original URL if it's not a Cloudinary URL.
 */
export function optimizeImage(url: string, options: ImageTransformOptions = {}): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const { width, height, quality = 80, format = "auto", crop = "limit", gravity } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);

  // Insert transforms before /upload/ path segment
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
}

/**
 * Generate srcSet for responsive images from a Cloudinary URL.
 */
export function generateSrcSet(
  url: string,
  widths: number[] = [320, 640, 768, 1024, 1280]
): string {
  if (!url || !url.includes("res.cloudinary.com")) return "";

  return widths.map((w) => `${optimizeImage(url, { width: w })} ${w}w`).join(", ");
}

/**
 * Get the blurred placeholder URL for lazy loading.
 */
export function getBlurPlaceholder(url: string): string {
  return optimizeImage(url, { width: 20, quality: 30, format: "webp" });
}
