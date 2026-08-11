"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSyllabusTopic(syllabusId: string, topic: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Find existing progress
  const progress = await prisma.syllabusProgress.findUnique({
    where: {
      userId_syllabusId: {
        userId,
        syllabusId,
      },
    },
  });

  let completedTopics: string[] = [];

  if (progress && progress.completedTopics) {
    completedTopics = (progress.completedTopics as string[]) || [];
  }

  const isCompleted = completedTopics.includes(topic);

  if (isCompleted) {
    completedTopics = completedTopics.filter((t) => t !== topic);
    
    await prisma.syllabusProgress.update({
      where: {
        userId_syllabusId: {
          userId,
          syllabusId,
        },
      },
      data: {
        completedTopics,
      },
    });
  } else {
    completedTopics.push(topic);
    
    try {
      await prisma.syllabusProgress.upsert({
        where: {
          userId_syllabusId: {
            userId,
            syllabusId,
          }
        },
        update: {
          completedTopics
        },
        create: {
          userId,
          syllabusId,
          completedTopics
        }
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new Error("Your session has expired or your user account no longer exists in the database. Please log out and log back in.");
      }
      throw error;
    }
  }

  revalidatePath(`/syllabus/[slug]`, "page");
  revalidatePath(`/post/[slug]/syllabus`, "page");
}

export async function syncSyllabusProgress(syllabusId: string, completedTopics: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.syllabusProgress.upsert({
    where: {
      userId_syllabusId: {
        userId: session.user.id,
        syllabusId,
      },
    },
    update: {
      completedTopics,
    },
    create: {
      userId: session.user.id,
      syllabusId,
      completedTopics,
    },
  });
}
