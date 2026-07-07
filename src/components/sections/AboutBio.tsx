import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AboutBio() {
  const t = useTranslations("about");

  return (
    <section className="flex flex-col lg:flex-row gap-12 items-start max-w-5xl mx-auto">
      <div className="flex-shrink-0 mx-auto lg:mx-0">
        <div className="relative w-64 h-64 rounded-card overflow-hidden glass-card">
          <Image
            src="/images/profile.jpg"
            alt="Mathieu Souli"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div>
        <h1 className="font-display text-4xl font-bold text-offwhite mb-6">
          {t("title")}
        </h1>
        <p className="text-offwhite/80 leading-relaxed">{t("bio")}</p>
      </div>
    </section>
  );
}