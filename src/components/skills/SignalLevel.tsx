type Props = {
  level: number; // 1–5
  locale: string;
};

const MAX_LEVEL = 5;

/**
 * Indicateur de niveau de maîtrise en forme de "barres de signal" (façon
 * réception satellite / radar), plutôt qu'une progress bar générique.
 * Purement décoratif + accessible via role="img" et aria-label.
 */
export default function SignalLevel({ level, locale }: Props) {
  const clamped = Math.min(Math.max(level, 0), MAX_LEVEL);
  const label =
    locale === 'fr'
      ? `Niveau ${clamped} sur ${MAX_LEVEL}`
      : `Level ${clamped} of ${MAX_LEVEL}`;

  return (
    <div
      className="flex items-end gap-1"
      role="img"
      aria-label={label}
      title={label}
    >
      {Array.from({ length: MAX_LEVEL }).map((_, i) => {
        const filled = i < clamped;
        const height = 6 + i * 3; // 6px .. 18px, barres croissantes

        return (
          <span
            key={i}
            style={{ height }}
            className={`w-1.5 rounded-sm transition-colors duration-300 ${
              filled ? 'bg-[#4DFFA0]' : 'bg-white/10'
            }`}
          />
        );
      })}
    </div>
  );
}