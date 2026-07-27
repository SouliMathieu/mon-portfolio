"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

async function saveImages(files: File[], slug: string, startOrder: number) {
  const validFiles = files.filter((f) => f && f.size > 0);
  if (validFiles.length === 0) return [];

  const dir = path.join(process.cwd(), "public", "images", "projects", slug);
  await fs.mkdir(dir, { recursive: true });

  const created: { url: string; order: number }[] = [];

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${i}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);
    created.push({
      url: `/images/projects/${slug}/${filename}`,
      order: startOrder + i,
    });
  }

  return created;
}

function getTextFields(formData: FormData) {
  return {
    slug: (formData.get("slug") as string)?.trim(),
    titleFr: (formData.get("titleFr") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim(),
    categoryFr: formData.get("categoryFr") as string,
    categoryEn: formData.get("categoryEn") as string,
    descriptionFr: formData.get("descriptionFr") as string,
    descriptionEn: formData.get("descriptionEn") as string,
    demoUrl: (formData.get("demoUrl") as string)?.trim() || null,
    codeUrl: (formData.get("codeUrl") as string)?.trim() || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createProject(formData: FormData) {
  const fields = getTextFields(formData);
  const technologyIds = formData
    .getAll("technologyIds")
    .map((id) => Number(id));
  const images = formData.getAll("images") as File[];

  const project = await prisma.project.create({
    data: {
      ...fields,
      technologies: { connect: technologyIds.map((id) => ({ id })) },
    },
  });

  const savedImages = await saveImages(images, fields.slug, 0);

  if (savedImages.length > 0) {
    await prisma.projectImage.createMany({
      data: savedImages.map((img) => ({
        projectId: project.id,
        url: img.url,
        order: img.order,
      })),
    });
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: number, formData: FormData) {
  const fields = getTextFields(formData);
  const technologyIds = formData
    .getAll("technologyIds")
    .map((id) => Number(id));
  const deleteImageIds = formData
    .getAll("deleteImageIds")
    .map((v) => Number(v));
  const images = formData.getAll("images") as File[];

  const imageOrderIds: number[] = JSON.parse(
    (formData.get("imageOrderIds") as string) || "[]"
  );

  // 1. Supprimer les images retirées (fichier + entrée en base)
  if (deleteImageIds.length > 0) {
    const imagesToDelete = await prisma.projectImage.findMany({
      where: { id: { in: deleteImageIds } },
    });

    for (const img of imagesToDelete) {
      const filePath = path.join(process.cwd(), "public", img.url);
      await fs.rm(filePath, { force: true });
    }

    await prisma.projectImage.deleteMany({
      where: { id: { in: deleteImageIds } },
    });
  }

  // 2. Appliquer le nouvel ordre des images existantes restantes
  //    (ex: "Définir comme image principale" -> passe en order 0)
  await Promise.all(
    imageOrderIds
      .filter((imgId) => !deleteImageIds.includes(imgId))
      .map((imgId, index) =>
        prisma.projectImage.update({
          where: { id: imgId },
          data: { order: index },
        })
      )
  );

  // 3. Ajouter les nouvelles images à la suite des images existantes
  const savedImages = await saveImages(
    images,
    fields.slug,
    imageOrderIds.length
  );

  await prisma.project.update({
    where: { id },
    data: {
      ...fields,
      technologies: { set: technologyIds.map((tid) => ({ id: tid })) },
      ...(savedImages.length > 0 && {
        images: {
          createMany: {
            data: savedImages.map((img) => ({
              url: img.url,
              order: img.order,
            })),
          },
        },
      }),
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect("/admin/projects");
}

export async function deleteProject(id: number, slug: string) {
  await prisma.project.delete({ where: { id } });

  const projectDir = path.join(
    process.cwd(),
    "public",
    "images",
    "projects",
    slug
  );

  try {
    await fs.rm(projectDir, { recursive: true, force: true });
  } catch {
    // Le dossier n'existe déjà plus, rien à faire.
  }

  revalidatePath("/admin/projects");
}