import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import AboutForm from "@/components/admin/about/AboutForm";

type HighlightItem = { title: string; period: string; description: string };

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export default async function AdminAboutPage() {
  const about = await prisma.aboutContent.findFirst();

  const documentsDir = path.join(process.cwd(), "public", "documents");
  const [hasCvFr, hasCvEn] = await Promise.all([
    fileExists(path.join(documentsDir, "cv-fr.pdf")),
    fileExists(path.join(documentsDir, "cv-en.pdf")),
  ]);

  const initialData = {
    titleFr: about?.titleFr ?? "",
    titleEn: about?.titleEn ?? "",
    bioFr: about?.bioFr ?? "",
    bioEn: about?.bioEn ?? "",
    highlightsFr: (about?.highlightsFr as HighlightItem[]) ?? [],
    highlightsEn: (about?.highlightsEn as HighlightItem[]) ?? [],
    email: about?.email ?? "",
    phone: about?.phone ?? "",
    linkedin: about?.linkedin ?? "",
    github: about?.github ?? "",
    location: about?.location ?? "",
    photoUrl: about?.photoUrl ?? null,
    hasCvFr,
    hasCvEn,
  };

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        À propos
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        Titre, bio, temps forts, coordonnées et CV
      </p>

      <AboutForm initialData={initialData} />
    </div>
  );
}