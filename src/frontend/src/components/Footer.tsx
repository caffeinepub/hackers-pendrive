import { Link } from "@tanstack/react-router";
import { Mail, Phone, Zap } from "lucide-react";

const currentYear = new Date().getFullYear();
const hostname = typeof window !== "undefined" ? window.location.hostname : "";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-base tracking-tight text-foreground">
                HACKER'S<span className="text-primary"> PENDRIVE</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              32GB USB drive loaded with 125+ professional ethical hacking and
              cybersecurity tools. Built for penetration testers, security
              researchers, and CTF players.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm tracking-widest text-primary uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" as const },
                { label: "Checkout", to: "/checkout" as const },
                { label: "Track Order", to: "/orders" as const },
                { label: "My Orders", to: "/customer" as const },
                { label: "Contact", to: "/contact" as const },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm tracking-widest text-primary uppercase">
              Contact
            </h4>
            <a
              href="mailto:gauravsaswade2009@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              data-ocid="footer-email"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              gauravsaswade2009@gmail.com
            </a>
            <a
              href="tel:+919270556455"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              data-ocid="footer-phone"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              +91 9270556455
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Hacker's Pendrive. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
