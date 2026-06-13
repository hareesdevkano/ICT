import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export const WhatsAppFab = () => (
  <a
    href="https://wa.me/2349073733790?text=Hello%20Dual%20Intelligence"
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 bg-[hsl(142_70%_45%)] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="text-xs tracking-[0.2em] uppercase font-medium hidden sm:inline">WhatsApp</span>
  </a>
);

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/services", label: "Services" },
    { to: "/projects", label: "Projects" },
    { to: "/about", label: "About" },
    { to: "/case-studies", label: "Work" },
    { to: "/#contact", label: "Contact" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/40 border-b border-border/50">
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-sm tracking-widest">
          <span className="w-2 h-2 rounded-full bg-primary glow-primary animate-pulse" />
          DUAL <span className="text-primary">INTELLIGENCE</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-muted-foreground">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <Link
          to="/#contact"
          className="hidden md:inline-flex group items-center gap-2 text-xs tracking-[0.2em] uppercase border border-foreground/20 px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          Start Project <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform" />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm p-0 bg-background/95 backdrop-blur-xl border-l border-border">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
                <span className="font-display font-bold text-sm tracking-widest">MENU</span>
                <SheetClose asChild>
                  <button className="inline-flex items-center justify-center w-10 h-10" aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </SheetClose>
              </div>
              <div className="flex-1 flex flex-col gap-1 p-6">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display font-bold text-3xl uppercase tracking-tight py-4 border-b border-border/50 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="p-6 border-t border-border/50">
                <a
                  href="https://wa.me/2349073733790?text=Hello%20Dual%20Intelligence"
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
