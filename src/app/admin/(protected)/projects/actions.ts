"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cloudinary, uploadBuffer } from "@/lib/cloudinary";

async function saveImages(files: File[], slug: string, startOrder: number) {
  const validFiles = files.filter((f) => f && f.size > 0);
  if (validFiles.length === 0) return [];

  const created: { url: string; order: number }[] = [];

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, {
      folder: `portfolio/projects/${slug}`,
      resource_type: "image",
    });
    created.push({ url: result.secure_url, order: startOrder + i });
  }

  return created;
}

// Même logique que pour les certifications : on extrait le public_id à
// partir de l'URL Cloudinary standard (.../upload/v<version>/<public_id>.<ext>)
// pour pouvoir supprimer le fichier correspondant.
function publicIdFromCloudinaryUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

async function removeCloudinaryImage(url: string) {
  const publicId = publicIdFromCloudinaryUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    // Le fichier n'existe déjà plus, rien à faire.
  }
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

  // 1. Supprimer les images retirées (Cloudinary + entrée en base)
  if (deleteImageIds.length > 0) {
    const imagesToDelete = await prisma.projectImage.findMany({
      where: { id: { in: deleteImageIds } },
    });

    await Promise.all(
      imagesToDelete.map((img) => removeCloudinaryImage(img.url))
    );

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

  try {
    await cloudinary.api.delete_resources_by_prefix(
      `portfolio/projects/${slug}`,
      { resource_type: "image" }
    );
  } catch {
    // Dossier déjà vide ou inexistant côté Cloudinary, rien à faire.
  }

  revalidatePath("/admin/projects");
}