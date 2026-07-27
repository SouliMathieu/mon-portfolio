"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleMessageRead(id: number, isRead: boolean) {
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: number) {
  await prisma.contactMessage.delete({ where: { id } });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}