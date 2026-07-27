import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import ServiceRow from "@/components/admin/services/ServiceRow";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
            Services
          </h1>
          <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0]">
            {services.length} service{services.length > 1 ? "s" : ""} — page
            À propos
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4DFFA0] text-[#1B2838] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nouveau service
        </Link>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => (
          <ServiceRow
            key={service.id}
            service={{
              id: service.id,
              titleFr: service.titleFr,
              descriptionFr: service.descriptionFr,
            }}
            isFirst={index === 0}
            isLast={index === services.length - 1}
          />
        ))}
      </div>

      {services.length === 0 && (
        <p className="text-sm text-[#F4F6F8]/50 text-center py-12">
          Aucun service pour l&apos;instant.
        </p>
      )}
    </div>
  );
}