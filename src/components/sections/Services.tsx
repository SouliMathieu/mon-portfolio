import { Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";

type ServiceItem = {
  title: string;
  description: string;
};

type ServicesProps = {
  services: ServiceItem[];
  heading: string;
  subheading: string;
  ctaLabel: string;
};

export default function Services({
  services,
  heading,
  subheading,
  ctaLabel,
}: ServicesProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h2 className="font-display text-2xl font-semibold text-offwhite mb-2">
        {heading}
      </h2>
      <p className="text-offwhite/60 mb-6">{subheading}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {services.map((service, i) => (
          <Card key={i} className="flex flex-col gap-2">
            <Sparkles className="w-5 h-5 text-ndvi" />
            <p className="text-sm font-semibold text-offwhite">
              {service.title}
            </p>
            <p className="text-xs text-offwhite/60 leading-relaxed">
              {service.description}
            </p>
          </Card>
        ))}
      </div>

      <a
        href="#contact"
        className="btn-pill inline-flex items-center gap-2 bg-ndvi text-navy hover:shadow-[0_0_24px_rgba(77,255,160,0.4)] cursor-pointer"
      >
        {ctaLabel}
      </a>
    </div>
  );
}