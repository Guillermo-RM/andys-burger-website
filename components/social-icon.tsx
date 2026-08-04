export type SocialIconName = "instagram" | "tiktok" | "facebook";

export function SocialIcon({ icon }: { icon: SocialIconName }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2">
            <stop offset="0" stopColor="#feda75" />
            <stop offset="0.3" stopColor="#fa7e1e" />
            <stop offset="0.55" stopColor="#d62976" />
            <stop offset="0.78" stopColor="#962fbf" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#instagram-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M16.5 7.5v.01" />
        </g>
      </svg>
    );
  }

  if (icon === "tiktok") {
    const tiktokPath = "M9 12a4 4 0 1 0 4 4V4c0 3 2 5 5 5";

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={tiktokPath}
          fill="none"
          stroke="#25f4ee"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-0.6 0.4)"
        />
        <path
          d={tiktokPath}
          fill="none"
          stroke="#fe2c55"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0.6 -0.4)"
        />
        <path
          d={tiktokPath}
          fill="none"
          stroke="#fdfdfd"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2z"
        fill="none"
        stroke="#1877f2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
