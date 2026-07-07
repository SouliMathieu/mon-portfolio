import { Mail, Phone, MapPin } from "lucide-react";
import Card from "@/components/ui/Card";

const contactDetails = {
  email: "souli.mathieu@etu.uae.ac.ma",
  phone: "+212 688 192 586",
  linkedin: "https://linkedin.com/in/mathieu-souli",
  github: "https://github.com/SouliMathieu",
  location: "Tanger, Maroc",
};

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

export default function ContactInfo() {
  const items: ContactItem[] = [
    {
      icon: <Mail className="w-4 h-4" />,
      label: contactDetails.email,
      href: "mailto:" + contactDetails.email,
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: contactDetails.phone,
      href: "tel:" + contactDetails.phone.replace(/\s/g, ""),
    },
    {
      icon: <LinkedinIcon />,
      label: "LinkedIn",
      href: contactDetails.linkedin,
    },
    {
      icon: <GithubIcon />,
      label: "GitHub",
      href: contactDetails.github,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: contactDetails.location,
      href: undefined,
    },
  ];

  return (
    <Card className="max-w-md">
      <ul className="space-y-4">
        {items.map((item) => {
          const isExternal = item.href ? item.href.startsWith("http") : false;
          const content = (
            <div className="flex items-center gap-3">
              <span className="text-ndvi">{item.icon}</span>
              <span className="text-sm text-offwhite/80">{item.label}</span>
            </div>
          );
          if (!item.href) {
            return <li key={item.label}>{content}</li>;
          }
          return (
            <li key={item.label}>
              <a
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="hover:text-ndvi transition-colors"
              >
                {content}
              </a>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}