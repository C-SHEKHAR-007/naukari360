"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const SyllabusSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleHi: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  postId: z.string().nullable().optional(),
  markdownContent: z.string().optional(),
  content: z.any().optional(), // Will be JSON array of sections
});

export async function createSyllabus(formData: z.infer<typeof SyllabusSchema>) {
  const result = SyllabusSchema.safeParse(formData);
  
  if (!result.success) {
    return { error: "Validation failed" };
  }

  try {
    const existing = await prisma.syllabus.findUnique({
      where: { slug: result.data.slug },
    });

    if (existing) {
      return { error: "A syllabus with this slug already exists." };
    }

    await prisma.syllabus.create({
      data: {
        titleEn: result.data.titleEn,
        titleHi: result.data.titleHi,
        slug: result.data.slug,
        postId: result.data.postId || null,
        markdownContent: result.data.markdownContent,
        content: result.data.content,
      },
    });

    revalidatePath("/admin/syllabuses");
    revalidatePath("/syllabus");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create syllabus:", error);
    return { error: "Internal Server Error" };
  }
}

export async function updateSyllabus(id: string, formData: z.infer<typeof SyllabusSchema>) {
  const result = SyllabusSchema.safeParse(formData);
  
  if (!result.success) {
    return { error: "Validation failed" };
  }

  try {
    const existing = await prisma.syllabus.findUnique({
      where: { slug: result.data.slug },
    });

    if (existing && existing.id !== id) {
      return { error: "Another syllabus with this slug already exists." };
    }

    await prisma.syllabus.update({
      where: { id },
      data: {
        titleEn: result.data.titleEn,
        titleHi: result.data.titleHi,
        slug: result.data.slug,
        postId: result.data.postId || null,
        markdownContent: result.data.markdownContent,
        content: result.data.content,
      },
    });

    revalidatePath("/admin/syllabuses");
    revalidatePath(`/syllabus/${result.data.slug}`);
    revalidatePath("/syllabus");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update syllabus:", error);
    return { error: "Internal Server Error" };
  }
}

export async function deleteSyllabus(id: string) {
  try {
    await prisma.syllabus.delete({
      where: { id },
    });
    revalidatePath("/admin/syllabuses");
    revalidatePath("/syllabus");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete syllabus:", error);
    return { error: "Failed to delete syllabus" };
  }
}
