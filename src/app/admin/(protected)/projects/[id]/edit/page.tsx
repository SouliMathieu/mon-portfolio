import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import { updateProject } from "@/app/admin/(protected)/projects/actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);

  const [project, skillBlocks] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      include: {
        images: { orderBy: { order: "asc" } },
        technologies: true,
      },
    }),
    prisma.skillBlock.findMany({
      include: { technologies: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const technologies = skillBlocks.flatMap((block) =>
    block.technologies.map((t) => ({
      id: t.id,
      name: t.name,
      skillBlockTitle: block.titleFr,
    }))
  );

  const boundUpdate = updateProject.bind(null, project.id);

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Modifier le projet
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        {project.titleFr}
      </p>

      <ProjectForm
        mode="edit"
        technologies={technologies}
        initialData={{
          id: project.id,
          slug: project.slug,
          titleFr: project.titleFr,
          titleEn: project.titleEn,
          categoryFr: project.categoryFr,
          categoryEn: project.categoryEn,
          descriptionFr: project.descriptionFr,
          descriptionEn: project.descriptionEn,
          demoUrl: project.demoUrl,
          codeUrl: project.codeUrl,
          featured: project.featured,
          technologyIds: project.technologies.map((t) => t.id),
          images: project.images.map((img) => ({
            id: img.id,
            url: img.url,
          })),
        }}
        onSubmitAction={boundUpdate}
      />
    </div>
  );
}