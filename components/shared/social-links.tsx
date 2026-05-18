import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/shared/brand-icons";

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

const socials = [
  { href: siteConfig.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: siteConfig.links.github, label: "GitHub", Icon: GitHubIcon },
  { href: siteConfig.links.twitter, label: "Twitter", Icon: TwitterIcon },
  { href: siteConfig.links.instagram, label: "Instagram", Icon: InstagramIcon },
] as const;

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {socials.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400",
            iconClassName
          )}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
