import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { updateService } from "@/app/admin/(protected)/services/actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id: Number(id) },
  });

  if (!service) {
    notFound();
  }

  const boundUpdate = updateService.bind(null, service.id);

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Modifier le service
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        {service.titleFr}
      </p>

      <ServiceForm
        mode="edit"
        initialData={{
          titleFr: service.titleFr,
          titleEn: service.titleEn,
          descriptionFr: service.descriptionFr,
          descriptionEn: service.descriptionEn,
        }}
        onSubmitAction={boundUpdate}
      />
    </div>
  );
}