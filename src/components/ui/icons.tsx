// Small line icons used across the site and app.
const paths: Record<string, React.ReactNode> = {
  sparkle: <path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.9L12 3zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z" />,
  snow: <path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5M9 4l3 2 3-2M9 20l3-2 3 2" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  engine: <path d="M4 9h3l2-2h5l2 2h2v3h2v4h-2v2H9l-2-2H4V9zM10 7V5h4" />,
  camera: <path d="M4 8h3l2-3h6l2 3h3v11H4V8zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />,
  receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6M9 16h4" />,
  shield: <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4" />,
  globe: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />,
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
  check: <path d="M5 12l5 5L20 7" />,
  home: <path d="M3 11l9-7 9 7M5 10v10h14V10" />,
  briefcase: <path d="M4 7h16v12H4V7zM9 7V5h6v2M4 12h16" />,
  wallet: <path d="M4 6h15v13H4V6zM4 9h15M15 14h2" />,
  users: <path d="M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 010 6M18 14c1.8.7 3 2.6 3 5" />,
  chart: <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />,
  help: <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01" />,
  inbox: <path d="M3 13l3-8h12l3 8v6H3v-6zM3 13h5l1 2h6l1-2h5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  calendar: <path d="M4 6h16v14H4V6zM4 10h16M8 3v4M16 3v4" />,
  user: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />,
  clipboard: <path d="M8 4h8v3H8V4zM6 5H5v16h14V5h-1M9 12h6M9 16h4" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  pin: <path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 11a2 2 0 100-4 2 2 0 000 4z" />,
  tag: <path d="M3 12V3h9l9 9-9 9-9-9zM8 8h.01" />,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.check}
    </svg>
  );
}
