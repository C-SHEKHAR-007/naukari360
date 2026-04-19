import { describe, it, expect } from "vitest";
import { optimizeImage, generateSrcSet, getBlurPlaceholder } from "@/lib/image";

describe("Image Optimization Utilities", () => {
  const cloudinaryUrl = "https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg";

  describe("optimizeImage", () => {
    it("adds default transforms to Cloudinary URL", () => {
      const result = optimizeImage(cloudinaryUrl);
      expect(result).toContain("/upload/f_auto,q_80,c_limit/");
      expect(result).toContain("sample.jpg");
    });

    it("adds width and height transforms", () => {
      const result = optimizeImage(cloudinaryUrl, { width: 800, height: 600 });
      expect(result).toContain("w_800");
      expect(result).toContain("h_600");
    });

    it("respects custom quality and format", () => {
      const result = optimizeImage(cloudinaryUrl, { quality: 60, format: "webp" });
      expect(result).toContain("f_webp");
      expect(result).toContain("q_60");
    });

    it("adds gravity when specified", () => {
      const result = optimizeImage(cloudinaryUrl, { gravity: "face", crop: "fill" });
      expect(result).toContain("g_face");
      expect(result).toContain("c_fill");
    });

    it("returns non-Cloudinary URLs unchanged", () => {
      const url = "https://example.com/image.jpg";
      expect(optimizeImage(url)).toBe(url);
    });

    it("returns empty string for empty input", () => {
      expect(optimizeImage("")).toBe("");
    });
  });

  describe("generateSrcSet", () => {
    it("generates srcSet with default widths", () => {
      const result = generateSrcSet(cloudinaryUrl);
      expect(result).toContain("320w");
      expect(result).toContain("640w");
      expect(result).toContain("1280w");
    });

    it("generates srcSet with custom widths", () => {
      const result = generateSrcSet(cloudinaryUrl, [400, 800]);
      expect(result).toContain("400w");
      expect(result).toContain("800w");
      expect(result).not.toContain("320w");
    });

    it("returns empty string for non-Cloudinary URLs", () => {
      expect(generateSrcSet("https://example.com/img.jpg")).toBe("");
    });
  });

  describe("getBlurPlaceholder", () => {
    it("generates a tiny low-quality placeholder", () => {
      const result = getBlurPlaceholder(cloudinaryUrl);
      expect(result).toContain("w_20");
      expect(result).toContain("q_30");
      expect(result).toContain("f_webp");
    });
  });
});
