import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CertificationForm from "@/components/admin/certifications/CertificationForm";
import { updateCertification } from "@/app/admin/(protected)/certifications/actions";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certification = await prisma.certification.findUnique({
    where: { id: Number(id) },
  });

  if (!certification) {
    notFound();
  }

  const boundUpdate = updateCertification.bind(null, certification.id);

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Modifier la certification
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        {certification.titleFr}
      </p>

      <CertificationForm
        mode="edit"
        initialData={{
          titleFr: certification.titleFr,
          titleEn: certification.titleEn,
          issuer: certification.issuer,
          date: certification.date.toISOString().split("T")[0],
          url: certification.url ?? "",
          fileUrl: certification.fileUrl ?? null,
        }}
        onSubmitAction={boundUpdate}
      />
    </div>
  );
}