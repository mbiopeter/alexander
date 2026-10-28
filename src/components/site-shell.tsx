"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Coffee,
  ChevronDown,
  Globe2,
  LayoutGrid,
  GitBranch,
  Heart,
  Menu,
  MessageCircle,
  Mail,
  X,
} from "lucide-react";
import { ThemeMenu } from "@/components/theme-menu";
import { DestinationLink, TikTokIcon } from "@/components/destination-link";
import { getGitHubUrl, getEmailDraftUrl, getLinkedInUrl } from "@/lib/links";
import { publicProjects } from "@/data/public-projects";

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
    <Link href="/" aria-label="Mbiopeter home" className="brand">
      <span className="brand-symbol" aria-hidden="true">
        m<span>.</span>
      </span>
      <span>
        mbiopeter<span className="brand-period">.</span>
      </span>
    </Link>
  );
}

function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [publicOpen, setPublicOpen] = useState(false);
  const [mobilePublicOpen, setMobilePublicOpen] = useState(false);
  const publicMenuRef = useRef<HTMLDivElement>(null);
  const publicTriggerRef = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
    setPublicOpen(false);
    setMobilePublicOpen(false);
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
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  useEffect(() => {
    if (!publicOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !publicMenuRef.current?.contains(event.target)) {
        setPublicOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPublicOpen(false);
        publicTriggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [publicOpen]);
  const closeMobileMenu = () => { setOpen(false); setMobilePublicOpen(false); };
  const publicActive = activePath(pathname, "/public-projects/") ||
    publicProjects.some((project) => activePath(pathname, project.href));

  return (
    <header ref={header} className="site-header multi-header">

      <div className="shell header-inner">

        <Logo />
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) => (
            <div className="nav-link-slot" key={link.href}>
              <Link
                href={link.href}
                aria-keyshortcuts={link.href === "/playground/" ? "Control+. Meta+." : undefined}
                title={link.href === "/playground/" ? "Coding playground · Ctrl + . / ⌘ + ." : undefined}
                aria-current={activePath(pathname, link.href) ? "page" : undefined}>
                {link.label}
              </Link>
              {link.href === "/projects/" && (
                <div
                  ref={publicMenuRef}
                  className="nav-projects"
                  onMouseEnter={() => setPublicOpen(true)}
                  onMouseLeave={() => setPublicOpen(false)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setPublicOpen(false);
                  }}>
                  <button
                    ref={publicTriggerRef}
                    type="button"
                    className={`nav-projects-trigger${publicActive ? " nav-projects-current" : ""}`}
                    aria-expanded={publicOpen}
                    aria-haspopup="true"
                    aria-controls="public-projects-popover"
                    onClick={() => setPublicOpen(true)}>
                    Public Projects <ChevronDown size={14} aria-hidden="true" />
                  </button>
                  {publicOpen && (
                    <div id="public-projects-popover" className="nav-projects-popover" role="group" aria-label="Public projects">
                      <div className="nav-projects-popover-head">
                        <span className="nav-projects-eyebrow">LIVE &amp; PUBLIC BUILDS</span>
                        <strong>Explore what I&apos;m building.</strong>
                      </div>
                      {publicProjects.map((project) => (
                        <Link
                          key={project.slug}
                          className="nav-projects-item"
                          href={project.href}
                          onClick={() => setPublicOpen(false)}
                          aria-current={activePath(pathname, project.href) ? "page" : undefined}>
                          <span className="nav-projects-item-icon"><Globe2 size={18} aria-hidden="true" /></span>
                          <span className="nav-projects-item-copy"><strong>{project.name}</strong><small>{project.category}</small></span>
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      ))}
                      <Link href="/public-projects/" className="nav-projects-all" onClick={() => setPublicOpen(false)}>
                        <LayoutGrid size={15} aria-hidden="true" /> View all public projects <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="header-actions">

          <ThemeMenu />
          <DestinationLink
            destination="paystack"
            fallbackHref="/support/"
            className="button button-outline header-coffee"
            label="Buy me a coffee">
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
            onClick={() => setOpen(!open)}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>

        </div>

      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav shell"
          aria-label="Mobile navigation">
          {links.map((link) => (
            <div className="mobile-nav-slot" key={link.href}>
              <Link
                href={link.href}
                onClick={closeMobileMenu}
                aria-current={activePath(pathname, link.href) ? "page" : undefined}>
                {link.label}<ArrowUpRight size={17} />
              </Link>
              {link.href === "/projects/" && (
                <div className="mobile-public-projects">
                  <button
                    type="button"
                    className="mobile-projects-trigger"
                    aria-expanded={mobilePublicOpen}
                    aria-controls="mobile-public-projects-list"
                    onClick={() => setMobilePublicOpen((previous) => !previous)}>
                    Public Projects <ChevronDown size={17} className={mobilePublicOpen ? "mobile-projects-chevron-open" : ""} aria-hidden="true" />
                  </button>
                  {mobilePublicOpen && (
                    <div id="mobile-public-projects-list" className="mobile-projects-list">
                      {publicProjects.map((project) => (
                        <Link
                          key={project.slug}
                          href={project.href}
                          aria-current={activePath(pathname, project.href) ? "page" : undefined}
                          onClick={closeMobileMenu}>
                          <span><strong>{project.name}</strong><small>{project.category}</small></span>
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      ))}
                      <Link href="/public-projects/" onClick={closeMobileMenu}>
                        View all public projects <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <Link href="/hire/" onClick={closeMobileMenu}>Hire me <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link href="/support/" onClick={closeMobileMenu}>Support my work <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const emailUrl = getEmailDraftUrl();
  const linkedInUrl = getLinkedInUrl();
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
                label="Mbiopeter on TikTok">

                <TikTokIcon className="h-4 w-4" />

              </DestinationLink>
              {getGitHubUrl() && (
                <DestinationLink
                  destination="github"
                  className="icon-button"
                  label="Mbiopeter on GitHub">

                  <GitBranch size={17} />

                </DestinationLink>
              )}
              {emailUrl && <a href={emailUrl} className="icon-button" aria-label="Email Mbiopeter"><Mail size={18} /></a>}
              <DestinationLink
                destination="whatsapp"
                className="icon-button"
                label="Message Mbiopeter on WhatsApp">

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
              <Link href="/public-projects/">Public Projects</Link>
              <Link href="/notes/">Notes &amp; resources</Link>
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
              {emailUrl && <a href={emailUrl}>Email <Mail size={13} /></a>}
              {linkedInUrl && <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13} /><span className="sr-only"> (opens in a new tab)</span></a>}
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

          <span>© {new Date().getFullYear()} Mbiopeter. Made with care.</span>
          <Link
            href="/playground/"
            aria-keyshortcuts="Control+. Meta+."
            className="playground-shortcut-link">
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
  const learningPage = ["/learn/", "/playground/", "/notes/"].some((path) => activePath(pathname, path));

  useEffect(() => {
    document.body.dataset.learningPage = String(learningPage);
    return () => { delete document.body.dataset.learningPage; };
  }, [learningPage]);

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
      <nav className={`mobile-action-dock${learningPage ? " learning-dock" : ""}`} aria-label="Quick actions">

        <Link href="/hire/" className="button button-primary">
          <BriefcaseBusiness size={17} />
          Hire me <ArrowUpRight size={15} />
        </Link>
        <DestinationLink
          destination="paystack"
          fallbackHref="/support/"
          className="button button-outline">
          <Coffee size={18} />
          Buy me a coffee
        </DestinationLink>
      </nav>
      <DestinationLink
        destination="whatsapp"
        className={`floating-contact desktop-whatsapp${learningPage ? " learning-contact" : ""}`}
        label="Start a WhatsApp conversation">
          
        <MessageCircle size={22} />
        <span>Let’s talk</span>

      </DestinationLink>
    </>
  );
}
