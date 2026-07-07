import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function Hero() {
  const t = useTranslations("hero");

  const stats = [
    { value: 6, suffix: "+", label: t("stats.projects") },
    { value: 1, suffix: "", label: t("stats.hackathons") },
    { value: 10, suffix: "+", label: t("stats.technologies") },
    { value: 2, suffix: "", label: t("stats.certifications") },
  ];

  return (
    <section className="min-h-screen flex items-center px-8 md:px-16 lg:px-24">
      <div className="max-w-xl">
        <p className="font-mono text-sm text-ndvi mb-4">{t("tagline")}</p>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-offwhite leading-tight mb-4">
          {t("name")}
        </h1>

        <p className="text-lg text-offwhite/70 mb-6">{t("role")}</p>

        <p className="text-offwhite/80 mb-10 leading-relaxed">
          {t("description")}
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <Button variant="primary">{t("cta_projects")}</Button>
          <Button variant="secondary">{t("cta_cv")}</Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-2xl font-semibold text-ndvi">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-offwhite/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}