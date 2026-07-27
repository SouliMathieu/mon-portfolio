"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function updateAboutContent(formData: FormData) {
  const titleFr = (formData.get("titleFr") as string)?.trim() ?? "";
  const titleEn = (formData.get("titleEn") as string)?.trim() ?? "";
  const bioFr = formData.get("bioFr") as string;
  const bioEn = formData.get("bioEn") as string;
  const highlightsFr = JSON.parse(
    (formData.get("highlightsFr") as string) || "[]"
  );
  const highlightsEn = JSON.parse(
    (formData.get("highlightsEn") as string) || "[]"
  );
  const email = (formData.get("email") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const linkedin = (formData.get("linkedin") as string)?.trim() ?? "";
  const github = (formData.get("github") as string)?.trim() ?? "";
  const location = (formData.get("location") as string)?.trim() ?? "";
  const photoFile = formData.get("photo") as File | null;
  const removePhoto = formData.get("removePhoto") === "on";
  const cvFr = formData.get("cvFr") as File | null;
  const cvEn = formData.get("cvEn") as File | null;

  const existing = await prisma.aboutContent.findFirst();

  let photoUrl: string | null = existing?.photoUrl ?? null;

  if (removePhoto && photoUrl) {
    await fs.rm(path.join(process.cwd(), "public", photoUrl), {
      force: true,
    });
    photoUrl = null;
  }

  if (photoFile && photoFile.size > 0) {
    if (photoUrl) {
      await fs.rm(path.join(process.cwd(), "public", photoUrl), {
        force: true,
      });
    }

    const dir = path.join(process.cwd(), "public", "images", "about");
    await fs.mkdir(dir, { recursive: true });
    const ext = path.extname(photoFile.name) || ".jpg";
    const filename = `photo-${Date.now()}${ext}`;
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);
    photoUrl = `/images/about/${filename}`;
  }

  // CV : toujours enregistré sous le même nom de fichier, pour que le lien
  // du bouton "Télécharger CV" sur le Hero ne change jamais.
  const documentsDir = path.join(process.cwd(), "public", "documents");
  await fs.mkdir(documentsDir, { recursive: true });

  if (cvFr && cvFr.size > 0) {
    const buffer = Buffer.from(await cvFr.arrayBuffer());
    await fs.writeFile(path.join(documentsDir, "cv-fr.pdf"), buffer);
  }

  if (cvEn && cvEn.size > 0) {
    const buffer = Buffer.from(await cvEn.arrayBuffer());
    await fs.writeFile(path.join(documentsDir, "cv-en.pdf"), buffer);
  }

  const data = {
    titleFr,
    titleEn,
    bioFr,
    bioEn,
    highlightsFr,
    highlightsEn,
    email,
    phone,
    linkedin,
    github,
    location,
    photoUrl,
  };

  if (existing) {
    await prisma.aboutContent.update({ where: { id: existing.id }, data });
  } else {
    await prisma.aboutContent.create({ data });
  }

  revalidatePath("/admin/about");
  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/fr/about");
  revalidatePath("/en/about");
}