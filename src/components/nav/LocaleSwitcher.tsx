'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LOCALES = ['fr', 'en'] as const;

type Props = {
  locale: string;
};

export default function LocaleSwitcher({ locale }: Props) {
  const pathname = usePathname();

  // pathname inclut le préfixe de locale courant (ex: /fr/skills) — on le
  // retire pour reconstruire la même page dans l'autre langue.
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 p-1 text-xs">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${pathWithoutLocale}`}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            l === locale
              ? 'bg-[#4DFFA0]/15 text-[#4DFFA0]'
              : 'text-[#F4F6F8]/50 hover:text-[#F4F6F8]'
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}