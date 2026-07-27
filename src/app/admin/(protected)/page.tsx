import { prisma } from "@/lib/prisma";
import { FolderKanban, Layers, Mail } from "lucide-react";

export default async function AdminDashboardPage() {
  const [projectsCount, technologiesCount, unreadMessagesCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

  const stats = [
    { label: "Projets", value: projectsCount, icon: FolderKanban },
    { label: "Technologies", value: technologiesCount, icon: Layers },
    { label: "Messages non lus", value: unreadMessagesCount, icon: Mail },
  ];

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Dashboard
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        Vue d&apos;ensemble du contenu
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <Icon size={20} className="text-[#4DFFA0] mb-3" />
              <p className="text-3xl font-[var(--font-space-grotesk)] text-[#F4F6F8]">
                {stat.value}
              </p>
              <p className="text-sm text-[#F4F6F8]/60 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}