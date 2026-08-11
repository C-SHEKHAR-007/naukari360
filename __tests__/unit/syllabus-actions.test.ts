import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSyllabus, updateSyllabus } from "@/app/(admin)/admin/(dashboard)/syllabuses/actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    syllabus: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Syllabus Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSyllabus", () => {
    it("returns error on validation failure (empty required fields)", async () => {
      const result = await createSyllabus({ titleEn: "", slug: "" } as any);
      expect(result.error).toBe("Validation failed");
    });

    it("returns error if slug already exists in database", async () => {
      vi.mocked(prisma.syllabus.findUnique).mockResolvedValue({ id: "1", slug: "test-slug" } as any);
      
      const result = await createSyllabus({
        titleEn: "Test Syllabus",
        slug: "test-slug",
      });
      
      expect(result.error).toBe("A syllabus with this slug already exists.");
    });

    it("creates successfully if data is valid and slug is unique", async () => {
      vi.mocked(prisma.syllabus.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.syllabus.create).mockResolvedValue({ id: "new-id" } as any);
      
      const formData = {
        titleEn: "Valid Syllabus",
        slug: "valid-syllabus",
        content: [{ title: "Subject 1", topics: ["Topic 1"] }]
      };
      
      const result = await createSyllabus(formData);
      
      expect(result.success).toBe(true);
      expect(prisma.syllabus.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          titleEn: "Valid Syllabus",
          slug: "valid-syllabus",
        })
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/syllabuses");
    });
  });

  describe("updateSyllabus", () => {
    it("returns error if slug conflicts with another existing syllabus", async () => {
      // Mock finding a syllabus that has the same slug but a DIFFERENT ID
      vi.mocked(prisma.syllabus.findUnique).mockResolvedValue({ id: "different-id", slug: "conflicting-slug" } as any);
      
      const result = await updateSyllabus("target-id", {
        titleEn: "Updated Title",
        slug: "conflicting-slug",
      });
      
      expect(result.error).toBe("Another syllabus with this slug already exists.");
    });

    it("updates successfully if slug belongs to the current syllabus being updated", async () => {
      // Mock finding a syllabus with the SAME ID
      vi.mocked(prisma.syllabus.findUnique).mockResolvedValue({ id: "target-id", slug: "same-slug" } as any);
      vi.mocked(prisma.syllabus.update).mockResolvedValue({ id: "target-id" } as any);
      
      const result = await updateSyllabus("target-id", {
        titleEn: "Updated Title",
        slug: "same-slug",
      });
      
      expect(result.success).toBe(true);
      expect(prisma.syllabus.update).toHaveBeenCalledWith({
        where: { id: "target-id" },
        data: expect.objectContaining({
          titleEn: "Updated Title",
        })
      });
    });
  });
});
