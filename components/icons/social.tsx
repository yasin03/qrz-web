import type { SVGProps } from "react";
import type { SocialNetwork } from "@/config/site";

// lucide-react 1.x marka ikonlarını içermiyor; footer.html'deki çizgi ikonları (currentColor).
const PATHS: Record<SocialNetwork, React.ReactNode> = {
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  youtube: (
    <>
      <rect width="20" height="14" x="2" y="5" rx="4" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
};

export function SocialIcon({
  network,
  ...props
}: { network: SocialNetwork } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {PATHS[network]}
    </svg>
  );
}
