"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

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
  const dir = path.join(
    process.cwd(),
    "public",
    "documents",
    "certifications"
  );
  await fs.mkdir(dir, { recursive: true });
  const ext = path.extname(file.name) || "";
  const filename = `cert-${Date.now()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/documents/certifications/${filename}`;
}

async function removeCertificationFile(fileUrl: string | null) {
  if (!fileUrl) return;
  try {
    await fs.rm(path.join(process.cwd(), "public", fileUrl), {
      force: true,
    });
  } catch {
    // Le fichier n'existe déjà plus, rien à faire.
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