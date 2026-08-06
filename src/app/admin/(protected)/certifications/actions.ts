"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cloudinary, uploadBuffer } from "@/lib/cloudinary";

function getFields(formData: FormData) {
  return {
    titleFr: (formData.get("titleFr") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim(),
    issuer: (formData.get("issuer") as string)?.trim(),
    date: new Date(formData.get("date") as string),
    url: (formData.get("url") as string)?.trim() || null,
  };
}

function revalidateCertificationPaths() {
  revalidatePath("/admin/certifications");
  revalidatePath("/fr/about");
  revalidatePath("/en/about");
}

async function saveCertificationFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadBuffer(buffer, {
    folder: "portfolio/certifications",
    resource_type: "image", // Cloudinary traite aussi les PDF comme des "image"
  });
  return result.secure_url;
}

// Les URLs qu'on génère suivent toujours le format Cloudinary standard :
// .../upload/v<version>/<public_id>.<ext> — on en extrait le public_id
// pour pouvoir supprimer le fichier correspondant lors d'un remplacement
// ou d'une suppression.
function publicIdFromCloudinaryUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

async function removeCertificationFile(fileUrl: string | null) {
  if (!fileUrl) return;
  const publicId = publicIdFromCloudinaryUrl(fileUrl);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    // Le fichier n'existe déjà plus (ou ce n'est pas une URL Cloudinary
    // reconnue, ex. ancien fichier local), rien à faire de plus.
  }
}

export async function createCertification(formData: FormData) {
  const fields = getFields(formData);
  const file = formData.get("file") as File | null;

  let fileUrl: string | null = null;
  if (file && file.size > 0) {
    fileUrl = await saveCertificationFile(file);
  }

  await prisma.certification.create({ data: { ...fields, fileUrl } });

  revalidateCertificationPaths();
  redirect("/admin/certifications");
}

export async function updateCertification(id: number, formData: FormData) {
  const fields = getFields(formData);
  const file = formData.get("file") as File | null;
  const removeFile = formData.get("removeFile") === "on";

  const existing = await prisma.certification.findUnique({ where: { id } });
  let fileUrl: string | null = existing?.fileUrl ?? null;

  if (removeFile && fileUrl) {
    await removeCertificationFile(fileUrl);
    fileUrl = null;
  }

  if (file && file.size > 0) {
    await removeCertificationFile(fileUrl);
    fileUrl = await saveCertificationFile(file);
  }

  await prisma.certification.update({
    where: { id },
    data: { ...fields, fileUrl },
  });

  revalidateCertificationPaths();
  redirect("/admin/certifications");
}

export async function deleteCertification(id: number) {
  const existing = await prisma.certification.findUnique({ where: { id } });
  await removeCertificationFile(existing?.fileUrl ?? null);

  await prisma.certification.delete({ where: { id } });
  revalidateCertificationPaths();
}