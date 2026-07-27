import ServiceForm from "@/components/admin/services/ServiceForm";
import { createService } from "@/app/admin/(protected)/services/actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Nouveau service
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        Titre et description FR/EN
      </p>

      <ServiceForm mode="create" onSubmitAction={createService} />
    </div>
  );
}