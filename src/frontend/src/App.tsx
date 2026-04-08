import { ProductGallery, ReviewsSection } from "@/components/GalleryAndReviews";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { CartProvider } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import type { Complaint, Order, OrderDetails, Product } from "@/types";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  Cpu,
  Download,
  HardDrive,
  Home,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MessageSquareWarning,
  Minus,
  Network,
  Package,
  PackageSearch,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Terminal,
  Trash2,
  User,
  Wrench,
  X,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

// ── Constants ────────────────────────────────────────────────────

const PRODUCT_DEFAULT: Product = {
  id: "hackers-pendrive-32gb",
  name: "Hacker's Pendrive 32GB",
  description:
    "32GB USB drive with 125+ professional ethical hacking and cybersecurity tools pre-installed.",
  price: 3999,
  originalPrice: 4999,
  image: "/assets/generated/hero-pendrive.dim_1200x600.jpg",
  features: ["125+ Tools", "32GB USB 3.2", "AES-256 Encrypted", "Plug & Play"],
  category: "cybersecurity",
};

const UPI_ID_DEFAULT = "gauravsaswade03@okaxis";
const CONTACT_EMAIL_DEFAULT = "gauravsaswade2009@gmail.com";
const CONTACT_PHONE_DEFAULT = "+91 9270556455";
const PRODUCT_KEY = "admin-product-data";
const SITE_SETTINGS_KEY = "admin-site-settings";
const ORDER_LIST_KEY = "order-list";
const ADMIN_EMAIL = "gauravsaswade2009@gmail.com";
const ADMIN_PASSWORD = "p1love2g";
const COMPLAINTS_KEY = "complaint-list";

// ── Helpers ──────────────────────────────────────────────────────

interface SiteSettings {
  headline: string;
  subheadline: string;
  upiId: string;
  contactEmail: string;
  contactPhone: string;
}

function getProduct(): Product {
  try {
    const stored = localStorage.getItem(PRODUCT_KEY);
    if (stored) return JSON.parse(stored) as Product;
  } catch {
    /* ignore */
  }
  return PRODUCT_DEFAULT;
}

function getSiteSettings(): SiteSettings {
  try {
    const stored = localStorage.getItem(SITE_SETTINGS_KEY);
    if (stored) return JSON.parse(stored) as SiteSettings;
  } catch {
    /* ignore */
  }
  return {
    headline: "HACKER'S PENDRIVE",
    subheadline:
      "Advanced Cybersecurity Framework on a 32GB USB. Penetration Testing, Network Analysis, Forensics & More on one secure drive.",
    upiId: UPI_ID_DEFAULT,
    contactEmail: CONTACT_EMAIL_DEFAULT,
    contactPhone: CONTACT_PHONE_DEFAULT,
  };
}

// Legacy order shape from localStorage
interface LegacyOrder {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  amount: number;
  status: "Pending" | "Confirmed" | "Paid" | "Shipped" | "Delivered";
}

