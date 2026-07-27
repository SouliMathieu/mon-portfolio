import Image from "next/image";
import { Award, ExternalLink, FileText } from "lucide-react";
import Card from "@/components/ui/Card";

type CertificationItem = {
  title: string;
  issuer: string;
  date: string;
  url: string | null;
  fileUrl: string | null;
};

type CertificationsProps = {
  certifications: CertificationItem[];
  heading: string;
};

function isPdf(url: string | null) {
  return !!url && url.toLowerCase().endsWith(".pdf");
}

export default function Certifications({
  certifications,
  heading,
}: CertificationsProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h2 className="font-display text-2xl font-semibold text-offwhite mb-6">
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certifications.map((cert, i) => (
          <Card key={i} className="flex items-start gap-3">
            {cert.fileUrl ? (
              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg overflow-hidden bg-navy-light shrink-0 relative flex items-center justify-center"
                aria-label="Voir le fichier du certificat"
              >
                {isPdf(cert.fileUrl) ? (
                  <FileText className="w-5 h-5 text-ndvi" />
                ) : (
                  <Image
                    src={cert.fileUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
              </a>
            ) : (
              <Award className="w-5 h-5 text-ndvi shrink-0 mt-0.5" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-offwhite">
                {cert.title}
              </p>
              <p className="text-xs text-offwhite/60 font-mono mt-0.5">
                {cert.issuer} · {cert.date}
              </p>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-ndvi hover:opacity-80 transition-opacity mt-2"
                >
                  Vérifier <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}