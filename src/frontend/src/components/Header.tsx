import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertOctagon,
  Menu,
  PackageSearch,
  ShoppingCart,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", to: "/" as const },
    { label: "Contact", to: "/contact" as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <Zap className="w-5 h-5 text-primary transition-smooth group-hover:text-glow" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-smooth">
            HACKER'S<span className="text-primary"> PENDRIVE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-smooth tracking-wide"
              activeProps={{ className: "text-primary" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/orders"
            className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-smooth tracking-wide flex items-center gap-1.5"
            activeProps={{ className: "text-primary" }}
          >
            <PackageSearch className="w-3.5 h-3.5" />
            Track Order
          </Link>
          <Link
            to="/complaints"
            className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-smooth tracking-wide flex items-center gap-1.5"
            activeProps={{ className: "text-primary" }}
            data-ocid="header-complaint-link"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Complaint Box
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Customer Login */}
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-1.5 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            onClick={() => navigate({ to: "/customer" })}
            data-ocid="header-customer-login-btn"
          >
            <User className="w-3.5 h-3.5" />
            My Orders
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            onClick={() => navigate({ to: "/checkout" })}
          >
            Buy Now
          </Button>

          <button
            onClick={toggleCart}
            type="button"
            className="relative p-2 text-muted-foreground hover:text-primary transition-smooth"
            aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            data-ocid="header-cart-btn"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground border-0 flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </Badge>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-smooth"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-smooth py-2 border-b border-border/50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/orders"
            className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-smooth py-2 border-b border-border/50 flex items-center gap-1.5"
            onClick={() => setMobileOpen(false)}
          >
            <PackageSearch className="w-3.5 h-3.5" />
            Track Order
          </Link>
          <Link
            to="/complaints"
            className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-smooth py-2 border-b border-border/50 flex items-center gap-1.5"
            onClick={() => setMobileOpen(false)}
            data-ocid="mobile-complaint-link"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Complaint Box
          </Link>
          <div className="flex gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                setMobileOpen(false);
                navigate({ to: "/customer" });
              }}
              data-ocid="mobile-customer-login-btn"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              My Orders
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                setMobileOpen(false);
                navigate({ to: "/checkout" });
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
