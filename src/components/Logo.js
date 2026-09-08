// Wordmark de Firentur para las cabeceras del sitio. Usa un ícono simple en
// vez del logo oficial (que es un archivo de imagen de la agencia).
export default function Logo({ subtitle }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path
            d="M21 3 3 10.5l7 2.5 2 7L21 3Z"
            fill="var(--accent)"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-heading text-lg font-bold text-brand">
          Firentur
        </span>
        {subtitle && (
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
