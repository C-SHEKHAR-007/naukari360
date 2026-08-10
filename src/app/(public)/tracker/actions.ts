"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTrackerStatus(trackerId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.applicationTracker.update({
    where: {
      id: trackerId,
      userId: session.user.id, // Ensure they own it
    },
    data: {
      status: newStatus,
    },
  });

  revalidatePath("/tracker");
}

export async function removeTrackerItem(trackerId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.applicationTracker.delete({
    where: {
      id: trackerId,
      userId: session.user.id,
    },
  });

  revalidatePath("/tracker");
}

export async function addJobToTracker(postId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Upsert to avoid unique constraint errors if it already exists
  await prisma.applicationTracker.upsert({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId: postId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      postId: postId,
      status: "interested",
    },
  });

  revalidatePath("/tracker");
}
