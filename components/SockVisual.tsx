import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  className?: string;
  decorative?: boolean;
};

export function SockVisual({ product, className, decorative = true }: Props) {
  const { pattern, primary, secondary, accent } = product.art;
  const id = `${product.id}-${pattern}`;

  return (
    <svg
      viewBox="0 0 220 280"
      className={className}
      role={decorative ? "img" : undefined}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `${product.name} illustration`}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={shift(primary, 18)} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={SOCK_PATH} />
        </clipPath>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="118" cy="248" rx="62" ry="10" fill="rgba(0,0,0,0.45)" />
      <path d={SOCK_PATH} fill={`url(#${id}-body)`} stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />

      <g clipPath={`url(#${id}-clip)`} filter={`url(#${id}-glow)`}>
        <PatternLayer pattern={pattern} secondary={secondary} accent={accent} />
        <path d="M58 34h92v22H58z" fill="rgba(255,255,255,0.08)" />
        <path d="M58 34h92v8H58z" fill={secondary} opacity="0.55" />
      </g>
    </svg>
  );
}

function PatternLayer({
  pattern,
  secondary,
  accent,
}: {
  pattern: Product["art"]["pattern"];
  secondary: string;
  accent: string;
}) {
  if (pattern === "circuit") {
    return (
      <>
        <path
          d="M70 70h40v2H86v40h2V88h36v2H70zM70 150h70v2H120v46h2v-46h18"
          fill="none"
          stroke={secondary}
          strokeWidth="2.2"
        />
        <circle cx="88" cy="72" r="3.5" fill={accent} />
        <circle cx="122" cy="198" r="3.5" fill={accent} />
        <circle cx="158" cy="90" r="3" fill={secondary} />
      </>
    );
  }

  if (pattern === "pulse") {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="118"
            cy="150"
            rx={28 + i * 16}
            ry={18 + i * 10}
            fill="none"
            stroke={secondary}
            strokeWidth="2"
            opacity={0.85 - i * 0.18}
          />
        ))}
        <circle cx="118" cy="150" r="8" fill={accent} />
      </>
    );
  }

  if (pattern === "flare") {
    return (
      <>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x="56"
            y={48 + i * 28}
            width="120"
            height="16"
            fill={i % 2 === 0 ? secondary : accent}
            opacity={0.55 - i * 0.04}
          />
        ))}
      </>
    );
  }

  if (pattern === "void") {
    return (
      <>
        {[
          [80, 80],
          [140, 110],
          [96, 150],
          [150, 180],
          [78, 200],
          [128, 70],
          [160, 140],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 2.2 : 1.4} fill={accent} />
        ))}
        <path
          d="M70 120c30-40 70-20 90 10"
          fill="none"
          stroke={secondary}
          strokeWidth="1.6"
          opacity="0.7"
        />
      </>
    );
  }

  if (pattern === "glacier") {
    return (
      <>
        <path d="M70 60l30 50-18 8 40 70-50-40 16-10z" fill={secondary} opacity="0.45" />
        <path d="M150 70l-24 44 20 6-36 66 48-38-14-8z" fill={accent} opacity="0.28" />
        <path
          d="M64 90l90 0M80 140h70M90 190h40"
          stroke={accent}
          strokeWidth="1"
          opacity="0.45"
        />
      </>
    );
  }

  if (pattern === "chromatic") {
    return (
      <>
        <rect x="56" y="40" width="120" height="80" fill={secondary} opacity="0.35" />
        <rect x="56" y="110" width="120" height="80" fill={accent} opacity="0.28" />
        <rect x="56" y="180" width="120" height="70" fill={secondary} opacity="0.18" />
        <path d="M60 40c40 80 80 80 120 200" fill="none" stroke={accent} strokeWidth="10" opacity="0.35" />
      </>
    );
  }

  if (pattern === "glitch") {
    return (
      <>
        <rect x="62" y="58" width="70" height="14" fill={secondary} />
        <rect x="110" y="86" width="52" height="10" fill={accent} />
        <rect x="70" y="120" width="90" height="8" fill={secondary} opacity="0.7" />
        <rect x="86" y="148" width="40" height="22" fill={accent} />
        <rect x="128" y="176" width="36" height="8" fill={secondary} />
        <rect x="68" y="200" width="76" height="12" fill={accent} opacity="0.75" />
      </>
    );
  }

  if (pattern === "ember") {
    return (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M64 ${70 + i * 26}c22 10 44-10 70 4 18 10 30 2 40-6`}
            fill="none"
            stroke={i % 2 ? accent : secondary}
            strokeWidth="3"
            opacity="0.55"
          />
        ))}
      </>
    );
  }

  if (pattern === "quiet") {
    return (
      <>
        <rect x="56" y="40" width="120" height="220" fill="rgba(255,255,255,0.18)" />
        <path d="M70 92h80" stroke={accent} strokeWidth="1.2" opacity="0.45" />
        <path d="M70 200h46" stroke={secondary} strokeWidth="1.2" opacity="0.6" />
      </>
    );
  }

  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path
          key={i}
          d={`M50 ${50 + i * 24}h140`}
          stroke={i % 2 ? secondary : accent}
          strokeWidth="10"
          opacity="0.7"
        />
      ))}
    </>
  );
}

const SOCK_PATH =
  "M64 32h84c8 0 14 6 14 14v78c0 10 4 16 14 26 16 16 26 32 26 52 0 28-24 46-54 46H96c-22 0-40-16-40-38V46c0-8 6-14 8-14z";

function shift(hex: string, amount: number) {
  const raw = hex.replace("#", "");
  const num = Number.parseInt(raw, 16);
  const r = Math.min(255, ((num >> 16) & 255) + amount);
  const g = Math.min(255, ((num >> 8) & 255) + amount);
  const b = Math.min(255, (num & 255) + amount);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
