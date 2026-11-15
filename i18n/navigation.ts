import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Site içi tüm linkler bu Link ile kurulur (dile özel href + gerçek <a>).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
