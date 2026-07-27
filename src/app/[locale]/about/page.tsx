import { prisma } from "@/lib/prisma";
import AboutBio from "@/components/sections/AboutBio";
import HighlightsCarousel from "@/components/sections/HighlightsCarousel";
import Certifications from "@/components/sections/Certifications";
import Services from "@/components/sections/Services";
import ContactInfo from "@/components/sections/ContactInfo";
import ContactForm from "@/components/sections/ContactForm";

type Highlight = { title: string; period: string; description: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const [about, certifications, services] = await Promise.all([
    prisma.aboutContent.findFirst(),
    prisma.certification.findMany({ orderBy: { date: "desc" } }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

  const title = about ? (isEn ? about.titleEn : about.titleFr) : "";
  const bio = about ? (isEn ? about.bioEn : about.bioFr) : "";
  const highlights = about
    ? ((isEn ? about.highlightsEn : about.highlightsFr) as Highlight[])
    : [];

  const certificationItems = certifications.map((cert) => ({
    title: isEn ? cert.titleEn : cert.titleFr,
    issuer: cert.issuer,
    date: cert.date.toLocaleDateString(isEn ? "en-US" : "fr-FR", {
      month: "long",
      year: "numeric",
    }),
    url: cert.url,
    fileUrl: cert.fileUrl,
  }));

  const serviceItems = services.map((service) => ({
    title: isEn ? service.titleEn : service.titleFr,
    description: isEn ? service.descriptionEn : service.descriptionFr,
  }));

  return (
    <main className="relative min-h-screen px-8 md:px-16 lg:px-24 py-24">
      <AboutBio title={title} bio={bio} photoUrl={about?.photoUrl ?? null} />
      <HighlightsCarousel highlights={highlights} />
      <Certifications
        certifications={certificationItems}
        heading="Certifications"
      />
      <Services
        services={serviceItems}
        heading="Services"
        subheading={
          isEn ? "Let's talk about your project" : "Discutons de votre projet"
        }
        ctaLabel={isEn ? "Get in touch" : "Me contacter"}
      />
      <div
        id="contact"
        className="max-w-5xl mx-auto mt-16 flex flex-col lg:flex-row gap-8 scroll-mt-24"
      >
        <ContactInfo
          email={about?.email ?? ""}
          phone={about?.phone ?? ""}
          linkedin={about?.linkedin ?? ""}
          github={about?.github ?? ""}
          location={about?.location ?? ""}
        />
        <ContactForm />
      </div>
    </main>
  );
}