"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateHeroContent(formData: FormData) {
  const roleFr = (formData.get("roleFr") as string)?.trim() ?? "";
  const roleEn = (formData.get("roleEn") as string)?.trim() ?? "";
  const taglineFr = (formData.get("taglineFr") as string)?.trim() ?? "";
  const taglineEn = (formData.get("taglineEn") as string)?.trim() ?? "";
  const descriptionFr = formData.get("descriptionFr") as string;
  const descriptionEn = formData.get("descriptionEn") as string;

  const existing = await prisma.heroContent.findFirst();

  const data = {
    roleFr,
    roleEn,
    taglineFr,
    taglineEn,
    descriptionFr,
    descriptionEn,
  };

  if (existing) {
    await prisma.heroContent.update({ where: { id: existing.id }, data });
  } else {
    await prisma.heroContent.create({ data });
  }

  revalidatePath("/admin/home");
  revalidatePath("/fr");
  revalidatePath("/en");
}