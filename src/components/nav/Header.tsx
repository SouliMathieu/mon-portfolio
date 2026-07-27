'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LocaleSwitcher from './LocaleSwitcher';

type Props = {
  locale: string;
};

export default function Header({ locale }: Props) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/skills`, label: t('skills') },
    { href: `/${locale}/projects`, label: t('projects') },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  const indicatorTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 32 };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 bg-[#1B2838]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link
          href={`/${locale}`}
          className="font-[var(--font-space-grotesk)] text-lg text-[#F4F6F8] transition-colors hover:text-[#4DFFA0]"
        >
          Mathieu Souli
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-2 text-xs uppercase tracking-[0.08em] font-[var(--font-ibm-plex-mono)] transition-colors ${
                  active
                    ? 'text-[#4DFFA0]'
                    : 'text-[#F4F6F8]/60 hover:text-[#F4F6F8]'
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute inset-x-0 bottom-0 h-px bg-[#4DFFA0]"
                    transition={indicatorTransition}
                  />
                )}
              </Link>
            );
          })}
          <LocaleSwitcher locale={locale} />
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[#F4F6F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DFFA0]/50 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Fin trait dégradé nébuleuse à la place d'une bordure plate */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#FF6B9D]/0 via-[#7B2FF7]/50 to-[#FF8A3D]/0" />

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/5 bg-[#1B2838]/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-xs uppercase tracking-[0.08em] font-[var(--font-ibm-plex-mono)] transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#4DFFA0]/10 text-[#4DFFA0]'
                      : 'text-[#F4F6F8]/70 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-white/5 pt-3">
                <LocaleSwitcher locale={locale} />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}