function getOrders(): LegacyOrder[] {
  try {
    const stored = localStorage.getItem(ORDER_LIST_KEY);
    if (stored) return JSON.parse(stored) as LegacyOrder[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveOrder(order: LegacyOrder) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDER_LIST_KEY, JSON.stringify(orders));
}

function updateOrderStatus(orderId: string, status: LegacyOrder["status"]) {
  const orders = getOrders().map((o) =>
    o.id === orderId ? { ...o, status } : o,
  );
  localStorage.setItem(ORDER_LIST_KEY, JSON.stringify(orders));
}

function getComplaints(): Complaint[] {
  try {
    const stored = localStorage.getItem(COMPLAINTS_KEY);
    if (stored) return JSON.parse(stored) as Complaint[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveComplaint(complaint: Complaint) {
  const complaints = getComplaints();
  complaints.push(complaint);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
}

function updateComplaintStatus(id: string, status: Complaint["status"]) {
  const complaints = getComplaints().map((c) =>
    c.id === id ? { ...c, status } : c,
  );
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
}

const TOOL_CATEGORIES = [
  {
    icon: ShieldCheck,
    title: "Penetration Testing",
    tools: "Kali Linux, Metasploit, Nmap, Burp Suite",
  },
  {
    icon: Network,
    title: "Network Security",
    tools: "Wireshark, Ettercap, TCPDump, Mero",
  },
  {
    icon: Terminal,
    title: "Digital Forensics",
    tools: "Autopsy, FTK, Volatility, Recuva",
  },
  {
    icon: Wrench,
    title: "Reverse Engineering",
    tools: "Ghidra, IDA Pro, Radare2, x64dbg",
  },
  {
    icon: Lock,
    title: "Password Recovery",
    tools: "John the Ripper, Hashcat, Hydra, THC",
  },
  {
    icon: Cpu,
    title: "System Hardening",
    tools: "Lynis, CIS-CAT, Bastille, OpenSCAP",
  },
];

const SPECS = [
  { label: "Capacity", value: "32GB" },
  { label: "Interface", value: "USB 3.2 Gen 2x2" },
  { label: "Read Speed", value: "2000 MB/s" },
  { label: "Write Speed", value: "2500 MB/s" },
  { label: "Encryption", value: "AES-256" },
  { label: "OS Support", value: "Win / Mac / Linux" },
];

// ── Status Badge ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: LegacyOrder["status"] }) {
  const map = {
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    Confirmed: "bg-primary/10 text-primary border-primary/30",
    Paid: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Shipped: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    Delivered: "bg-primary/10 text-primary border-primary/30",
  };
  return (
    <span
      className={`text-xs font-mono px-2 py-0.5 rounded border whitespace-nowrap ${map[status] ?? map.Pending}`}
    >
      {status}
    </span>
  );
}

// ── Home Page ───────────────────────────────────────────────────

function HomePage() {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const product = getProduct();
  const settings = getSiteSettings();

  const handleBuyNow = () => {
    addItem(product, 1);
    navigate({ to: "/checkout" });
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.70_0.18_142/0.08),transparent_60%)]" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <Badge className="w-fit bg-primary/10 text-primary border-primary/30 font-mono text-xs tracking-widest px-3 py-1">
                ⚡ 125+ TOOLS INCLUDED
              </Badge>
              <h1 className="font-display font-black text-5xl lg:text-7xl leading-none tracking-tight text-foreground">
                {settings.headline.split(" ").slice(0, -1).join(" ")}
                <span className="block text-primary text-glow">
                  {settings.headline.split(" ").slice(-1)[0]}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-md">
                {settings.subheadline}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <span
                    key={f}
                    className="font-mono text-xs px-3 py-1 rounded border border-primary/30 text-primary bg-primary/5"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-mono font-black text-4xl text-primary text-glow">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-lg text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
                  onClick={handleBuyNow}
                  data-ocid="hero-buy-btn"
                >
                  Get Hacker's Pendrive{" "}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 font-display font-semibold tracking-wide transition-smooth"
                  onClick={() => {
                    addItem(product, 1);
                    toast.success("Added to cart!");
                    openCart();
                  }}
                  data-ocid="hero-cart-btn"
                >
                  Add to Cart
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-lg overflow-hidden border border-primary/20 glow-accent">
                <img
                  src="/assets/generated/hero-pendrive.dim_1200x600.jpg"
                  alt="Hacker's Pendrive"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-card border border-primary/40 rounded px-3 py-2 font-mono text-xs text-primary shadow-[0_0_12px_oklch(0.70_0.18_142/0.3)]">
                <HardDrive className="w-3 h-3 inline mr-1" />
                32GB · USB 3.2 Gen 2
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl lg:text-5xl text-foreground tracking-tight uppercase mb-3">
              Tool <span className="text-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              A complete cybersecurity arsenal in 6 professional categories.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOL_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-smooth hover:shadow-[0_0_20px_oklch(0.70_0.18_142/0.12)]"
                data-ocid={`tool-category-${i}`}
              >
                <cat.icon className="w-8 h-8 text-primary mb-3 transition-smooth" />
                <h3 className="font-display font-bold text-sm tracking-widest uppercase text-foreground mb-1">
                  {cat.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {cat.tools}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl lg:text-5xl text-foreground tracking-tight uppercase mb-3">
              Product <span className="text-primary">Details</span>
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SPECS.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="bg-card border border-border rounded-lg px-5 py-4 text-center"
              >
                <p className="font-mono font-bold text-lg text-primary">
                  {spec.value}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {spec.label}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex justify-center"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
              onClick={handleBuyNow}
              data-ocid="specs-buy-btn"
            >
              Order Now — ₹{product.price.toLocaleString("en-IN")}
            </Button>
          </motion.div>
        </div>
      </section>

      <ProductGallery />
      <ReviewsSection productId="hackers-pendrive-1" />
    </Layout>
  );
}

// ── Checkout Page ───────────────────────────────────────────────

function CheckoutPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<OrderDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isValid = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ].every((k) => (form[k as keyof OrderDetails] ?? "").trim() !== "");

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    navigate({ to: "/payment", search: form });
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-3xl lg:text-4xl text-foreground uppercase tracking-tight mb-8"
        >
          Checkout
        </motion.h1>
        {items.length === 0 ? (
          <div
            className="flex flex-col items-center gap-5 py-20"
            data-ocid="checkout-empty"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
            <p className="text-muted-foreground text-center">
              Your cart is empty.
            </p>
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate({ to: "/" })}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            <form
              onSubmit={handleProceed}
              className="lg:col-span-3 flex flex-col gap-6"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-5">
                  Delivery Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "name",
                      label: "Full Name",
                      placeholder: "Your full name",
                      type: "text",
                    },
                    {
                      id: "email",
                      label: "Email",
                      placeholder: "your@email.com",
                      type: "email",
                    },
                  ].map((f) => (
                    <div key={f.id} className="flex flex-col gap-1.5">
                      <Label
                        htmlFor={f.id}
                        className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                      >
                        {f.label}
                      </Label>
                      <Input
                        id={f.id}
                        name={f.id}
                        type={f.type}
                        value={form[f.id as keyof OrderDetails]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required
                        className="bg-background border-border focus:border-primary"
                        data-ocid={`checkout-${f.id}`}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="bg-background border-border focus:border-primary"
                      data-ocid="checkout-phone"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Flat/House no, Street, Area"
                      required
                      className="bg-background border-border focus:border-primary"
                      data-ocid="checkout-address"
                    />
                  </div>
                  {[
                    { id: "city", label: "City", placeholder: "City" },
                    { id: "state", label: "State", placeholder: "State" },
                    {
                      id: "pincode",
                      label: "Pincode",
                      placeholder: "6-digit pincode",
                      pattern: "[0-9]{6}",
                    },
                  ].map((f) => (
                    <div key={f.id} className="flex flex-col gap-1.5">
                      <Label
                        htmlFor={f.id}
                        className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                      >
                        {f.label}
                      </Label>
                      <Input
                        id={f.id}
                        name={f.id}
                        value={form[f.id as keyof OrderDetails]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        pattern={f.pattern}
                        required
                        className="bg-background border-border focus:border-primary"
                        data-ocid={`checkout-${f.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!isValid}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
                data-ocid="checkout-submit"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-5 sticky top-24">
                <h2 className="font-display font-bold text-base text-foreground mb-4">
                  Order Summary ({itemCount} item{itemCount !== 1 ? "s" : ""})
                </h2>
                <div className="flex flex-col gap-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 items-start"
                      data-ocid={`summary-item-${item.product.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm text-foreground truncate">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-5 h-5 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-smooth"
                            aria-label="Decrease"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono text-xs text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-5 h-5 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-smooth"
                            aria-label="Increase"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="font-mono text-sm text-primary font-bold">
                          ₹
                          {(item.product.price * item.quantity).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-smooth"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-mono font-black text-xl text-primary">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

// ── Payment Page ────────────────────────────────────────────────

interface PaymentSearch {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function PaymentPage({ search }: { search: PaymentSearch }) {
  const { total, clearCart } = useCart();
  const navigate = useNavigate();
  const { name, email, phone, address, city, state, pincode } = search;
  const [copied, setCopied] = useState(false);
  const settings = getSiteSettings();
  const product = getProduct();
  const amount = total > 0 ? total : product.price;

  const copyUPI = async () => {
    await navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const [paid, setPaid] = useState(false);

  const generateOrderId = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${dateStr}-${rand}`;
  };

  const handleConfirm = () => {
    const orderId = generateOrderId();
    const order: LegacyOrder = {
      id: orderId,
      date: new Date().toISOString(),
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      amount,
      status: "Paid",
    };
    saveOrder(order);
    clearCart();
    setPaid(true);
    setTimeout(() => {
      navigate({
        to: "/payment-success",
        search: { name, email, orderId },
      });
    }, 400);
  };

  const upiQrValue = `upi://pay?pa=gauravsaswade03@okaxis&pn=HackersPendrive&am=${amount}&cu=INR&tn=Order%20for%20Hackers%20Pendrive`;
  const upiLink = `upi://pay?pa=gauravsaswade03@okaxis&pn=HackersPendrive&am=${amount}&cu=INR&tn=Order%20for%20Hackers%20Pendrive`;

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <div>
            <h1 className="font-display font-black text-3xl lg:text-4xl text-foreground uppercase tracking-tight mb-1">
              Complete Your <span className="text-primary">Payment</span>
            </h1>
            <p className="text-muted-foreground text-sm font-body">
              Scan the QR code or tap Pay Now to open your UPI app directly.
            </p>
          </div>

          <div className="bg-card border border-primary/40 rounded-lg p-5 flex items-center justify-between border-t-2 border-t-primary">
            <div>
              <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-1">
                Amount to Pay
              </p>
              <p className="font-mono font-black text-4xl text-primary text-glow">
                ₹{amount.toLocaleString("en-IN")}
              </p>
              {name && (
                <p className="text-xs text-muted-foreground mt-1">
                  For: {name}
                  {email && ` · ${email}`}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* QR Code — hidden once payment confirmed */}
          {!paid && (
            <div
              className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-4"
              data-ocid="payment-qr-section"
            >
              <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase self-start">
                Scan to Pay ₹{amount.toLocaleString("en-IN")}
              </p>
              <div className="bg-white p-4 rounded-lg inline-block border-2 border-primary/60 shadow-[0_0_20px_oklch(0.70_0.18_142/0.25)]">
                <QRCodeSVG
                  value={upiQrValue}
                  size={300}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  data-ocid="payment-qr-code"
                />
              </div>
              <div className="flex items-center gap-2 text-center">
                <Smartphone className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground font-body">
                  Open{" "}
                  <span className="text-foreground font-semibold">
                    GPay, PhonePe, Paytm
                  </span>{" "}
                  or any UPI app and scan
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-mono text-muted-foreground px-2 tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <a
            href={upiLink}
            className="block w-full"
            data-ocid="payment-pay-now-btn"
          >
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth text-lg py-7 shadow-[0_0_24px_oklch(0.70_0.18_142/0.4)]"
            >
              <Smartphone className="w-5 h-5 mr-2" /> Pay Now — ₹
              {amount.toLocaleString("en-IN")}
            </Button>
          </a>

          <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded px-4 py-3">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">On mobile?</span>{" "}
              Tap <em>Pay Now</em> to open your UPI app instantly.{" "}
              <span className="text-foreground font-semibold">On desktop?</span>{" "}
              Scan the QR code above with your phone's camera.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
              UPI ID
            </p>
            <div className="flex items-center gap-3 bg-background border border-border rounded px-4 py-3">
              <span className="flex-1 font-mono text-sm text-foreground break-all">
                {settings.upiId}
              </span>
              <button
                type="button"
                onClick={copyUPI}
                className="text-muted-foreground hover:text-primary transition-smooth flex-shrink-0"
                aria-label="Copy UPI ID"
                data-ocid="copy-upi-btn"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-2 bg-muted/40 border border-border rounded px-3 py-3">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              After paying, click the button below. For issues contact{" "}
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-primary hover:underline"
              >
                {settings.contactEmail}
              </a>{" "}
              or{" "}
              <a
                href={`tel:${settings.contactPhone}`}
                className="text-primary hover:underline"
              >
                {settings.contactPhone}
              </a>
              .
            </p>
          </div>

          <Button
            size="lg"
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/10 font-display font-semibold tracking-wide transition-smooth disabled:opacity-50"
            onClick={handleConfirm}
            disabled={paid}
            data-ocid="payment-confirm-btn"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {paid ? "Processing…" : "I've Already Paid — Confirm Order"}
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
}

// ── Payment Success Page ────────────────────────────────────────

interface SuccessSearch {
  name: string;
  email: string;
  orderId?: string;
}

function PaymentSuccessPage({ search }: { search: SuccessSearch }) {
  const { name, email, orderId } = search;
  const settings = getSiteSettings();
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleCopyOrderId = async () => {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    toast.success("Order ID copied!");
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-16 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              bounce: 0.5,
            }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_40px_oklch(0.70_0.18_142/0.4)]">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full animate-pulse-glow border-2 border-primary/30" />
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-mono text-xs text-primary tracking-widest uppercase mb-2">
              ✓ PAYMENT RECEIVED
            </p>
            <h1 className="font-display font-black text-3xl lg:text-5xl text-foreground uppercase tracking-tight mb-2">
              Order <span className="text-primary text-glow">Confirmed!</span>
            </h1>
            {name && (
              <p className="text-muted-foreground font-body">
                Thank you,{" "}
                <span className="text-foreground font-semibold">{name}</span>!
                Your order is being processed.
              </p>
            )}
          </motion.div>

          {/* Order ID — prominent display */}
          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-primary/5 border-2 border-primary/40 rounded-xl p-6 shadow-[0_0_30px_oklch(0.70_0.18_142/0.2)]"
              data-ocid="success-order-id-box"
            >
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                Your Order ID
              </p>
              <p className="font-mono font-black text-primary text-2xl lg:text-3xl tracking-wider text-glow mb-2">
                {orderId}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Save this ID — you'll need it to track your order status.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyOrderId}
                className="border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs transition-smooth"
                data-ocid="copy-order-id-btn"
              >
                {copiedOrderId ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-primary" />{" "}
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Order ID
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full bg-card border border-primary/20 rounded-lg p-6 flex flex-col gap-4 text-left"
          >
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wide">
              What happens next?
            </h3>
            {[
              {
                icon: Package,
                title: "Hacker's Pendrive 32GB",
                desc: "Your order will be shipped within 3–5 business days.",
              },
              {
                icon: Mail,
                title: email || "Email Confirmation",
                desc: "Order details sent to your email address.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact */}
          <div className="w-full bg-muted/30 border border-border rounded-lg p-5 text-sm text-muted-foreground">
            <p className="mb-3 font-body">Questions about your order?</p>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 hover:text-primary transition-smooth"
                data-ocid="success-email"
              >
                <Mail className="w-4 h-4 text-primary" />
                {settings.contactEmail}
              </a>
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-2 hover:text-primary transition-smooth"
                data-ocid="success-phone"
              >
                <Phone className="w-4 h-4 text-primary" />
                {settings.contactPhone}
              </a>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link to="/">
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 font-display font-semibold tracking-wide transition-smooth"
                data-ocid="success-home-btn"
              >
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
            <Link to="/orders">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-wide transition-smooth glow-accent"
                data-ocid="success-track-btn"
              >
                <PackageSearch className="w-4 h-4 mr-2" /> Track Order
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}

// ── Contact Page ────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const settings = getSiteSettings();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:${settings.contactEmail}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast.success(
        "Email client opened. Send the email to complete your message.",
      );
      setForm({ name: "", email: "", message: "" });
    }, 800);
  };

  const isValid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <Layout>
      <section className="bg-card border-b border-border py-14">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground uppercase tracking-tight mb-3">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Have a question about the Hacker's Pendrive? We're here to help.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  Questions about tools, delivery, or payment — reach out. We
                  respond within 24 hours.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  {
                    href: `mailto:${settings.contactEmail}`,
                    icon: Mail,
                    label: "Email",
                    value: settings.contactEmail,
                    ocid: "contact-email-link",
                  },
                  {
                    href: `tel:${settings.contactPhone}`,
                    icon: Phone,
                    label: "Phone / WhatsApp",
                    value: settings.contactPhone,
                    ocid: "contact-phone-link",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-4 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-smooth"
                    data-ocid={item.ocid}
                  >
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-smooth">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-body text-foreground break-all">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
                <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">
                      Response Time
                    </p>
                    <p className="text-sm font-body text-foreground">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5"
            >
              <h2 className="font-display font-bold text-lg text-foreground">
                Send a Message
              </h2>
              {[
                {
                  id: "contact-name",
                  name: "name",
                  label: "Name",
                  type: "text",
                  value: form.name,
                  placeholder: "Your full name",
                  ocid: "contact-name-input",
                },
                {
                  id: "contact-email",
                  name: "email",
                  label: "Email",
                  type: "email",
                  value: form.email,
                  placeholder: "your@email.com",
                  ocid: "contact-email-input",
                },
              ].map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={f.id}
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    {f.label}
                  </Label>
                  <Input
                    id={f.id}
                    name={f.name}
                    type={f.type}
                    value={f.value}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required
                    className="bg-background border-border focus:border-primary"
                    data-ocid={f.ocid}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="contact-message"
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your question or inquiry…"
                  rows={5}
                  required
                  className="bg-background border-border focus:border-primary resize-none"
                  data-ocid="contact-message-input"
                />
              </div>
              <Button
                type="submit"
                disabled={!isValid || sending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth disabled:opacity-40"
                data-ocid="contact-submit-btn"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Opening Mail…" : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ── Complaint Box Section ─────────────────────────────── */}
      <ComplaintBoxSection />
    </Layout>
  );
}

// ── Complaint Box Section ────────────────────────────────────────

function ComplaintBoxSection() {
  const [cmpForm, setCmpForm] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "",
    message: "",
  });
  const [cmpSubmitted, setCmpSubmitted] = useState(false);
  const [cmpSubmitting, setCmpSubmitting] = useState(false);

  const handleCmpChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setCmpForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isCmpValid =
    cmpForm.name.trim() &&
    cmpForm.email.trim() &&
    cmpForm.subject.trim() &&
    cmpForm.message.trim();

  const handleCmpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCmpValid) return;
    setCmpSubmitting(true);
    const complaint: Complaint = {
      id: `CMP-${Date.now()}`,
      name: cmpForm.name.trim(),
      email: cmpForm.email.trim(),
      orderId: cmpForm.orderId.trim(),
      subject: cmpForm.subject.trim(),
      message: cmpForm.message.trim(),
      timestamp: new Date().toISOString(),
      status: "Open",
    };
    saveComplaint(complaint);
    setTimeout(() => {
      setCmpSubmitting(false);
      setCmpSubmitted(true);
      toast.success("Complaint submitted. We'll get back to you shortly.");
    }, 600);
  };

  const CMP_SUBJECTS = [
    "Payment Issue",
    "Order Not Received",
    "Wrong Product",
    "Damaged / Defective",
    "Refund Request",
    "Other",
  ];

  return (
    <section className="bg-muted/30 border-t border-border py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-destructive/10 border border-destructive/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-foreground uppercase tracking-tight">
                Complaint <span className="text-destructive">Box</span>
              </h2>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                Facing an issue? Submit a complaint and we'll resolve it
                promptly.
              </p>
            </div>
          </div>
          {cmpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-primary/30 rounded-lg p-8 flex flex-col items-center gap-4 text-center"
              data-ocid="complaint-success"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center glow-accent">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-display font-black text-xl text-foreground mb-1">
                  Complaint Received
                </p>
                <p className="text-sm text-muted-foreground">
                  We've logged your complaint and will respond within 24–48
                  hours.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs"
                onClick={() => {
                  setCmpForm({
                    name: "",
                    email: "",
                    orderId: "",
                    subject: "",
                    message: "",
                  });
                  setCmpSubmitted(false);
                }}
                data-ocid="complaint-new-btn"
              >
                Submit Another Complaint
              </Button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleCmpSubmit}
              className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5"
              data-ocid="complaint-form"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="cmp-name"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="cmp-name"
                    name="name"
                    value={cmpForm.name}
                    onChange={handleCmpChange}
                    placeholder="Your name"
                    required
                    className="bg-background border-border focus:border-primary"
                    data-ocid="complaint-name-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="cmp-email"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Email *
                  </Label>
                  <Input
                    id="cmp-email"
                    name="email"
                    type="email"
                    value={cmpForm.email}
                    onChange={handleCmpChange}
                    placeholder="your@email.com"
                    required
                    className="bg-background border-border focus:border-primary"
                    data-ocid="complaint-email-input"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="cmp-order"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Order ID{" "}
                    <span className="text-muted-foreground/50">(optional)</span>
                  </Label>
                  <Input
                    id="cmp-order"
                    name="orderId"
                    value={cmpForm.orderId}
                    onChange={handleCmpChange}
                    placeholder="ORD-1234567890"
                    className="bg-background border-border focus:border-primary font-mono"
                    data-ocid="complaint-orderid-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="cmp-subject"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Subject *
                  </Label>
                  <select
                    id="cmp-subject"
                    name="subject"
                    value={cmpForm.subject}
                    onChange={handleCmpChange}
                    required
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none font-body"
                    data-ocid="complaint-subject-select"
                  >
                    <option value="">Select a subject…</option>
                    {CMP_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="cmp-message"
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  Describe Your Issue *
                </Label>
                <Textarea
                  id="cmp-message"
                  name="message"
                  value={cmpForm.message}
                  onChange={handleCmpChange}
                  placeholder="Please describe your issue in detail…"
                  rows={5}
                  required
                  className="bg-background border-border focus:border-primary resize-none"
                  data-ocid="complaint-message-input"
                />
              </div>
              <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded px-3 py-3">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complaints are reviewed within{" "}
                  <span className="text-foreground font-semibold">
                    24–48 hours
                  </span>
                  . For urgent issues, call{" "}
                  <a
                    href={`tel:${CONTACT_PHONE_DEFAULT}`}
                    className="text-primary hover:underline"
                  >
                    {CONTACT_PHONE_DEFAULT}
                  </a>
                  .
                </p>
              </div>
              <Button
                type="submit"
                disabled={!isCmpValid || cmpSubmitting}
                className="w-full bg-destructive/80 hover:bg-destructive text-destructive-foreground font-display font-bold tracking-widest uppercase transition-smooth disabled:opacity-40"
                data-ocid="complaint-submit-btn"
              >
                <MessageSquareWarning className="w-4 h-4 mr-2" />
                {cmpSubmitting ? "Submitting…" : "Submit Complaint"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── Order Tracking Page ─────────────────────────────────────────

interface OrdersSearch {
  orderId?: string;
  email?: string;
}

function OrderTrackingPage({ search }: { search: OrdersSearch }) {
  const [orderId, setOrderId] = useState(search.orderId ?? "");
  const [email, setEmail] = useState(search.email ?? "");
  const [found, setFound] = useState<LegacyOrder | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const orders = getOrders();
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === orderId.trim().toLowerCase() &&
        o.email.toLowerCase() === email.trim().toLowerCase(),
    );
    setFound(match ?? null);
  };

  const statusSteps: LegacyOrder["status"][] = [
    "Pending",
    "Paid",
    "Shipped",
    "Delivered",
  ];

  return (
    <Layout>
      <section className="bg-card border-b border-border py-14">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground uppercase tracking-tight mb-3">
              Track <span className="text-primary">Order</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Enter your Order ID and email to check your order status.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSearch}
            className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 mb-8"
          >
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="track-order-id"
                className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
              >
                Order ID
              </Label>
              <Input
                id="track-order-id"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-1234567890"
                required
                className="bg-background border-border focus:border-primary font-mono"
                data-ocid="track-order-id-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="track-email"
                className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
              >
                Email Used at Checkout
              </Label>
              <Input
                id="track-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-background border-border focus:border-primary"
                data-ocid="track-email-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
              data-ocid="track-search-btn"
            >
              <Search className="w-4 h-4 mr-2" /> Track My Order
            </Button>
          </motion.form>

          {searched && !found && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-lg p-8 text-center"
              data-ocid="track-not-found"
            >
              <PackageSearch className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display font-bold text-foreground mb-1">
                Order Not Found
              </p>
              <p className="text-sm text-muted-foreground">
                No order matches that ID and email combination. Please
                double-check your details.
              </p>
            </motion.div>
          )}

          {found && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
              data-ocid="track-result"
            >
              <div className="bg-card border border-primary/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                      Order ID
                    </p>
                    <p className="font-mono font-black text-primary">
                      {found.id}
                    </p>
                  </div>
                  <StatusBadge status={found.status} />
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Customer", value: found.name },
                    {
                      label: "Date Placed",
                      value: new Date(found.date).toLocaleDateString("en-IN"),
                    },
                    {
                      label: "Amount Paid",
                      value: `₹${found.amount.toLocaleString("en-IN")}`,
                    },
                    { label: "Phone", value: found.phone },
                    {
                      label: "Delivery Address",
                      value: `${found.address}, ${found.city}, ${found.state} – ${found.pincode}`,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={
                        row.label === "Delivery Address" ? "col-span-2" : ""
                      }
                    >
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">
                        {row.label}
                      </p>
                      <p className="text-foreground font-semibold text-sm break-words">
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                {/* Status Progress */}
                <div className="flex items-center justify-between gap-1">
                  {statusSteps.map((step, i) => {
                    const stepIdx = statusSteps.indexOf(found.status);
                    const done = i <= stepIdx;
                    return (
                      <div
                        key={step}
                        className="flex-1 flex flex-col items-center gap-1.5"
                      >
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-mono transition-smooth ${done ? "border-primary bg-primary/20 text-primary" : "border-border bg-background text-muted-foreground"}`}
                        >
                          {done ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            <span>{i + 1}</span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] font-mono text-center leading-tight ${done ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {step}
                        </p>
                        {i < statusSteps.length - 1 && (
                          <div className="absolute hidden" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}

// ── Customer Login / My Orders Page ────────────────────────────

function CustomerPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orders, setOrders] = useState<LegacyOrder[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const all = getOrders();
    const matched = all.filter(
      (o) => o.email.toLowerCase() === email.trim().toLowerCase(),
    );
    setOrders(matched);
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="bg-card border-b border-border py-14">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground uppercase tracking-tight mb-3">
              My <span className="text-primary">Orders</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Enter the email you used at checkout to view all your orders.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 max-w-xl">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm text-center font-body">
                  Login with your email to view your order history and track
                  deliveries.
                </p>
              </div>
              <form
                onSubmit={handleLogin}
                className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="customer-email"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="bg-background border-border focus:border-primary"
                    data-ocid="customer-email-input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
                  data-ocid="customer-login-btn"
                >
                  <User className="w-4 h-4 mr-2" /> View My Orders
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Want to track a specific order?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/orders" })}
                  className="text-primary hover:underline"
                >
                  Use Order Tracking →
                </button>
              </p>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-5 py-10 text-center"
              data-ocid="customer-no-orders"
            >
              <PackageSearch className="w-14 h-14 text-muted-foreground/30" />
              <div>
                <p className="font-display font-bold text-foreground mb-1">
                  No orders found
                </p>
                <p className="text-sm text-muted-foreground">
                  No orders were found for{" "}
                  <span className="text-foreground font-semibold">{email}</span>
                  .
                </p>
              </div>
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10"
                onClick={() => setSubmitted(false)}
                data-ocid="customer-retry-btn"
              >
                Try Another Email
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-foreground">
                    {orders.length} order{orders.length !== 1 ? "s" : ""} found
                  </p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-muted-foreground hover:text-primary hover:border-primary/40 text-xs"
                  onClick={() => setSubmitted(false)}
                >
                  Change Email
                </Button>
              </div>
              {orders.reverse().map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-smooth"
                  data-ocid={`customer-order-${order.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-0.5">
                        Order ID
                      </p>
                      <p className="font-mono font-black text-primary text-sm">
                        {order.id}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="text-foreground">
                        {new Date(order.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-mono font-bold text-primary">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery To</p>
                      <p className="text-foreground">
                        {order.city}, {order.state}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-primary/30 text-primary hover:bg-primary/10 text-xs w-full"
                    onClick={() =>
                      navigate({
                        to: "/orders",
                        search: { orderId: order.id, email: order.email },
                      })
                    }
                    data-ocid={`customer-track-${order.id}`}
                  >
                    <PackageSearch className="w-3.5 h-3.5 mr-1" /> Track This
                    Order
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}

// ── Admin Login Page ────────────────────────────────────────────

function AdminLoginPage() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.email === ADMIN_EMAIL && creds.password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-auth", "true");
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 glow-accent">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
            Admin <span className="text-primary">Login</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Restricted access — authorized personnel only
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-card border border-primary/30 rounded-lg p-6 flex flex-col gap-5 shadow-[0_0_30px_oklch(0.70_0.18_142/0.08)]"
        >
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="admin-email"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={creds.email}
              onChange={(e) =>
                setCreds((c) => ({ ...c, email: e.target.value }))
              }
              placeholder="admin@email.com"
              required
              className="bg-background border-border focus:border-primary"
              data-ocid="admin-email-input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="admin-password"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={creds.password}
              onChange={(e) =>
                setCreds((c) => ({ ...c, password: e.target.value }))
              }
              placeholder="••••••••"
              required
              className="bg-background border-border focus:border-primary"
              data-ocid="admin-password-input"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
            data-ocid="admin-login-btn"
          >
            Login to Dashboard
          </Button>
        </form>
        <p className="text-center mt-5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-smooth">
            ← Back to Store
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ── Admin Dashboard ─────────────────────────────────────────────

type AdminSection =
  | "overview"
  | "product"
  | "settings"
  | "orders"
  | "complaints";

const ADMIN_NAV: {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "product", label: "Product Editor", icon: Package },
  { id: "settings", label: "Website Settings", icon: Settings },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "complaints", label: "Complaints", icon: MessageSquareWarning },
];

// ── Admin: Overview Section ──────────────────────────────────────

function AdminOverview({ onNav }: { onNav: (s: AdminSection) => void }) {
  const product = getProduct();
  const settings = getSiteSettings();
  const orders = getOrders();
  const recentOrders = orders.slice(-5).reverse();

  const stats = [
    {
      label: "Current Price",
      value: `₹${product.price.toLocaleString("en-IN")}`,
      sub: "active listing",
    },
    {
      label: "Original Price",
      value: `₹${(product.originalPrice ?? 0).toLocaleString("en-IN")}`,
      sub: "before discount",
    },
    { label: "UPI ID", value: settings.upiId, sub: "payment destination" },
    { label: "Total Orders", value: orders.length.toString(), sub: "all time" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
          Dashboard <span className="text-primary">Overview</span>
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Welcome back. Here's a summary of your store.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-lg p-4 border-t-2 border-t-primary"
          >
            <p className="font-mono font-bold text-primary text-sm truncate">
              {s.value}
            </p>
            <p className="text-xs font-display font-semibold text-foreground mt-0.5">
              {s.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNav("product")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-primary/50 transition-smooth group"
          data-ocid="overview-product-link"
        >
          <Package className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-smooth" />
          <p className="font-display font-bold text-sm text-foreground">
            Edit Product
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Update name, price, features, image
          </p>
        </button>
        <button
          type="button"
          onClick={() => onNav("settings")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-primary/50 transition-smooth group"
          data-ocid="overview-settings-link"
        >
          <Settings className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-smooth" />
          <p className="font-display font-bold text-sm text-foreground">
            Website Settings
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Hero text, UPI ID, contact info
          </p>
        </button>
      </div>
      {recentOrders.length > 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-foreground">
              Recent Orders
            </h3>
            <button
              type="button"
              onClick={() => onNav("orders")}
              className="text-xs text-primary hover:underline font-mono"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Order #", "Date", "Buyer", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-mono text-primary tracking-widest uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr
                    key={o.id}
                    className={i % 2 === 0 ? "bg-background/50" : ""}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {o.id.slice(-8)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(o.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      {o.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      ₹{o.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="bg-card border border-border rounded-lg px-6 py-10 text-center"
          data-ocid="overview-no-orders"
        >
          <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No orders yet. They'll appear here once customers purchase.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Admin: Product Editor ────────────────────────────────────────

function AdminProductEditor() {
  const [productData, setProductData] = useState<Product>(() => getProduct());
  const [newFeature, setNewFeature] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(productData));
    toast.success("Product details saved successfully!");
  };

  const handleReset = () => {
    setProductData(PRODUCT_DEFAULT);
    localStorage.removeItem(PRODUCT_KEY);
    toast.success("Product reset to defaults.");
  };

  const addFeature = () => {
    const f = newFeature.trim();
    if (!f) return;
    setProductData((p) => ({ ...p, features: [...p.features, f] }));
    setNewFeature("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
          Product <span className="text-primary">Editor</span>
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Changes are saved to local storage and reflected on the store
          immediately.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSave}
          className="lg:col-span-2 flex flex-col gap-5"
        >
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
            {[
              {
                id: "prod-name",
                label: "Product Name",
                key: "name" as const,
                type: "text",
              },
              {
                id: "prod-image",
                label: "Image URL",
                key: "image" as const,
                type: "text",
              },
              {
                id: "prod-category",
                label: "Category",
                key: "category" as const,
                type: "text",
              },
            ].map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <Label
                  htmlFor={f.id}
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  {f.label}
                </Label>
                <Input
                  id={f.id}
                  type={f.type}
                  value={productData[f.key] ?? ""}
                  onChange={(e) =>
                    setProductData((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  className="bg-background border-border focus:border-primary"
                  data-ocid={`admin-${f.id}`}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="prod-desc"
                className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
              >
                Description
              </Label>
              <Textarea
                id="prod-desc"
                value={productData.description}
                onChange={(e) =>
                  setProductData((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="bg-background border-border focus:border-primary resize-none"
                data-ocid="admin-prod-desc"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { id: "prod-price", label: "Price (₹)", key: "price" as const },
                {
                  id: "prod-original",
                  label: "Original Price (₹)",
                  key: "originalPrice" as const,
                },
              ].map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={f.id}
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    {f.label}
                  </Label>
                  <Input
                    id={f.id}
                    type="number"
                    value={productData[f.key] ?? 0}
                    onChange={(e) =>
                      setProductData((p) => ({
                        ...p,
                        [f.key]: Number(e.target.value),
                      }))
                    }
                    className="bg-background border-border focus:border-primary"
                    data-ocid={`admin-${f.id}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                Features
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {productData.features.map((f, idx) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 text-xs font-mono px-2 py-1 rounded"
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() =>
                        setProductData((p) => ({
                          ...p,
                          features: p.features.filter((_, i) => i !== idx),
                        }))
                      }
                      className="hover:text-destructive transition-smooth ml-1"
                      aria-label="Remove feature"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  placeholder="Add a feature tag…"
                  className="bg-background border-border focus:border-primary flex-1"
                  data-ocid="admin-prod-feature-input"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 shrink-0"
                  data-ocid="admin-prod-feature-add"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
              data-ocid="admin-save-btn"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-border text-muted-foreground hover:text-foreground"
              data-ocid="admin-reset-btn"
            >
              Reset to Defaults
            </Button>
          </div>
        </form>
        {/* Live Preview */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            Live Preview
          </p>
          <div className="bg-card border border-primary/20 rounded-lg overflow-hidden">
            {productData.image && (
              <img
                src={productData.image}
                alt={productData.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4 flex flex-col gap-2">
              <p className="font-display font-black text-base text-foreground">
                {productData.name}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {productData.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {productData.features.slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="text-xs font-mono px-2 py-0.5 rounded border border-primary/30 text-primary bg-primary/5"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono font-black text-xl text-primary">
                  ₹{productData.price.toLocaleString("en-IN")}
                </span>
                {productData.originalPrice ? (
                  <span className="font-mono text-sm text-muted-foreground line-through">
                    ₹{productData.originalPrice.toLocaleString("en-IN")}
                  </span>
                ) : null}
              </div>
              <Badge className="w-fit text-xs font-mono mt-1 bg-primary/10 text-primary border-primary/30">
                {productData.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin: Website Settings ──────────────────────────────────────

function AdminWebsiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() =>
    getSiteSettings(),
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
    toast.success("Website settings saved successfully!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
          Website <span className="text-primary">Settings</span>
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Customize hero text, payment details, and contact information.
        </p>
      </div>
      <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
          <h3 className="font-display font-bold text-sm text-foreground tracking-wide uppercase pb-2 border-b border-border">
            Hero Section
          </h3>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="site-headline"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              Headline
            </Label>
            <Input
              id="site-headline"
              value={settings.headline}
              onChange={(e) =>
                setSettings((s) => ({ ...s, headline: e.target.value }))
              }
              placeholder="HACKER'S PENDRIVE"
              className="bg-background border-border focus:border-primary"
              data-ocid="admin-site-headline"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="site-sub"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              Sub-headline
            </Label>
            <Textarea
              id="site-sub"
              value={settings.subheadline}
              onChange={(e) =>
                setSettings((s) => ({ ...s, subheadline: e.target.value }))
              }
              rows={3}
              className="bg-background border-border focus:border-primary resize-none"
              data-ocid="admin-site-sub"
            />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
          <h3 className="font-display font-bold text-sm text-foreground tracking-wide uppercase pb-2 border-b border-border">
            Payment Settings
          </h3>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="site-upi"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              UPI ID
            </Label>
            <Input
              id="site-upi"
              value={settings.upiId}
              onChange={(e) =>
                setSettings((s) => ({ ...s, upiId: e.target.value }))
              }
              placeholder="yourname@bank"
              className="bg-background border-border focus:border-primary font-mono"
              data-ocid="admin-site-upi"
            />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
          <h3 className="font-display font-bold text-sm text-foreground tracking-wide uppercase pb-2 border-b border-border">
            Contact Information
          </h3>
          {[
            {
              id: "site-email",
              label: "Contact Email",
              type: "email",
              key: "contactEmail" as const,
              placeholder: "admin@gmail.com",
            },
            {
              id: "site-phone",
              label: "Contact Phone",
              type: "tel",
              key: "contactPhone" as const,
              placeholder: "+91 XXXXX XXXXX",
            },
          ].map((f) => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <Label
                htmlFor={f.id}
                className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
              >
                {f.label}
              </Label>
              <Input
                id={f.id}
                type={f.type}
                value={settings[f.key]}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder}
                className="bg-background border-border focus:border-primary"
                data-ocid={`admin-${f.id}`}
              />
            </div>
          ))}
        </div>
        <Button
          type="submit"
          className="w-fit bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth"
          data-ocid="admin-settings-save"
        >
          Save All Settings
        </Button>
      </form>
    </div>
  );
}

// ── Admin: Orders Section ────────────────────────────────────────

function AdminOrders() {
  const [orders, setOrders] = useState<LegacyOrder[]>(() =>
    getOrders().reverse(),
  );
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleStatusUpdate = (id: string, status: LegacyOrder["status"]) => {
    updateOrderStatus(id, status);
    setOrders(getOrders().reverse());
    toast.success(`Order status updated to ${status}`);
  };

  const exportCSV = () => {
    const headers = [
      "Order #",
      "Date",
      "Name",
      "Email",
      "Phone",
      "Address",
      "City",
      "State",
      "Pincode",
      "Amount",
      "Status",
    ];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.date).toLocaleString("en-IN"),
      o.name,
      o.email,
      o.phone,
      o.address,
      o.city,
      o.state,
      o.pincode,
      `₹${o.amount}`,
      o.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const STATUS_OPTIONS: LegacyOrder["status"][] = [
    "Pending",
    "Paid",
    "Shipped",
    "Delivered",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
            <span className="text-primary">Orders</span>
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            All customer orders — {orders.length} total.
          </p>
        </div>
        {orders.length > 0 && (
          <Button
            onClick={exportCSV}
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10 shrink-0 font-mono text-xs"
            data-ocid="admin-export-csv"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </Button>
        )}
      </div>
      {orders.length === 0 ? (
        <div
          className="bg-card border border-border rounded-lg px-6 py-16 text-center"
          data-ocid="admin-orders-empty"
        >
          <ClipboardList className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-display font-bold text-foreground mb-1">
            No orders yet
          </p>
          <p className="text-sm text-muted-foreground">
            Orders will appear here when customers complete their purchase.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    {[
                      "Order #",
                      "Date",
                      "Buyer",
                      "Email",
                      "City",
                      "Amount",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-mono text-primary tracking-widest uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const isExpanded = expandedOrder === o.id;
                    return (
                      <>
                        <tr
                          key={o.id}
                          className={`border-b border-border/50 hover:bg-primary/5 transition-smooth ${i % 2 === 0 ? "" : "bg-background/30"}`}
                          data-ocid={`order-row-${o.id}`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {o.id.slice(-10)}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(o.date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">
                            {o.name}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">
                            {o.email}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {o.city}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-primary whitespace-nowrap font-bold">
                            ₹{o.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={o.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <select
                                value={o.status}
                                onChange={(e) =>
                                  handleStatusUpdate(
                                    o.id,
                                    e.target.value as LegacyOrder["status"],
                                  )
                                }
                                className="bg-background border border-border rounded text-xs font-mono text-foreground px-2 py-1 focus:border-primary focus:outline-none cursor-pointer"
                                data-ocid={`order-status-${o.id}`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedOrder(isExpanded ? null : o.id)
                                }
                                className="text-xs text-primary hover:underline font-mono whitespace-nowrap"
                                data-ocid={`order-details-btn-${o.id}`}
                              >
                                {isExpanded ? "▲ Hide" : "▼ Details"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expandable detail row */}
                        {isExpanded && (
                          <tr className="bg-primary/5 border-b border-primary/20">
                            <td colSpan={8} className="px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                {[
                                  { label: "Full Order ID", value: o.id },
                                  { label: "Phone", value: o.phone },
                                  { label: "Pincode", value: o.pincode },
                                  { label: "State", value: o.state },
                                  {
                                    label: "Address",
                                    value: o.address,
                                    wide: true,
                                  },
                                ].map((row) => (
                                  <div
                                    key={row.label}
                                    className={
                                      row.wide ? "col-span-2 md:col-span-4" : ""
                                    }
                                  >
                                    <p className="text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
                                      {row.label}
                                    </p>
                                    <p className="text-foreground font-semibold break-all">
                                      {row.value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-card border border-border rounded-lg p-4"
                data-ocid={`order-card-${o.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground mb-0.5">
                      Order
                    </p>
                    <p className="font-mono font-black text-primary text-sm">
                      {o.id.slice(-10)}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-muted-foreground">Buyer</p>
                    <p className="text-foreground font-semibold">{o.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-mono font-bold text-primary">
                      ₹{o.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="text-foreground">
                      {new Date(o.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="text-foreground">{o.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground break-all">{o.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="text-foreground">
                      {o.address}, {o.city}, {o.state} – {o.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono text-muted-foreground">
                    Update Status:
                  </p>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        o.id,
                        e.target.value as LegacyOrder["status"],
                      )
                    }
                    className="flex-1 bg-background border border-border rounded text-xs font-mono text-foreground px-2 py-1.5 focus:border-primary focus:outline-none cursor-pointer"
                    data-ocid={`order-status-mobile-${o.id}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Admin: Complaints Section ────────────────────────────────────

function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    getComplaints().slice().reverse(),
  );

  const handleStatusUpdate = (id: string, status: Complaint["status"]) => {
    updateComplaintStatus(id, status);
    setComplaints(getComplaints().slice().reverse());
    toast.success(`Complaint status updated to ${status}`);
  };

  const COMPLAINT_STATUS_MAP: Record<Complaint["status"], string> = {
    Open: "bg-destructive/10 text-destructive border-destructive/30",
    "In Review": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    Resolved: "bg-primary/10 text-primary border-primary/30",
  };

  const COMPLAINT_STATUS_OPTIONS: Complaint["status"][] = [
    "Open",
    "In Review",
    "Resolved",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
          <span className="text-destructive">Complaints</span>
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Customer complaints — {complaints.length} total.
        </p>
      </div>
      {complaints.length === 0 ? (
        <div
          className="bg-card border border-border rounded-lg px-6 py-16 text-center"
          data-ocid="admin-complaints-empty"
        >
          <MessageSquareWarning className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-display font-bold text-foreground mb-1">
            No complaints yet
          </p>
          <p className="text-sm text-muted-foreground">
            Complaints submitted by customers will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-destructive/30 transition-smooth"
              data-ocid={`complaint-card-${c.id}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-0.5">
                    Complaint ID
                  </p>
                  <p className="font-mono font-black text-destructive text-sm">
                    {c.id}
                  </p>
                </div>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded border whitespace-nowrap ${COMPLAINT_STATUS_MAP[c.status] ?? COMPLAINT_STATUS_MAP.Open}`}
                >
                  {c.status}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="text-foreground font-semibold truncate">
                    {c.name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="text-foreground truncate">{c.email}</p>
                </div>
                {c.orderId && (
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono text-primary">{c.orderId}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="text-foreground">
                    {new Date(c.timestamp).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="bg-background border border-border rounded p-3 mb-3">
                <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-widest">
                  {c.subject}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {c.message}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-muted-foreground">
                  Update Status:
                </p>
                <select
                  value={c.status}
                  onChange={(e) =>
                    handleStatusUpdate(
                      c.id,
                      e.target.value as Complaint["status"],
                    )
                  }
                  className="flex-1 bg-background border border-border rounded text-xs font-mono text-foreground px-2 py-1.5 focus:border-primary focus:outline-none cursor-pointer"
                  data-ocid={`complaint-status-${c.id}`}
                >
                  {COMPLAINT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Admin Dashboard Shell ───────────────────────────────────────

function AdminDashboardPage() {
  const navigate = useNavigate();
  const isAuth = sessionStorage.getItem("admin-auth") === "true";
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <Lock className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground">
            You must log in as admin first.
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-accent"
            onClick={() => navigate({ to: "/admin" })}
          >
            Go to Admin Login
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin-auth");
    navigate({ to: "/admin" });
  };

  const handleNav = (section: AdminSection) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-40 md:hidden w-full h-full cursor-default border-0 p-0"
          onClick={() => setMobileSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <aside
        className={`
        fixed md:sticky top-0 z-50 md:z-auto
        w-64 md:w-60 shrink-0 flex flex-col
        bg-[oklch(0.12_0_0)] border-r border-border
        min-h-screen h-screen overflow-y-auto
        transition-transform duration-300
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="font-display font-black text-sm text-foreground leading-none">
                Admin
              </p>
              <p className="text-xs text-primary font-mono">Panel</p>
            </div>
          </div>
          <button
            type="button"
            className="md:hidden p-1.5 text-muted-foreground hover:text-primary transition-smooth"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav
          className="flex-1 px-3 py-4 flex flex-col gap-1"
          data-ocid="admin-sidebar-nav"
        >
          {ADMIN_NAV.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body text-left transition-smooth ${
                  active
                    ? "bg-[oklch(0.18_0_0)] text-primary border-l-2 border-primary pl-[10px]"
                    : "text-muted-foreground hover:text-primary hover:bg-[oklch(0.15_0_0)]"
                }`}
                data-ocid={`admin-nav-${item.id}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-3 pb-4 border-t border-border pt-4 flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-smooth font-mono"
          >
            <Home className="w-3.5 h-3.5" /> View Store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-smooth font-mono w-full text-left rounded hover:bg-destructive/10"
            data-ocid="admin-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar — with mobile hamburger */}
        <header className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-1.5 text-muted-foreground hover:text-primary transition-smooth -ml-1"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              data-ocid="admin-mobile-menu-btn"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-foreground">
                {ADMIN_NAV.find((n) => n.id === activeSection)?.label}
              </span>
              <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xs hidden sm:flex">
                ADMIN
              </Badge>
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground hidden sm:block truncate max-w-[180px]">
            {ADMIN_EMAIL}
          </span>
        </header>

        <div className="p-4 md:p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {activeSection === "overview" && (
              <AdminOverview onNav={setActiveSection} />
            )}
            {activeSection === "product" && <AdminProductEditor />}
            {activeSection === "settings" && <AdminWebsiteSettings />}
            {activeSection === "orders" && <AdminOrders />}
            {activeSection === "complaints" && <AdminComplaints />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// ── Complaint Box Page (standalone /complaints route) ───────────

function ComplaintBoxPage() {
  return (
    <Layout>
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <AlertOctagon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground uppercase tracking-tight mb-3">
              Complaint <span className="text-primary">Box</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto text-sm">
              Facing an issue? Submit a complaint and our team will get back to
              you within 24–48 hours.
            </p>
          </motion.div>
        </div>
      </section>
      <ComplaintBoxSection />
    </Layout>
  );
}

// ── Router Setup ─────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Outlet />
    </CartProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  validateSearch: (s: Record<string, unknown>): PaymentSearch => ({
    name: typeof s.name === "string" ? s.name : "",
    email: typeof s.email === "string" ? s.email : "",
    phone: typeof s.phone === "string" ? s.phone : "",
    address: typeof s.address === "string" ? s.address : "",
    city: typeof s.city === "string" ? s.city : "",
    state: typeof s.state === "string" ? s.state : "",
    pincode: typeof s.pincode === "string" ? s.pincode : "",
  }),
  component: () => {
    const search = paymentRoute.useSearch();
    return <PaymentPage search={search} />;
  },
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  validateSearch: (s: Record<string, unknown>): SuccessSearch => ({
    name: typeof s.name === "string" ? s.name : "",
    email: typeof s.email === "string" ? s.email : "",
    orderId: typeof s.orderId === "string" ? s.orderId : undefined,
  }),
  component: () => {
    const search = paymentSuccessRoute.useSearch();
    return <PaymentSuccessPage search={search} />;
  },
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  validateSearch: (s: Record<string, unknown>): OrdersSearch => ({
    orderId: typeof s.orderId === "string" ? s.orderId : undefined,
    email: typeof s.email === "string" ? s.email : undefined,
  }),
  component: () => {
    const search = ordersRoute.useSearch();
    return <OrderTrackingPage search={search} />;
  },
});
const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer",
  component: CustomerPage,
});
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});
const complaintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/complaints",
  component: ComplaintBoxPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  checkoutRoute,
  paymentRoute,
  paymentSuccessRoute,
  contactRoute,
  ordersRoute,
  customerRoute,
  adminLoginRoute,
  adminDashboardRoute,
  complaintRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
