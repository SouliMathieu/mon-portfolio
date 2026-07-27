import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import { createProject } from "@/app/admin/(protected)/projects/actions";

export default async function NewProjectPage() {
  const skillBlocks = await prisma.skillBlock.findMany({
    include: { technologies: true },
    orderBy: { order: "asc" },
  });

  const technologies = skillBlocks.flatMap((block) =>
    block.technologies.map((t) => ({
      id: t.id,
      name: t.name,
      skillBlockTitle: block.titleFr,
    }))
  );

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Nouveau projet
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        Remplis les champs FR et EN
      </p>

      <ProjectForm
        mode="create"
        technologies={technologies}
        onSubmitAction={createProject}
      />
    </div>
  );
}