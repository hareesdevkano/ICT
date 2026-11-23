import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://wa.me/2349073733790?text=Hello%20Dual%20Intelligence";

export const WhatsAppFab = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 bg-[hsl(142_70%_45%)] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
    style={{ marginBottom: "env(safe-area-inset-bottom)" }}
  >
    <MessageCircle className="w-5 h-5" />
    <span className="text-xs tracking-[0.2em] uppercase font-medium hidden sm:inline">WhatsApp</span>
  </a>
);

const links = [
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/case-studies", label: "Work" },
  { to: "/#contact", label: "Contact" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border shadow-[0_8px_30px_hsl(220_35%_2%/0.5)]"
          : "backdrop-blur-md bg-background/30 border-b border-border/40"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <nav
        className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 transition-all duration-300 ${
          scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-[11px] sm:text-sm tracking-widest min-w-0"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0 rounded-full bg-primary glow-primary animate-pulse" />
          <span className="truncate">
            DUAL <span className="text-primary">INTELLIGENCE</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-xs tracking-[0.2em] uppercase text-muted-foreground">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative py-1 hover:text-foreground transition-colors ${
                  isActive ? "text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-primary" : ""
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group hidden h-10 rounded-sm border-foreground/20 bg-transparent px-4 text-xs uppercase tracking-[0.1em] hover:bg-foreground hover:text-background lg:inline-flex"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Start Project <ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45" />
            </a>
          </Button>

          <Button asChild size="icon" className="h-11 w-11 rounded-full lg:hidden" aria-label="Start a project on WhatsApp">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" title="Start a project on WhatsApp">
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-full border border-border/60 bg-card/40 active:scale-95 transition"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-sm p-0 bg-background/95 backdrop-blur-xl border-l border-border [&>button]:hidden"
          >
            <div className="flex flex-col h-full" style={{ paddingTop: "env(safe-area-inset-top)" }}>
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/50">
                <span className="font-display font-bold text-sm tracking-widest">
                  DUAL <span className="text-primary">INTELLIGENCE</span>
                </span>
                <SheetClose asChild>
                  <button
                    className="inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-full border border-border/60 active:scale-95 transition"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </SheetClose>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col p-5">
                {links.map((l, i) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-baseline justify-between gap-4 font-display font-bold text-[clamp(1.6rem,8vw,2.25rem)] uppercase tracking-tight py-4 border-b border-border/50 transition-colors ${
                        isActive ? "text-primary" : "hover:text-primary"
                      }`
                    }
                  >
                    <span>{l.label}</span>
                    <span className="font-sans text-[10px] tracking-[0.3em] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </NavLink>
                ))}
              </div>
              <div
                className="p-5 border-t border-border/50 space-y-3"
                style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
              >
                <Link
                  to="/#contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border border-foreground/20 px-6 py-4 text-xs tracking-[0.25em] uppercase"
                >
                  Start Project <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[hsl(142_70%_45%)] text-white px-6 py-4 rounded-full font-medium text-sm tracking-wide"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};


export const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid md:grid-cols-4 gap-8 text-sm">
      <div className="md:col-span-2">
        <div className="font-display font-bold tracking-widest mb-4">
          DUAL <span className="text-primary">INTELLIGENCE</span>
        </div>
        <p className="text-muted-foreground max-w-xs">
          ICT, Software, Cybersecurity, Branding, Project Sites & Digital Marketing. Headquartered in Kano, Nigeria.
        </p>
      </div>
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Explore</p>
        <ul className="space-y-2">
          <li><Link to="/services" className="text-foreground/80 hover:text-primary">Services</Link></li>
          <li><Link to="/about" className="text-foreground/80 hover:text-primary">About</Link></li>
          <li><Link to="/case-studies" className="text-foreground/80 hover:text-primary">Case Studies</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Contact</p>
        <p className="text-foreground/80">
          <a href="mailto:hareesabdulkadir@gmail.com" className="hover:text-primary">hareesabdulkadir@gmail.com</a>
        </p>
        <p className="text-foreground/80">
          <a href="https://wa.me/2349073733790" target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp +234 907 373 3790</a>
        </p>
        <p className="text-foreground/80">Kano, Nigeria</p>
      </div>
    </div>
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-12 flex justify-between text-xs text-muted-foreground tracking-[0.2em] uppercase">
      <span>© {new Date().getFullYear()} Dual Intelligence ICT</span>
      <span>Made in Kano</span>
    </div>
  </footer>
);

export const PageHeader = ({
  eyebrow,
  title,
  highlight,
  intro,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: string;
}) => (
  <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-28 overflow-hidden border-b border-border">
    <div className="absolute inset-0 bg-grid opacity-10" />
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse at top, hsl(188 95% 55% / 0.12), transparent 60%)" }}
    />
    <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
      <p className="text-xs tracking-[0.4em] uppercase text-primary mb-6 flex items-center gap-3">
        <span className="w-8 h-px bg-primary" /> {eyebrow}
      </p>
      <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-8xl xl:text-[9rem] leading-[0.85] uppercase tracking-tighter">
        {title} {highlight && <span className="gradient-text">{highlight}</span>}
      </h1>
      {intro && <p className="mt-8 max-w-2xl text-base lg:text-xl text-muted-foreground leading-relaxed">{intro}</p>}
    </div>
  </section>
);
