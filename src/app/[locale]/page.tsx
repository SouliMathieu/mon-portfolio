import { prisma } from "@/lib/prisma";
import { getCvUrls } from "@/lib/cloudinary";
import Hero from "@/components/sections/Hero";
import NebulaBackground from "@/components/sections/NebulaBackground";
import GlobeLoader from "@/components/sections/GlobeLoader";
import ExpertiseCards from "@/components/sections/ExpertiseCards";
export const dynamic = "force-dynamic";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [projectsCount, technologiesCount, certificationsCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
      prisma.certification.count(),
    ]);

  const cvUrls = getCvUrls();

  const heroContent = await prisma.heroContent.findFirst();
  const heroTextProps = heroContent
    ? {
        role: locale === "en" ? heroContent.roleEn : heroContent.roleFr,
        tagline:
          locale === "en" ? heroContent.taglineEn : heroContent.taglineFr,
        description:
          locale === "en"
            ? heroContent.descriptionEn
            : heroContent.descriptionFr,
      }
    : {};

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden flex items-center">
      <NebulaBackground />
      <div className="w-full flex flex-col lg:flex-row items-center justify-between relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none lg:hidden">
          <GlobeLoader />
        </div>
        <Hero
          locale={locale}
          stats={{
            projects: projectsCount,
            technologies: technologiesCount,
            certifications: certificationsCount,
          }}
          cvUrls={cvUrls}
          {...heroTextProps}
        />
        <div className="hidden lg:block relative flex-shrink-0 pr-12">
          <GlobeLoader />
          <ExpertiseCards />
        </div>
      </div>
    </main>
  );
}