import CertificationForm from "@/components/admin/certifications/CertificationForm";
import { createCertification } from "@/app/admin/(protected)/certifications/actions";

export default function NewCertificationPage() {
  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Nouvelle certification
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        Titre FR/EN, organisme, date, lien
      </p>

      <CertificationForm mode="create" onSubmitAction={createCertification} />
    </div>
  );
}