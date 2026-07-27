"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getFields(formData: FormData) {
  return {
    titleFr: (formData.get("titleFr") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim(),
    descriptionFr: formData.get("descriptionFr") as string,
    descriptionEn: formData.get("descriptionEn") as string,
  };
}

function revalidateServicePaths() {
  revalidatePath("/admin/services");
  revalidatePath("/fr/about");
  revalidatePath("/en/about");
}

export async function createService(formData: FormData) {
  const fields = getFields(formData);

  await prisma.service.create({ data: fields });

  revalidateServicePaths();
  redirect("/admin/services");
}

export async function updateService(id: number, formData: FormData) {
  const fields = getFields(formData);

  await prisma.service.update({ where: { id }, data: fields });

  revalidateServicePaths();
  redirect("/admin/services");
}

export async function deleteService(id: number) {
  await prisma.service.delete({ where: { id } });
  revalidateServicePaths();
}

export async function reorderService(id: number, direction: "up" | "down") {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= services.length) return;

  const current = services[index];
  const swap = services[swapIndex];

  await prisma.$transaction([
    prisma.service.update({
      where: { id: current.id },
      data: { order: swap.order },
    }),
    prisma.service.update({
      where: { id: swap.id },
      data: { order: current.order },
    }),
  ]);

  revalidateServicePaths();
}