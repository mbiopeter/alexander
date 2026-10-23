"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Coffee,
  GitBranch,
  Heart,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { ThemeMenu } from "@/components/theme-menu";
import { DestinationLink, TikTokIcon } from "@/components/destination-link";
import { getGitHubUrl } from "@/lib/links";

const links = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/projects/", label: "Projects" },
  { href: "/learn/", label: "Learn" },
  { href: "/playground/", label: "Playground" },
  { href: "/about/", label: "About" },
];
function activePath(current: string, href: string) {
  return href === "/"
    ? current === "/"
    : current === href.slice(0, -1) || current.startsWith(href);
}

export function Logo() {
  return (
    <Link href="/" aria-label="Alexender home" className="brand">
      <span className="brand-symbol" aria-hidden="true">
        a<span>.</span>
      </span>
      <span>
        alexender<span className="brand-period">.</span>
      </span>
    </Link>
  );
}

function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="site-header multi-header">
      <div className="shell header-inner">
        <Logo />
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-keyshortcuts={
                link.href === "/playground/" ? "Control+. Meta+." : undefined
              }
              title={
                link.href === "/playground/"
                  ? "Coding playground · Ctrl + . / ⌘ + ."
                  : undefined
              }
              aria-current={
                activePath(pathname, link.href) ? "page" : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeMenu />
          <DestinationLink
            destination="paystack"
            fallbackHref="/support/"
            className="button button-outline header-coffee"
            label="Buy me a coffee"
          >
            <Coffee size={16} />
            <span>Buy me a coffee</span>
          </DestinationLink>
          <Link href="/hire/" className="button button-primary header-hire">
            Hire me <ArrowUpRight size={16} />
          </Link>
          <button
            ref={trigger}
            type="button"
            className="icon-button mobile-menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav shell"
          aria-label="Mobile navigation"
        >
          {[
            ...links,
            { href: "/hire/", label: "Hire me" },
            { href: "/support/", label: "Support my work" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={
                activePath(pathname, link.href) ? "page" : undefined
              }
            >
              {link.label}
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer multi-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Thoughtful websites. Useful software.
              <br />
              Code that makes things click.
            </p>
            <div className="footer-socials">
              <DestinationLink
                destination="tiktok"
                className="icon-button"
                label="Alexender on TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </DestinationLink>
              {getGitHubUrl() && (
                <DestinationLink
                  destination="github"
                  className="icon-button"
                  label="Alexender on GitHub"
                >
                  <GitBranch size={17} />
                </DestinationLink>
              )}
              <DestinationLink
                destination="whatsapp"
                className="icon-button"
                label="Message Alexender on WhatsApp"
              >
                <MessageCircle size={18} />
              </DestinationLink>
            </div>
          </div>
          <div>
            <h2>Explore</h2>
            <nav aria-label="Footer navigation">
              {links.slice(1).map((link) => (
                <Link href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2>Let’s connect</h2>
            <nav aria-label="Contact and support">
              <Link href="/hire/">
                Hire me <ArrowUpRight size={13} />
              </Link>
              <Link href="/support/">
                Support my work <Heart size={13} />
              </Link>
              <DestinationLink destination="whatsapp">
                WhatsApp <ArrowUpRight size={13} />
              </DestinationLink>
              <DestinationLink destination="paystack" fallbackHref="/support/">
                Buy me a coffee <Coffee size={13} />
              </DestinationLink>
            </nav>
          </div>
          <div className="footer-mini-note">
            <span aria-hidden="true">✳</span>
            <p>
              Have a little idea?
              <br />
              <strong>Let’s make it something.</strong>
            </p>
            <Link href="/hire/" className="text-link">
              Start a conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alexender. Made with care.</span>
          <Link
            href="/playground/"
            aria-keyshortcuts="Control+. Meta+."
            className="playground-shortcut-link"
          >
            Coding playground <kbd>Ctrl + .</kbd>
          </Link>
          <Link href="/privacy/">Privacy</Link>
          <Link href="/support/">
            Thank you for supporting independent work <Heart size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function openPlayground(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        !(event.ctrlKey || event.metaKey) ||
        event.altKey ||
        event.shiftKey ||
        event.key !== "." ||
        document.querySelector(".detour-playground")
      )
        return;

      const target = event.target;
      // Keep typing, form fields, and Monaco's own quick-fix shortcut intact.
      if (
        target instanceof Element &&
        target.closest(
          'input, textarea, select, [contenteditable="true"], [contenteditable=""], [role="textbox"], .monaco-editor',
        )
      )
        return;

      event.preventDefault();
      if (!activePath(pathname, "/playground/")) router.push("/playground/");
    }

    document.addEventListener("keydown", openPlayground);
    return () => document.removeEventListener("keydown", openPlayground);
  }, [pathname, router]);

  return (
    <>
      <Header />
      {children}
      <Footer />
      <nav className="mobile-action-dock" aria-label="Quick actions">
        <Link href="/hire/" className="button button-primary">
          <BriefcaseBusiness size={17} />
          Hire me <ArrowUpRight size={15} />
        </Link>
        <DestinationLink
          destination="paystack"
          fallbackHref="/support/"
          className="button button-accent"
        >
          <Coffee size={18} />
          Buy me a coffee
        </DestinationLink>
      </nav>
      <DestinationLink
        destination="whatsapp"
        className="floating-contact desktop-whatsapp"
        label="Start a WhatsApp conversation"
      >
        <MessageCircle size={22} />
        <span>Let’s talk</span>
      </DestinationLink>
    </>
  );
}
