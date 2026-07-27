import { prisma } from "@/lib/prisma";
import SkillBlockCard from "@/components/admin/skills/SkillBlockCard";

export default async function AdminSkillsPage() {
  const skillBlocks = await prisma.skillBlock.findMany({
    include: { technologies: { orderBy: { name: "asc" } } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Compétences
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        {skillBlocks.length} blocs
      </p>

      <div className="space-y-4">
        {skillBlocks.map((block) => (
          <SkillBlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}