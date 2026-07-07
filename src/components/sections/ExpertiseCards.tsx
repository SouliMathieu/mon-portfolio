"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { Code2, MapPinned, BrainCircuit, Satellite } from "lucide-react";

export default function ExpertiseCards() {
  const t = useTranslations("hero.expertise");

  const items = [
    { icon: Code2, label: t("fullstack") },
    { icon: MapPinned, label: t("gis") },
    { icon: BrainCircuit, label: t("geoai") },
    { icon: Satellite, label: t("satellite") },
  ];

  const positions = [
    "top-4 left-4",
    "top-4 right-4",
    "bottom-4 left-4",
    "bottom-4 right-4",
  ];

  return (
    <>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            className={`absolute ${positions[i]} z-10`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
          >
            <Card className="!p-3 flex items-center gap-2">
              <Icon className="w-4 h-4 text-ndvi" />
              <span className="text-xs font-mono text-offwhite/90 whitespace-nowrap">
                {item.label}
              </span>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
}