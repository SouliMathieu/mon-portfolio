"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  User,
  Mail,
  Award,
  Sparkles,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/skills", label: "Compétences", icon: Layers },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/about", label: "À propos", icon: User },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-[#141d29] border-r border-white/10 flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-[var(--font-space-grotesk)] text-lg text-[#F4F6F8]">
          Backoffice
        </p>
        <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0]">
          Mathieu Souli
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#4DFFA0]/10 text-[#4DFFA0]"
                  : "text-[#F4F6F8]/70 hover:bg-white/5 hover:text-[#F4F6F8]"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <LogoutButton />
      </div>
    </aside>
  );
}