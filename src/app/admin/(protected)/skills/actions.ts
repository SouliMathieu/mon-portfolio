"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  );
}

function revalidateSkillsPaths() {
  revalidatePath("/admin/skills");
  revalidatePath("/fr/skills");
  revalidatePath("/en/skills");
}

export async function updateSkillBlock(id: number, formData: FormData) {
  const titleFr = (formData.get("titleFr") as string)?.trim();
  const titleEn = (formData.get("titleEn") as string)?.trim();
  const descriptionFr = formData.get("descriptionFr") as string;
  const descriptionEn = formData.get("descriptionEn") as string;

  await prisma.skillBlock.update({
    where: { id },
    data: { titleFr, titleEn, descriptionFr, descriptionEn },
  });

  revalidateSkillsPaths();
}

export async function createTechnology(
  skillBlockId: number,
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const level = Number(formData.get("level"));

  if (!name) {
    throw new Error("Le nom est requis.");
  }

  try {
    await prisma.technology.create({
      data: { name, level, skillBlockId },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new Error("Cette technologie existe déjà dans ce bloc.");
    }
    throw err;
  }

  revalidateSkillsPaths();
}

export async function updateTechnology(id: number, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const level = Number(formData.get("level"));

  if (!name) {
    throw new Error("Le nom est requis.");
  }

  try {
    await prisma.technology.update({
      where: { id },
      data: { name, level },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new Error("Cette technologie existe déjà dans ce bloc.");
    }
    throw err;
  }

  revalidateSkillsPaths();
}

export async function deleteTechnology(id: number) {
  await prisma.technology.delete({ where: { id } });
  revalidateSkillsPaths();
}