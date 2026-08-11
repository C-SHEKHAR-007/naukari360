"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSyllabusTopic(postId: string, topic: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Must be logged in to track syllabus progress");
  }

  const userId = session.user.id;

  // Find existing progress
  const progress = await prisma.syllabusProgress.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
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
  } else {
    completedTopics.push(topic);
  }

  // Upsert the record
  await prisma.syllabusProgress.upsert({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
    update: {
      completedTopics,
    },
    create: {
      userId,
      postId,
      completedTopics,
    },
  });

  // Not revalidating the whole path here to allow optimistic updates without full refresh, 
  // but if needed we can revalidate the post page.
  // revalidatePath(`/post/${slug}`); // Need slug if we want to revalidate
}

export async function syncSyllabusProgress(postId: string, topics: string[]) {
  const session = await auth();
  if (!session?.user) return;

  const userId = session.user.id;

  // Upsert the record with the merged topics
  await prisma.syllabusProgress.upsert({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
    update: {
      completedTopics: topics,
    },
    create: {
      userId,
      postId,
      completedTopics: topics,
    },
  });
}
