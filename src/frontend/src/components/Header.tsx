import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { CustomerAuthSession } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertOctagon,
  LogOut,
  Menu,
  PackageSearch,
  ShoppingCart,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const CUSTOMER_AUTH_KEY = "customer-auth";

function getCustomerAuth(): CustomerAuthSession | null {
  try {
    const stored =
      sessionStorage.getItem(CUSTOMER_AUTH_KEY) ||
      localStorage.getItem(CUSTOMER_AUTH_KEY);
    if (stored) return JSON.parse(stored) as CustomerAuthSession;
  } catch {
    /* ignore */
  }
  return null;
}

export function Header() {
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useState<CustomerAuthSession | null>(() =>
    getCustomerAuth(),
  );

  const handleLogout = () => {
    sessionStorage.removeItem(CUSTOMER_AUTH_KEY);
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    setAuth(null);
    setMobileOpen(false);
    navigate({ to: "/" });
  };

  // Re-check auth on each render so header stays in sync
  const currentAuth = getCustomerAuth();
  const displayAuth = currentAuth ?? auth;

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
          {displayAuth ? (
            /* Logged-in state */
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/customer"
                className="flex items-center gap-1.5 text-sm font-mono text-primary hover:text-primary/80 transition-smooth"
                data-ocid="header-customer-name"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[120px] truncate">
                  {displayAuth.name.split(" ")[0]}
                </span>
              </Link>
              <Link
                to="/customer"
                className="hidden lg:flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-smooth border border-border rounded px-2 py-1 hover:border-primary/40"
                data-ocid="header-my-profile-link"
              >
                My Profile
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth font-mono text-xs"
                onClick={handleLogout}
                data-ocid="header-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            /* Logged-out state */
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/40 text-primary hover:bg-primary/10 transition-smooth font-mono text-xs"
                onClick={() => navigate({ to: "/login" })}
                data-ocid="header-login-btn"
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-mono text-xs glow-accent"
                onClick={() => navigate({ to: "/signup" })}
                data-ocid="header-signup-btn"
              >
                Sign Up
              </Button>
            </div>
          )}

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

          {displayAuth ? (
            /* Mobile logged-in */
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2 py-2 text-sm text-primary font-mono">
                <User className="w-4 h-4" />
                Hi, {displayAuth.name}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate({ to: "/customer" });
                  }}
                  data-ocid="mobile-my-profile-btn"
                >
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                  data-ocid="mobile-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            /* Mobile logged-out */
            <div className="flex gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-primary/40 text-primary hover:bg-primary/10"
                onClick={() => {
                  setMobileOpen(false);
                  navigate({ to: "/login" });
                }}
                data-ocid="mobile-login-btn"
              >
                Login
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setMobileOpen(false);
                  navigate({ to: "/signup" });
                }}
                data-ocid="mobile-signup-btn"
              >
                Sign Up
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              setMobileOpen(false);
              navigate({ to: "/checkout" });
            }}
          >
            Buy Now
          </Button>
        </div>
      )}
    </header>
  );
}
