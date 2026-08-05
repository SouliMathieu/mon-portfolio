"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  cloudinary,
  uploadBuffer,
  PHOTO_PUBLIC_ID,
  CV_FR_PUBLIC_ID,
  CV_EN_PUBLIC_ID,
} from "@/lib/cloudinary";

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
    await cloudinary.uploader.destroy(PHOTO_PUBLIC_ID, {
      resource_type: "image",
    });
    photoUrl = null;
  }

  if (photoFile && photoFile.size > 0) {
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const result = await uploadBuffer(buffer, {
      public_id: PHOTO_PUBLIC_ID,
      resource_type: "image",
      overwrite: true,
      invalidate: true,
    });
    photoUrl = result.secure_url;
  }

  // CV : même public_id à chaque upload (overwrite), donc l'URL publique
  // (sans version, cf. getCvUrls dans lib/cloudinary.ts) reste identique.
  if (cvFr && cvFr.size > 0) {
    const buffer = Buffer.from(await cvFr.arrayBuffer());
    await uploadBuffer(buffer, {
      public_id: CV_FR_PUBLIC_ID,
      resource_type: "image",
      overwrite: true,
      invalidate: true,
    });
  }

  if (cvEn && cvEn.size > 0) {
    const buffer = Buffer.from(await cvEn.arrayBuffer());
    await uploadBuffer(buffer, {
      public_id: CV_EN_PUBLIC_ID,
      resource_type: "image",
      overwrite: true,
      invalidate: true,
    });
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