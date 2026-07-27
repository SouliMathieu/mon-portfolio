import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import ProjectRow from "@/components/admin/projects/ProjectRow";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      technologies: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
            Projets
          </h1>
          <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0]">
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nouveau projet
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-[#F4F6F8]/50 font-[var(--font-ibm-plex-mono)]">
              <th className="px-6 py-4 font-medium">Projet</th>
              <th className="px-6 py-4 font-medium">Catégorie</th>
              <th className="px-6 py-4 font-medium">Technos</th>
              <th className="px-6 py-4 font-medium">Vedette</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-[#F4F6F8]/50">
            Aucun projet pour l&apos;instant.
          </p>
        )}
      </div>
    </div>
  );
}