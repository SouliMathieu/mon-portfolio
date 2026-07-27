import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import CertificationRow from "@/components/admin/certifications/CertificationRow";

export default async function AdminCertificationsPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
            Certifications
          </h1>
          <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0]">
            {certifications.length} certification
            {certifications.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/certifications/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nouvelle certification
        </Link>
      </div>

      <div className="space-y-3">
        {certifications.map((cert) => (
          <CertificationRow
            key={cert.id}
            certification={{
              id: cert.id,
              titleFr: cert.titleFr,
              issuer: cert.issuer,
              date: cert.date.toISOString(),
              url: cert.url,
            }}
          />
        ))}
      </div>

      {certifications.length === 0 && (
        <p className="text-sm text-[#F4F6F8]/50 text-center py-12">
          Aucune certification pour l&apos;instant.
        </p>
      )}
    </div>
  );
}