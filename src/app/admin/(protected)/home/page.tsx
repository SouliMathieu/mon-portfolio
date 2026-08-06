import { prisma } from "@/lib/prisma";
import HeroContentForm from "@/components/admin/home/HeroContentForm";

export default async function AdminHomePage() {
  const heroContent = await prisma.heroContent.findFirst();

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Accueil
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        Texte du Hero (page d&apos;accueil)
      </p>

      <HeroContentForm heroContent={heroContent} />
    </div>
  );
}