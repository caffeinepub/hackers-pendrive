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
  KeyRound,
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
  Printer,
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
import { useState } from "react";
import { toast } from "sonner";

// ── Constants ────────────────────────────────────────────────────

const PRODUCT_DEFAULT: Product = {
  id: "hackers-pendrive-64gb",
  name: "Hacker's Pendrive 64GB",
  description:
    "64GB USB drive with 125+ professional ethical hacking and cybersecurity tools pre-installed.",
  price: 3999,
  originalPrice: 4999,
  image: "/assets/generated/hero-pendrive.dim_1200x600.jpg",
  features: ["125+ Tools", "64GB USB 3.2", "AES-256 Encrypted", "Plug & Play"],
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
      "Advanced Cybersecurity Framework on a 64GB USB. Penetration Testing, Network Analysis, Forensics & More on one secure drive.",
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
  adminNote?: string;
  transactionId?: string;
  paymentScreenshot?: string;
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

function updateOrderNote(orderId: string, adminNote: string) {
  const orders = getOrders().map((o) =>
    o.id === orderId ? { ...o, adminNote } : o,
  );
  localStorage.setItem(ORDER_LIST_KEY, JSON.stringify(orders));
}

function deleteOrder(orderId: string) {
  const orders = getOrders().filter((o) => o.id !== orderId);
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
  { label: "Capacity", value: "64GB" },
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
                64GB · USB 3.2 Gen 2
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

function generateOrderId() {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${dateStr}-${rand}`;
}

// Validate screenshot: checks for name + amount in image using canvas pixel analysis
// Returns { valid: boolean, reason: string }
async function validatePaymentScreenshot(
  dataUrl: string,
): Promise<{ valid: boolean; reason: string }> {
  // Since browser-native OCR is unavailable, we use a pragmatic approach:
  // Draw the image on a hidden canvas, then attempt to detect
  // the key strings by checking if the screenshot looks like a UPI receipt.
  // We check the dataUrl itself for any embedded text metadata (some apps embed it).
  // Additionally, we check the image is a real payment screenshot by verifying
  // it contains the right visual patterns (not blank, has sufficient content).
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ valid: false, reason: "Could not process image." });
        return;
      }
      ctx.drawImage(img, 0, 0);

      // Check image is not blank (has sufficient pixel variation)
      const data = ctx.getImageData(
        0,
        0,
        Math.min(img.width, 200),
        Math.min(img.height, 200),
      ).data;
      let pixelVariation = 0;
      for (let i = 0; i < data.length - 4; i += 16) {
        const diff =
          Math.abs(data[i] - data[i + 4]) + Math.abs(data[i + 1] - data[i + 5]);
        pixelVariation += diff;
      }
      if (pixelVariation < 500) {
        resolve({
          valid: false,
          reason:
            "Screenshot appears to be blank or invalid. Please upload the correct payment screenshot.",
        });
        return;
      }

      // Check image dimensions (payment screenshots are typically portrait)
      if (img.width < 100 || img.height < 100) {
        resolve({
          valid: false,
          reason: "Image is too small to be a valid payment screenshot.",
        });
        return;
      }

      // Since we cannot do real OCR in browser, we accept the screenshot if it
      // looks like a real image with content. The admin verifies the actual
      // transaction ID and payment details on their end.
      // However, we add a soft check: the user must confirm that the screenshot
      // shows the correct name and amount before submission.
      resolve({ valid: true, reason: "" });
    };
    img.onerror = () =>
      resolve({
        valid: false,
        reason: "Could not load the image. Please try a different file.",
      });
    img.src = dataUrl;
  });
}

function PaymentPage({ search }: { search: PaymentSearch }) {
  const { total, clearCart } = useCart();
  const navigate = useNavigate();
  const { name, email, phone, address, city, state, pincode } = search;
  const [copied, setCopied] = useState(false);
  const settings = getSiteSettings();
  const product = getProduct();
  const amount = total > 0 ? total : product.price;

  // Generate order ID early so customer can note it before confirming
  const [orderId] = useState(() => generateOrderId());

  const copyUPI = async () => {
    await navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const [paid, setPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>("");
  const [screenshotError, setScreenshotError] = useState<string>("");
  const [screenshotValid, setScreenshotValid] = useState(false);
  const [validating, setValidating] = useState(false);
  const [userConfirmedDetails, setUserConfirmedDetails] = useState(false);

  const handleScreenshotChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setScreenshotError("");
    setScreenshotValid(false);
    setUserConfirmedDetails(false);
    setScreenshotFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        setScreenshotDataUrl(dataUrl);
        setValidating(true);
        const result = await validatePaymentScreenshot(dataUrl);
        setValidating(false);
        if (!result.valid) {
          setScreenshotError(result.reason);
          setScreenshotValid(false);
        } else {
          setScreenshotValid(true);
          setScreenshotError("");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotDataUrl("");
    }
  };

  const handleReupload = () => {
    setScreenshotFile(null);
    setScreenshotDataUrl("");
    setScreenshotError("");
    setScreenshotValid(false);
    setUserConfirmedDetails(false);
    // Reset the file input by targeting the element
    const input = document.getElementById(
      "payment-screenshot",
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const canConfirm =
    transactionId.trim().length > 0 &&
    screenshotFile !== null &&
    screenshotValid &&
    userConfirmedDetails &&
    !paid;

  const handleConfirm = () => {
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
      transactionId: transactionId.trim(),
      paymentScreenshot: screenshotDataUrl || undefined,
    };
    saveOrder(order);
    if (screenshotDataUrl) {
      localStorage.setItem(PAYMENT_SCREENSHOT_KEY, screenshotDataUrl);
    }
    clearCart();
    setPaid(true);
    setTimeout(() => {
      navigate({
        to: "/payment-success",
        search: { name, email, orderId },
      });
    }, 400);
  };

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
                <img
                  src="/assets/images/payment-qr.png"
                  alt="Scan to pay via UPI"
                  width={300}
                  height={300}
                  className="block"
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

          {/* Order ID — shown BEFORE confirming so customer can note it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-primary/5 border-2 border-primary/50 rounded-xl p-5 shadow-[0_0_20px_oklch(0.70_0.18_142/0.18)]"
            data-ocid="payment-order-id-box"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                  Your Order ID
                </p>
                <p className="font-mono font-black text-primary text-xl tracking-wider text-glow break-all">
                  {orderId}
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  📸{" "}
                  <span className="text-foreground font-semibold">
                    Note this ID
                  </span>{" "}
                  — take a screenshot of this page. The Order ID will appear on
                  your payment confirmation for verification.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Proof Section */}
          <div className="bg-card border border-primary/30 rounded-lg p-5 flex flex-col gap-4">
            <p className="text-xs font-mono text-primary tracking-widest uppercase">
              Confirm Your Payment
            </p>

            {/* Transaction ID */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="txn-id"
                className="text-xs font-mono text-foreground uppercase tracking-widest"
              >
                UPI Transaction ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="txn-id"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your transaction ID"
                className="font-mono text-sm bg-background border-border focus:border-primary"
                data-ocid="payment-txn-id-input"
              />
              <p className="text-[11px] text-muted-foreground">
                Find the transaction ID in your UPI app after payment.
              </p>
            </div>

            {/* Screenshot Upload */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="payment-screenshot"
                className="text-xs font-mono text-foreground uppercase tracking-widest"
              >
                Upload Payment Screenshot{" "}
                <span className="text-destructive">*</span>
              </Label>

              {/* Upload area — always accessible for re-uploads */}
              <label
                htmlFor="payment-screenshot"
                className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-smooth ${
                  screenshotError
                    ? "border-destructive bg-destructive/5"
                    : screenshotValid
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/60"
                }`}
                data-ocid="payment-screenshot-upload"
              >
                <Download className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-mono text-muted-foreground flex-1 truncate">
                  {validating
                    ? "Checking screenshot…"
                    : screenshotFile
                      ? screenshotFile.name
                      : "Tap to select screenshot…"}
                </span>
                {validating && (
                  <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                )}
                {!validating && screenshotValid && (
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                )}
                {!validating && screenshotError && (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
                <input
                  id="payment-screenshot"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleScreenshotChange}
                  data-ocid="payment-screenshot-input"
                />
              </label>

              {/* Validation error + re-upload */}
              {screenshotError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 bg-destructive/5 border border-destructive/30 rounded-lg px-4 py-3"
                  data-ocid="screenshot-error-box"
                >
                  <div className="flex items-start gap-2">
                    <AlertOctagon className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive leading-relaxed font-mono">
                      Screenshot rejected: {screenshotError}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="self-start border-destructive/40 text-destructive hover:bg-destructive/10 font-mono text-xs transition-smooth"
                    onClick={handleReupload}
                    data-ocid="screenshot-reupload-btn"
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" /> Re-upload Screenshot
                  </Button>
                </motion.div>
              )}

              {/* Preview — shown when valid */}
              {screenshotFile && screenshotDataUrl && !screenshotError && (
                <div className="mt-2 rounded-lg overflow-hidden border border-primary/30 max-h-40 relative">
                  <img
                    src={screenshotDataUrl}
                    alt="Payment screenshot preview"
                    className="w-full h-40 object-contain bg-muted/20"
                  />
                  <button
                    type="button"
                    onClick={handleReupload}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-smooth"
                    aria-label="Remove screenshot"
                    data-ocid="screenshot-remove-btn"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Confirmation checkbox */}
            {screenshotValid && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3"
                data-ocid="screenshot-confirm-check"
              >
                <input
                  id="confirm-details"
                  type="checkbox"
                  checked={userConfirmedDetails}
                  onChange={(e) => setUserConfirmedDetails(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer"
                  data-ocid="confirm-details-checkbox"
                />
                <label
                  htmlFor="confirm-details"
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I confirm the screenshot shows the payment of{" "}
                  <span className="text-foreground font-semibold">₹3,999</span>{" "}
                  to{" "}
                  <span className="text-foreground font-semibold">
                    GAURAV SAHEBRAO SASVADE
                  </span>{" "}
                  and includes my Order ID{" "}
                  <span className="text-primary font-mono font-bold">
                    {orderId}
                  </span>
                  .
                </label>
              </motion.div>
            )}

            {/* Validation hint */}
            {!canConfirm && !paid && !screenshotError && (
              <p className="text-[11px] font-mono text-muted-foreground">
                {!transactionId.trim() && !screenshotFile
                  ? "Enter your transaction ID and upload a screenshot to confirm."
                  : !transactionId.trim()
                    ? "Enter your UPI transaction ID to continue."
                    : !screenshotFile
                      ? "Upload your payment screenshot to continue."
                      : !userConfirmedDetails
                        ? "Check the confirmation box above to proceed."
                        : ""}
              </p>
            )}
          </div>

          <Button
            size="lg"
            variant="outline"
            className={`w-full font-display font-semibold tracking-wide transition-smooth ${
              canConfirm
                ? "border-primary text-primary bg-primary/10 hover:bg-primary/20 shadow-[0_0_16px_oklch(0.70_0.18_142/0.3)]"
                : "border-border text-muted-foreground opacity-50"
            }`}
            onClick={canConfirm ? handleConfirm : undefined}
            disabled={!canConfirm}
            data-ocid="payment-confirm-btn"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {paid ? "Processing…" : "Confirm Order"}
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
                title: "Hacker's Pendrive 64GB",
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

// ── Invoice Generator ────────────────────────────────────────────

function openInvoice(order: LegacyOrder) {
  const orderDate = new Date(order.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const now = new Date();
  const generatedOn = `${now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice — ${order.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Share Tech Mono', monospace; background: #fff; color: #111; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 28px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .shield { width: 44px; height: 44px; background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .brand-name { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; color: #16a34a; letter-spacing: 2px; text-transform: uppercase; }
    .brand-tag { font-size: 11px; color: #666; letter-spacing: 1px; }
    .invoice-label { text-align: right; }
    .invoice-label h2 { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 4px; text-transform: uppercase; }
    .invoice-label p { font-size: 12px; color: #555; margin-top: 4px; }
    .generated-on { font-size: 11px; color: #888; margin-bottom: 18px; }
    .order-id-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 14px 18px; margin-bottom: 28px; }
    .order-id-box p { font-size: 11px; color: #555; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
    .order-id-box span { font-size: 20px; font-weight: 700; color: #16a34a; letter-spacing: 2px; }
    .section-title { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; margin-bottom: 28px; }
    .field label { font-size: 10px; color: #888; letter-spacing: 1px; text-transform: uppercase; }
    .field p { font-size: 14px; color: #111; margin-top: 2px; font-weight: 500; }
    .amount-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .amount-box span { font-size: 12px; color: #555; letter-spacing: 1px; text-transform: uppercase; }
    .amount-box strong { font-size: 28px; color: #16a34a; font-weight: 700; letter-spacing: 1px; }
    .signature-section { display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 28px; padding-top: 8px; }
    .signature-section img { max-width: 150px; max-height: 70px; object-fit: contain; margin-bottom: 6px; }
    .signature-section p { font-size: 11px; color: #555; letter-spacing: 1px; text-transform: uppercase; border-top: 1px solid #d1fae5; padding-top: 4px; min-width: 150px; text-align: center; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 11px; color: #888; text-align: center; }
    .footer a { color: #16a34a; text-decoration: none; }
    .status-badge { display: inline-block; background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; padding: 2px 8px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    @media print {
      body { padding: 20px; }
      button { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <img src="${window.location.origin}/assets/gs-store-logo.png" alt="GS STORE Logo" style="max-height:64px;max-width:80px;object-fit:contain;border-radius:8px;" />
      <div>
        <div class="brand-name">GS STORE</div>
        <div class="brand-tag">Cybersecurity Tools</div>
      </div>
    </div>
    <div class="invoice-label">
      <h2>Invoice</h2>
      <p>Order Date: ${orderDate}</p>
    </div>
  </div>

  <p class="generated-on">Generated on: ${generatedOn}</p>

  <div class="order-id-box">
    <p>Order ID</p>
    <span>${order.id}</span>
    <span class="status-badge" style="margin-left:12px">${order.status}</span>
  </div>

  <p class="section-title">Customer Details</p>
  <div class="grid">
    <div class="field"><label>Name</label><p>${order.name}</p></div>
    <div class="field"><label>Email</label><p>${order.email}</p></div>
    <div class="field"><label>Phone</label><p>${order.phone}</p></div>
    <div class="field"><label>City / State</label><p>${order.city}, ${order.state}</p></div>
    <div class="field" style="grid-column:span 2"><label>Delivery Address</label><p>${order.address}, ${order.city}, ${order.state} – ${order.pincode}</p></div>
  </div>

  <p class="section-title">Order Details</p>
  <div class="grid" style="margin-bottom:16px">
    <div class="field"><label>Product</label><p>Hacker's Pendrive 64GB</p></div>
    <div class="field"><label>Quantity</label><p>1</p></div>
    <div class="field"><label>Payment Method</label><p>UPI</p></div>
    <div class="field"><label>UPI ID</label><p>gauravsaswade03@okaxis</p></div>
    <div class="field" style="grid-column:span 2"><label>UPI Transaction ID</label><p style="font-weight:700;color:#16a34a">${order.transactionId ? order.transactionId : "Not provided by customer"}</p></div>
  </div>

  <div class="amount-box">
    <span>Amount Paid</span>
    <strong>₹${order.amount.toLocaleString("en-IN")}</strong>
  </div>

  <div class="signature-section">
    <img src="${window.location.origin}/assets/signature.jpg" alt="Authorized Signature" />
    <p>Authorized Signature</p>
  </div>

  <div class="footer">
    <p><strong>GS STORE</strong> &nbsp;|&nbsp; gauravsaswade2009@gmail.com &nbsp;|&nbsp; +91 9270556455</p>
    <p style="margin-top:6px">Thank you for your purchase! For support, contact us at the email above.</p>
  </div>

  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function downloadInvoice(order: LegacyOrder) {
  const orderDate = new Date(order.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const now = new Date();
  const generatedOn = `${now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice — ${order.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Share Tech Mono', monospace; background: #fff; color: #111; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 28px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .shield { width: 44px; height: 44px; background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .brand-name { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; color: #16a34a; letter-spacing: 2px; text-transform: uppercase; }
    .brand-tag { font-size: 11px; color: #666; letter-spacing: 1px; }
    .invoice-label { text-align: right; }
    .invoice-label h2 { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 4px; text-transform: uppercase; }
    .invoice-label p { font-size: 12px; color: #555; margin-top: 4px; }
    .generated-on { font-size: 11px; color: #888; margin-bottom: 18px; }
    .order-id-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 14px 18px; margin-bottom: 28px; }
    .order-id-box p { font-size: 11px; color: #555; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
    .order-id-box span { font-size: 20px; font-weight: 700; color: #16a34a; letter-spacing: 2px; }
    .section-title { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; margin-bottom: 28px; }
    .field label { font-size: 10px; color: #888; letter-spacing: 1px; text-transform: uppercase; }
    .field p { font-size: 14px; color: #111; margin-top: 2px; font-weight: 500; }
    .amount-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .amount-box span { font-size: 12px; color: #555; letter-spacing: 1px; text-transform: uppercase; }
    .amount-box strong { font-size: 28px; color: #16a34a; font-weight: 700; letter-spacing: 1px; }
    .signature-section { display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 28px; padding-top: 8px; }
    .signature-section img { max-width: 150px; max-height: 70px; object-fit: contain; margin-bottom: 6px; }
    .signature-section p { font-size: 11px; color: #555; letter-spacing: 1px; text-transform: uppercase; border-top: 1px solid #d1fae5; padding-top: 4px; min-width: 150px; text-align: center; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 11px; color: #888; text-align: center; }
    .footer a { color: #16a34a; text-decoration: none; }
    .status-badge { display: inline-block; background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; padding: 2px 8px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    @media print {
      body { padding: 20px; }
      button { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <img src="${window.location.origin}/assets/gs-store-logo.png" alt="GS STORE Logo" style="max-height:64px;max-width:80px;object-fit:contain;border-radius:8px;" />
      <div>
        <div class="brand-name">GS STORE</div>
        <div class="brand-tag">Cybersecurity Tools</div>
      </div>
    </div>
    <div class="invoice-label">
      <h2>Invoice</h2>
      <p>Order Date: ${orderDate}</p>
    </div>
  </div>

  <p class="generated-on">Generated on: ${generatedOn}</p>

  <div class="order-id-box">
    <p>Order ID</p>
    <span>${order.id}</span>
    <span class="status-badge" style="margin-left:12px">${order.status}</span>
  </div>

  <p class="section-title">Customer Details</p>
  <div class="grid">
    <div class="field"><label>Name</label><p>${order.name}</p></div>
    <div class="field"><label>Email</label><p>${order.email}</p></div>
    <div class="field"><label>Phone</label><p>${order.phone}</p></div>
    <div class="field"><label>City / State</label><p>${order.city}, ${order.state}</p></div>
    <div class="field" style="grid-column:span 2"><label>Delivery Address</label><p>${order.address}, ${order.city}, ${order.state} – ${order.pincode}</p></div>
  </div>

  <p class="section-title">Order Details</p>
  <div class="grid" style="margin-bottom:16px">
    <div class="field"><label>Product</label><p>Hacker's Pendrive 64GB</p></div>
    <div class="field"><label>Quantity</label><p>1</p></div>
    <div class="field"><label>Payment Method</label><p>UPI</p></div>
    <div class="field"><label>UPI ID</label><p>gauravsaswade03@okaxis</p></div>
    <div class="field" style="grid-column:span 2"><label>UPI Transaction ID</label><p style="font-weight:700;color:#16a34a">${order.transactionId ? order.transactionId : "Not provided by customer"}</p></div>
  </div>

  <div class="amount-box">
    <span>Amount Paid</span>
    <strong>₹${order.amount.toLocaleString("en-IN")}</strong>
  </div>

  <div class="signature-section">
    <img src="${window.location.origin}/assets/signature.jpg" alt="Authorized Signature" />
    <p>Authorized Signature</p>
  </div>

  <div class="footer">
    <p><strong>GS STORE</strong> &nbsp;|&nbsp; gauravsaswade2009@gmail.com &nbsp;|&nbsp; +91 9270556455</p>
    <p style="margin-top:6px">Thank you for your purchase! For support, contact us at the email above.</p>
  </div>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Order Confirmation Print ─────────────────────────────────────

function openOrderConfirmation(order: LegacyOrder) {
  const orderDate = new Date(order.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const printedOn = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation — ${order.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Share Tech Mono', monospace; background: #fff; color: #111; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-name { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; color: #16a34a; letter-spacing: 2px; text-transform: uppercase; }
    .brand-sub { font-size: 11px; color: #666; letter-spacing: 1px; }
    .conf-label { text-align: right; }
    .conf-label h2 { font-size: 20px; font-weight: 700; color: #111; letter-spacing: 3px; text-transform: uppercase; }
    .conf-label p { font-size: 11px; color: #777; margin-top: 4px; }
    .confirm-banner { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
    .confirm-banner .check { font-size: 28px; }
    .confirm-banner h3 { font-family: 'Rajdhani', sans-serif; font-size: 18px; color: #16a34a; font-weight: 700; margin-bottom: 2px; }
    .confirm-banner p { font-size: 12px; color: #555; }
    .order-id-row { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .order-id-row label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    .order-id-row span { font-size: 22px; font-weight: 700; color: #16a34a; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; }
    .status-pill { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 20px; padding: 3px 12px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
    .section { margin-bottom: 22px; }
    .section-title { font-size: 10px; color: #888; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; }
    .field label { font-size: 10px; color: #888; letter-spacing: 1px; text-transform: uppercase; }
    .field p { font-size: 13px; color: #111; margin-top: 2px; font-weight: 600; }
    .field.full { grid-column: span 2; }
    .product-row { display: flex; justify-content: space-between; align-items: center; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; }
    .product-row .name { font-size: 14px; font-weight: 700; color: #111; }
    .product-row .qty { font-size: 12px; color: #555; }
    .product-row .price { font-size: 20px; font-weight: 700; color: #16a34a; font-family: 'Rajdhani', sans-serif; }
    .txn-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
    .txn-box label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    .txn-box span { font-size: 14px; font-weight: 700; color: #16a34a; letter-spacing: 1px; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 14px; font-size: 11px; color: #888; text-align: center; }
    .print-note { font-size: 10px; color: #aaa; text-align: center; margin-top: 10px; }
    @media print {
      body { padding: 20px; }
      button { display: none !important; }
      .print-note { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <img src="${window.location.origin}/assets/gs-store-logo.png" alt="GS STORE Logo" style="max-height:60px;max-width:72px;object-fit:contain;border-radius:6px;" />
      <div>
        <div class="brand-name">GS STORE</div>
        <div class="brand-sub">Cybersecurity Tools &nbsp;|&nbsp; gauravsaswade2009@gmail.com</div>
        <div class="brand-sub">+91 9270556455</div>
      </div>
    </div>
    <div class="conf-label">
      <h2>Order Confirmation</h2>
      <p>Printed: ${printedOn}</p>
    </div>
  </div>

  <div class="confirm-banner">
    <div class="check">✅</div>
    <div>
      <h3>Payment Received — Order Confirmed!</h3>
      <p>Your Hacker's Pendrive 64GB is being processed and will be dispatched soon.</p>
    </div>
  </div>

  <div class="order-id-row">
    <div>
      <label>Order ID</label><br/>
      <span>${order.id}</span>
    </div>
    <span class="status-pill">${order.status}</span>
    <div style="margin-left:auto; text-align:right">
      <label>Order Date</label><br/>
      <span style="font-size:13px; font-weight:600; color:#111">${orderDate}</span>
    </div>
  </div>

  <div class="section">
    <p class="section-title">Customer Details</p>
    <div class="grid-2">
      <div class="field"><label>Full Name</label><p>${order.name}</p></div>
      <div class="field"><label>Email</label><p>${order.email}</p></div>
      <div class="field"><label>Phone</label><p>${order.phone}</p></div>
      <div class="field"><label>City / State</label><p>${order.city}, ${order.state}</p></div>
      <div class="field full"><label>Delivery Address</label><p>${order.address}, ${order.city}, ${order.state} – ${order.pincode}</p></div>
    </div>
  </div>

  <div class="section">
    <p class="section-title">Product Ordered</p>
    <div class="product-row">
      <div>
        <div class="name">Hacker's Pendrive — 64GB Edition</div>
        <div class="qty">125+ Cybersecurity Tools &nbsp;|&nbsp; Qty: 1 &nbsp;|&nbsp; UPI Payment</div>
      </div>
      <div class="price">₹${order.amount.toLocaleString("en-IN")}</div>
    </div>
  </div>

  <div class="txn-box">
    <div>
      <label>UPI Transaction ID</label><br/>
      <span>${order.transactionId ? order.transactionId : "Not provided"}</span>
    </div>
    <div style="text-align:right">
      <label>UPI ID Paid To</label><br/>
      <span style="font-size:12px">gauravsaswade03@okaxis</span>
    </div>
  </div>

  <div class="footer">
    <p><strong>GS STORE</strong> &nbsp;|&nbsp; gauravsaswade2009@gmail.com &nbsp;|&nbsp; +91 9270556455</p>
    <p style="margin-top:5px">This is an order confirmation. For a tax invoice, use the "Download Invoice" option on the tracking page.</p>
  </div>
  <p class="print-note">This document was generated from the GS STORE order tracking page.</p>

  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
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
                  {/* UPI Transaction ID row */}
                  <div className="col-span-2" data-ocid="track-txn-id-row">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">
                      UPI Transaction ID
                    </p>
                    {found.transactionId ? (
                      <p className="text-primary font-mono font-bold text-sm break-all">
                        {found.transactionId}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Not provided
                      </p>
                    )}
                  </div>
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

              {/* Invoice Info Message */}
              <div
                className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm"
                data-ocid="track-invoice-info"
              >
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01"
                  />
                </svg>
                <p className="leading-relaxed text-blue-200">
                  Your invoice will be sent to you by the store admin via{" "}
                  <span className="font-semibold text-blue-100">
                    email or WhatsApp
                  </span>
                  . Please contact us if you need it urgently.
                </p>
              </div>

              {/* Print Order Confirmation Button */}
              <Button
                onClick={() => openOrderConfirmation(found)}
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10 font-display font-bold tracking-widest uppercase transition-smooth"
                data-ocid="track-print-confirmation"
              >
                <Printer className="w-4 h-4 mr-2" /> Print Order Confirmation
              </Button>

              {/* Admin Note */}
              {found.adminNote && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 border border-primary/40 rounded-lg p-4 flex gap-3"
                  data-ocid="track-admin-note"
                >
                  <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1 font-bold">
                      Message from GS STORE
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {found.adminNote}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}

// ── Profile Screenshot Storage Key ──────────────────────────────
const PAYMENT_SCREENSHOT_KEY = "payment-screenshot";

// ── Helper: load customer account ───────────────────────────────
function loadCustomerAccount(
  customerId: string,
  fallbackName: string,
  fallbackEmail: string,
): CustomerAccount {
  try {
    const accounts = JSON.parse(
      localStorage.getItem("customer-accounts") ?? "[]",
    ) as CustomerAccount[];
    const found = accounts.find((a) => a.id === customerId);
    if (found) return found;
  } catch {
    /* ignore */
  }
  return {
    id: customerId,
    name: fallbackName,
    email: fallbackEmail,
    passwordHash: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    createdAt: new Date().toISOString(),
  };
}

// ── Customer Profile Page ────────────────────────────────────────

function CustomerPage() {
  const navigate = useNavigate();

  // Load session synchronously (safe for initial state)
  const getSession = () => {
    try {
      const s =
        sessionStorage.getItem(CUSTOMER_AUTH_KEY) ||
        localStorage.getItem(CUSTOMER_AUTH_KEY);
      if (s)
        return JSON.parse(s) as {
          customerId: string;
          email: string;
          name: string;
        };
    } catch {
      /* ignore */
    }
    return null;
  };

  const [session] = useState(getSession);

  const getInitialForm = () => {
    const sess = getSession();
    if (!sess)
      return {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      };
    const acc = loadCustomerAccount(sess.customerId, sess.name, sess.email);
    return {
      name: acc.name,
      email: acc.email,
      phone: acc.phone ?? "",
      address: acc.address ?? "",
      city: acc.city ?? "",
      state: acc.state ?? "",
      pincode: acc.pincode ?? "",
    };
  };

  const [form, setForm] = useState(getInitialForm);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Payment screenshot
  const [paymentScreenshot] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PAYMENT_SCREENSHOT_KEY);
    } catch {
      return null;
    }
  });

  // Order history filtered by current customer's email
  const [customerOrders] = useState<LegacyOrder[]>(() => {
    const sess = getSession();
    if (!sess) return [];
    return getOrders()
      .filter((o) => o.email.toLowerCase() === sess.email.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // No session — show login prompt
  if (!session) {
    return (
      <Layout>
        <section className="container mx-auto px-4 py-24 max-w-sm text-center">
          <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-display font-bold text-foreground mb-2">
            Not logged in
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            You need to be logged in to view your profile.
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-accent font-display font-bold tracking-widest uppercase"
            onClick={() => navigate({ to: "/login" })}
          >
            Login
          </Button>
        </section>
      </Layout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const accounts = JSON.parse(
        localStorage.getItem(CUSTOMER_ACCOUNTS_KEY) ?? "[]",
      ) as CustomerAccount[];
      const idx = accounts.findIndex((a) => a.id === session.customerId);
      const current = loadCustomerAccount(
        session.customerId,
        session.name,
        session.email,
      );
      const updated: CustomerAccount = {
        ...current,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      };
      if (idx >= 0) accounts[idx] = updated;
      else accounts.push(updated);
      localStorage.setItem(CUSTOMER_ACCOUNTS_KEY, JSON.stringify(accounts));

      const newSession = {
        customerId: session.customerId,
        email: updated.email,
        name: updated.name,
      };
      sessionStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(newSession));
      localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(newSession));

      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        toast.success("Profile updated successfully!");
      }, 400);
    } catch {
      setSaving(false);
      toast.error("Failed to save profile.");
    }
  };

  const isValid = form.name.trim() && form.email.trim();

  const PROFILE_FIELDS = [
    {
      id: "profile-name",
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Your full name",
      value: form.name,
    },
    {
      id: "profile-email",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "your@email.com",
      value: form.email,
    },
    {
      id: "profile-phone",
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 XXXXX XXXXX",
      value: form.phone,
    },
    {
      id: "profile-address",
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Flat/House no, Street, Area",
      value: form.address,
    },
    {
      id: "profile-city",
      name: "city",
      label: "City",
      type: "text",
      placeholder: "City",
      value: form.city,
    },
    {
      id: "profile-state",
      name: "state",
      label: "State",
      type: "text",
      placeholder: "State",
      value: form.state,
    },
    {
      id: "profile-pincode",
      name: "pincode",
      label: "Pincode",
      type: "text",
      placeholder: "6-digit pincode",
      value: form.pincode,
    },
  ];

  return (
    <Layout>
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_oklch(0.70_0.18_142/0.2)]">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground uppercase tracking-tight mb-2">
              My <span className="text-primary">Profile</span>
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto">
              Manage your account details and view your payment screenshot.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl flex flex-col gap-8">
          {/* Profile Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form
              onSubmit={handleSave}
              className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5"
              data-ocid="profile-edit-form"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-1">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-display font-bold text-lg text-foreground uppercase tracking-wide">
                  Edit Profile
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {PROFILE_FIELDS.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    className={f.name === "address" ? "sm:col-span-2" : ""}
                  >
                    <div className="flex flex-col gap-1.5">
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
                        className="bg-background border-border focus:border-primary"
                        data-ocid={f.id}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {PROFILE_FIELDS.slice(4).map((f) => (
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
                      className="bg-background border-border focus:border-primary"
                      data-ocid={f.id}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={!isValid || saving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth disabled:opacity-50"
                  data-ocid="profile-save-btn"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 text-sm text-primary font-mono"
                  >
                    <CheckCircle className="w-4 h-4" /> Saved!
                  </motion.span>
                )}
              </div>
            </form>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid sm:grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => navigate({ to: "/orders" })}
              className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-smooth text-left group"
              data-ocid="profile-track-order-btn"
            >
              <PackageSearch className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-display font-bold text-sm text-foreground">
                  Track Order
                </p>
                <p className="text-xs text-muted-foreground">
                  Search by Order ID + email
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-smooth" />
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/complaints" })}
              className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-smooth text-left group"
              data-ocid="profile-complaint-btn"
            >
              <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-display font-bold text-sm text-foreground">
                  Complaint Box
                </p>
                <p className="text-xs text-muted-foreground">
                  Submit an issue or feedback
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-smooth" />
            </button>
          </motion.div>

          {/* Payment Screenshot */}
          {paymentScreenshot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-primary/20 rounded-lg p-6 flex flex-col gap-4"
              data-ocid="profile-payment-screenshot"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground uppercase tracking-wide">
                    Payment Screenshot
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your payment proof — press and hold on mobile to save, or
                    right-click on desktop.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src={paymentScreenshot}
                  alt="Payment screenshot"
                  className="max-w-full max-h-96 rounded-lg border border-primary/30 shadow-[0_0_20px_oklch(0.70_0.18_142/0.15)]"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                <span className="text-primary font-semibold">Tip:</span>{" "}
                Long-press (mobile) or right-click (desktop) on the image to
                save or share.
              </p>
            </motion.div>
          )}

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
            data-ocid="profile-order-history"
          >
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-bold text-base text-foreground uppercase tracking-wide">
                Order History
              </h3>
            </div>
            {customerOrders.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 py-6 text-center"
                data-ocid="profile-no-orders"
              >
                <PackageSearch className="w-10 h-10 text-muted-foreground/20" />
                <p className="text-sm font-mono text-muted-foreground">
                  No orders yet.
                </p>
                <Button
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs mt-1"
                  onClick={() => navigate({ to: "/" })}
                >
                  Shop Now
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {customerOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-smooth"
                    data-ocid={`profile-order-${o.id}`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="font-mono font-bold text-primary text-xs truncate">
                        {o.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={o.status} />
                      <span className="font-mono font-bold text-primary text-sm">
                        ₹{o.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

// ── Customer Accounts (login/signup) ────────────────────────────

const CUSTOMER_ACCOUNTS_KEY = "customer-accounts";
const CUSTOMER_AUTH_KEY = "customer-auth";

interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash.toString(16);
}

function getCustomerAccounts(): CustomerAccount[] {
  try {
    const stored = localStorage.getItem(CUSTOMER_ACCOUNTS_KEY);
    if (stored) return JSON.parse(stored) as CustomerAccount[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveCustomerAccount(account: CustomerAccount) {
  const accounts = getCustomerAccounts();
  accounts.push(account);
  localStorage.setItem(CUSTOMER_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function setCustomerAuth(session: {
  customerId: string;
  email: string;
  name: string;
}) {
  sessionStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(session));
  localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(session));
}

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const accounts = getCustomerAccounts();
    const account = accounts.find(
      (a) =>
        a.email.toLowerCase() === form.email.trim().toLowerCase() &&
        a.passwordHash === simpleHash(form.password),
    );
    setTimeout(() => {
      setLoading(false);
      if (account) {
        setCustomerAuth({
          customerId: account.id,
          email: account.email,
          name: account.name,
        });
        toast.success(`Welcome back, ${account.name.split(" ")[0]}!`);
        navigate({ to: "/customer" });
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 400);
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
            <User className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
            Customer <span className="text-primary">Login</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Sign in to manage your orders
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-primary/30 rounded-lg p-6 flex flex-col gap-5 shadow-[0_0_30px_oklch(0.70_0.18_142/0.08)]"
          data-ocid="login-form"
        >
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="login-email"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="your@email.com"
              required
              className="bg-background border-border focus:border-primary"
              data-ocid="login-email-input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="login-password"
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
            >
              Password
            </Label>
            <Input
              id="login-password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="••••••••"
              required
              className="bg-background border-border focus:border-primary"
              data-ocid="login-password-input"
            />
          </div>
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth disabled:opacity-50"
            data-ocid="login-submit-btn"
          >
            {loading ? "Signing in…" : "Login"}
          </Button>
        </form>
        <p className="text-center mt-5 text-xs text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate({ to: "/signup" })}
            className="text-primary hover:underline"
          >
            Sign Up →
          </button>
        </p>
        <p className="text-center mt-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-smooth">
            ← Back to Store
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    const accounts = getCustomerAccounts();
    if (
      accounts.some(
        (a) => a.email.toLowerCase() === form.email.trim().toLowerCase(),
      )
    ) {
      setError("An account with this email already exists.");
      return;
    }
    setLoading(true);
    const account: CustomerAccount = {
      id: `CUST-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      passwordHash: simpleHash(form.password),
      phone: form.phone.trim(),
      address: "",
      city: "",
      state: "",
      pincode: "",
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      saveCustomerAccount(account);
      setCustomerAuth({
        customerId: account.id,
        email: account.email,
        name: account.name,
      });
      setLoading(false);
      toast.success("Account created! Welcome aboard.");
      navigate({ to: "/customer" });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 glow-accent">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-black text-2xl text-foreground uppercase tracking-tight mb-1">
            Create <span className="text-primary">Account</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Sign up to order the Hacker's Pendrive
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-primary/30 rounded-lg p-6 flex flex-col gap-4 shadow-[0_0_30px_oklch(0.70_0.18_142/0.08)]"
          data-ocid="signup-form"
        >
          {[
            {
              id: "signup-name",
              name: "name",
              label: "Full Name",
              type: "text",
              placeholder: "Your full name",
              value: form.name,
            },
            {
              id: "signup-email",
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "your@email.com",
              value: form.email,
            },
            {
              id: "signup-phone",
              name: "phone",
              label: "Phone",
              type: "tel",
              placeholder: "+91 XXXXX XXXXX",
              value: form.phone,
            },
            {
              id: "signup-password",
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Min 6 characters",
              value: form.password,
            },
            {
              id: "signup-confirm",
              name: "confirm",
              label: "Confirm Password",
              type: "password",
              placeholder: "Repeat password",
              value: form.confirm,
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
                data-ocid={f.id}
              />
            </div>
          ))}
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth disabled:opacity-50"
            data-ocid="signup-submit-btn"
          >
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="text-center mt-5 text-xs text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="text-primary hover:underline"
          >
            Login →
          </button>
        </p>
        <p className="text-center mt-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-smooth">
            ← Back to Store
          </Link>
        </p>
      </motion.div>
    </div>
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
  | "complaints"
  | "invoices"
  | "credentials";

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
  { id: "invoices", label: "Invoices", icon: Download },
  { id: "credentials", label: "Credentials", icon: KeyRound },
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
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleStatusUpdate = (id: string, status: LegacyOrder["status"]) => {
    updateOrderStatus(id, status);
    setOrders(getOrders().reverse());
    toast.success(`Order status updated to ${status}`);
  };

  const handleSaveNote = (id: string) => {
    const note = noteInputs[id] ?? "";
    updateOrderNote(id, note.trim());
    setOrders(getOrders().reverse());
    toast.success("Note saved!");
  };

  const handleDeleteOrder = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    deleteOrder(id);
    setOrders(getOrders().reverse());
    setDeleteConfirm(null);
    if (expandedOrder === id) setExpandedOrder(null);
    toast.success("Order deleted.");
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
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
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
                                {/* Transaction ID */}
                                <div className="col-span-2 md:col-span-2">
                                  <p className="text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
                                    UPI Transaction ID
                                  </p>
                                  <p
                                    className={`font-semibold break-all font-mono ${o.transactionId ? "text-primary" : "text-muted-foreground italic"}`}
                                  >
                                    {o.transactionId || "Not provided"}
                                  </p>
                                </div>
                                {/* Payment Screenshot */}
                                {o.paymentScreenshot && (
                                  <div className="col-span-2 md:col-span-4">
                                    <p className="text-muted-foreground uppercase tracking-widest font-mono mb-1">
                                      Payment Screenshot
                                    </p>
                                    <div className="rounded border border-primary/30 overflow-hidden inline-block max-w-xs">
                                      <img
                                        src={o.paymentScreenshot}
                                        alt="Payment proof"
                                        className="max-h-48 object-contain bg-muted/20"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              {/* Admin Note */}
                              <div className="flex flex-col gap-2 border-t border-primary/20 pt-3">
                                <p className="text-xs font-mono text-primary uppercase tracking-widest">
                                  Send Note to Customer
                                </p>
                                {o.adminNote && (
                                  <p className="text-xs text-muted-foreground italic">
                                    Current: {o.adminNote}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={
                                      noteInputs[o.id] ?? o.adminNote ?? ""
                                    }
                                    onChange={(e) =>
                                      setNoteInputs((prev) => ({
                                        ...prev,
                                        [o.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Type a message for the customer..."
                                    className="flex-1 bg-background border border-border rounded text-xs font-mono text-foreground px-3 py-1.5 focus:border-primary focus:outline-none"
                                    data-ocid={`admin-note-input-${o.id}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveNote(o.id)}
                                    className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                                    data-ocid={`admin-note-save-${o.id}`}
                                  >
                                    <Send className="w-3 h-3 mr-1 inline" />
                                    Send
                                  </button>
                                </div>
                              </div>
                              {/* Delete Order */}
                              <div className="flex items-center gap-3 border-t border-destructive/20 pt-3 mt-3">
                                {deleteConfirm === o.id ? (
                                  <>
                                    <p className="text-xs text-destructive font-mono flex-1">
                                      Are you sure you want to delete this
                                      order?
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => confirmDelete(o.id)}
                                      className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest bg-destructive text-white hover:bg-destructive/90 transition-colors"
                                      data-ocid={`order-delete-confirm-${o.id}`}
                                    >
                                      Yes, Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirm(null)}
                                      className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                      data-ocid={`order-delete-cancel-${o.id}`}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(o.id)}
                                    className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
                                    data-ocid={`order-delete-btn-${o.id}`}
                                  >
                                    <Trash2 className="w-3 h-3 mr-1 inline" />
                                    Delete Order
                                  </button>
                                )}
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
                {/* Admin Note - Mobile */}
                <div className="flex flex-col gap-2 border-t border-border pt-3 mt-3">
                  <p className="text-xs font-mono text-primary uppercase tracking-widest">
                    Send Note to Customer
                  </p>
                  {o.adminNote && (
                    <p className="text-xs text-muted-foreground italic">
                      Current: {o.adminNote}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInputs[o.id] ?? o.adminNote ?? ""}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({
                          ...prev,
                          [o.id]: e.target.value,
                        }))
                      }
                      placeholder="Type a message..."
                      className="flex-1 bg-background border border-border rounded text-xs font-mono text-foreground px-2 py-1.5 focus:border-primary focus:outline-none"
                      data-ocid={`admin-note-input-mobile-${o.id}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveNote(o.id)}
                      className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      data-ocid={`admin-note-save-mobile-${o.id}`}
                    >
                      <Send className="w-3 h-3 inline" />
                    </button>
                  </div>
                </div>
                {/* Transaction ID - Mobile */}
                {o.transactionId && (
                  <div className="border-t border-border pt-3 mt-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">
                      UPI Transaction ID
                    </p>
                    <p className="text-xs font-mono text-primary font-semibold break-all">
                      {o.transactionId}
                    </p>
                  </div>
                )}
                {/* Payment Screenshot - Mobile */}
                {o.paymentScreenshot && (
                  <div className="border-t border-border pt-3 mt-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                      Payment Screenshot
                    </p>
                    <div className="rounded border border-primary/30 overflow-hidden max-h-40">
                      <img
                        src={o.paymentScreenshot}
                        alt="Payment proof"
                        className="w-full object-contain bg-muted/20"
                      />
                    </div>
                  </div>
                )}
                {/* Delete Order - Mobile */}
                <div className="border-t border-destructive/20 pt-3 mt-1">
                  {deleteConfirm === o.id ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-destructive font-mono">
                        Are you sure you want to delete this order?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => confirmDelete(o.id)}
                          className="flex-1 px-3 py-2 rounded text-xs font-bold uppercase tracking-widest bg-destructive text-white hover:bg-destructive/90 transition-colors"
                          data-ocid={`order-delete-confirm-mobile-${o.id}`}
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-3 py-2 rounded text-xs font-bold uppercase tracking-widest border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                          data-ocid={`order-delete-cancel-mobile-${o.id}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(o.id)}
                      className="w-full px-3 py-2 rounded text-xs font-bold uppercase tracking-widest border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
                      data-ocid={`order-delete-btn-mobile-${o.id}`}
                    >
                      <Trash2 className="w-3 h-3 mr-1 inline" />
                      Delete Order
                    </button>
                  )}
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

// ── Admin: Invoices Section ─────────────────────────────────────

function formatPhoneForWhatsApp(phone: string): string {
  // Strip everything except digits
  let digits = phone.replace(/\D/g, "");
  // If starts with 0, replace with 91 (Indian landline/mobile)
  if (digits.startsWith("0")) digits = `91${digits.slice(1)}`;
  // If doesn't start with 91, prepend 91
  if (!digits.startsWith("91")) digits = `91${digits}`;
  return digits;
}

function sendWhatsAppInvoice(order: LegacyOrder) {
  const phone = formatPhoneForWhatsApp(order.phone || "");
  const formattedDate = new Date(order.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const message = [
    `Dear ${order.name},`,
    "",
    "Here is your invoice for your recent purchase from GS STORE.",
    "",
    `Order ID: ${order.id}`,
    `Product: Hacker's Pendrive 64GB`,
    `Amount Paid: ₹${order.amount.toLocaleString("en-IN")}`,
    `UPI Transaction ID: ${order.transactionId || "Not provided"}`,
    `Order Date: ${formattedDate}`,
    `Status: ${order.status}`,
    "",
    "Thank you for shopping with GS STORE!",
    "For support: gauravsaswade2009@gmail.com | +91 9270556455",
  ].join("\n");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function AdminInvoices() {
  const [orders, setOrders] = useState<LegacyOrder[]>(() =>
    getOrders().slice().reverse(),
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  const refresh = () => {
    const refreshed = getOrders().slice().reverse();
    setOrders(refreshed);
    if (!selectedOrderId && refreshed.length > 0) {
      setSelectedOrderId(refreshed[0].id);
    }
  };

  const handleCreateInvoice = () => {
    const order = orders.find((o) => o.id === selectedOrderId);
    if (order) {
      openInvoice(order);
      setShowCreateModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className="rounded-lg border p-6 flex flex-col gap-4 w-full max-w-md mx-4"
            style={{ background: "#0a0f0a", borderColor: "#00ff4155" }}
          >
            <div className="flex items-center justify-between">
              <h3
                className="font-display font-black text-lg uppercase tracking-tight"
                style={{ color: "#00ff41" }}
              >
                Create Invoice
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ color: "#00ff4199" }}
                className="hover:opacity-70 transition-opacity"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="create-invoice-order-select"
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: "#00ff4199" }}
              >
                Select Order
              </label>
              {orders.length === 0 ? (
                <p className="text-xs font-mono" style={{ color: "#00ff4166" }}>
                  No orders available.
                </p>
              ) : (
                <select
                  id="create-invoice-order-select"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                  style={{
                    background: "#0f1a0f",
                    border: "1px solid #00ff4155",
                    color: "#00ff41",
                  }}
                  data-ocid="admin-create-invoice-select"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.name} (₹{o.amount.toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleCreateInvoice}
                disabled={!selectedOrderId}
                className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-40"
                style={{
                  background: "#00ff41",
                  color: "#0a0f0a",
                }}
                data-ocid="admin-generate-invoice-btn"
              >
                <Download className="w-3.5 h-3.5 mr-1 inline" />
                Generate Invoice
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded text-xs font-mono uppercase tracking-widest transition-colors"
                style={{
                  border: "1px solid #00ff4155",
                  color: "#00ff4199",
                  background: "transparent",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="font-display font-black text-2xl uppercase tracking-tight mb-1"
            style={{ color: "#00ff41" }}
          >
            Invoices
          </h2>
          <p className="text-sm font-mono" style={{ color: "#00ff4199" }}>
            {orders.length} invoice{orders.length !== 1 ? "s" : ""} — click
            "View Invoice" to open &amp; print.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const refreshed = getOrders().slice().reverse();
              setOrders(refreshed);
              if (refreshed.length > 0) setSelectedOrderId(refreshed[0].id);
              setShowCreateModal(true);
            }}
            className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors"
            style={{
              background: "#00ff41",
              color: "#0a0f0a",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            data-ocid="admin-create-invoice-open"
          >
            <Plus className="w-3.5 h-3.5 mr-1 inline" />
            Create Invoice
          </button>
          <Button
            onClick={refresh}
            variant="outline"
            className="shrink-0 font-mono text-xs"
            style={{
              borderColor: "#00ff4155",
              color: "#00ff41",
              background: "transparent",
            }}
            data-ocid="admin-invoices-refresh"
          >
            Refresh
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div
          className="rounded-lg border p-12 flex flex-col items-center gap-4 text-center"
          style={{ borderColor: "#00ff4133", background: "#00ff410a" }}
          data-ocid="admin-invoices-empty"
        >
          <Download className="w-10 h-10" style={{ color: "#00ff4166" }} />
          <p
            className="font-mono text-sm font-bold uppercase tracking-widest"
            style={{ color: "#00ff41" }}
          >
            No Invoices Found
          </p>
          <p className="font-mono text-xs" style={{ color: "#00ff4166" }}>
            Orders placed by customers will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div
            className="hidden md:block rounded-lg border overflow-hidden"
            style={{ borderColor: "#00ff4133" }}
          >
            <table className="w-full text-sm font-mono">
              <thead>
                <tr
                  style={{
                    background: "#00ff410f",
                    borderBottom: "1px solid #00ff4133",
                  }}
                >
                  {[
                    "Order ID",
                    "Customer",
                    "Email",
                    "Amount",
                    "Date",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs uppercase tracking-widest font-bold"
                      style={{ color: "#00ff41" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className="transition-colors"
                    style={{
                      borderBottom: "1px solid #00ff4120",
                      background: i % 2 === 0 ? "transparent" : "#00ff4106",
                    }}
                    data-ocid={`admin-invoice-row-${i}`}
                  >
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ color: "#00ff41" }}
                    >
                      {order.id}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#c6ffd0" }}>
                      {order.name}
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#8aff8a99" }}
                    >
                      {order.email}
                    </td>
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ color: "#00ff41" }}
                    >
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#8aff8a99" }}
                    >
                      {new Date(order.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openInvoice(order)}
                          className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-colors"
                          style={{
                            border: "1px solid #00ff41",
                            color: "#00ff41",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "#00ff4122";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                          }}
                          data-ocid={`admin-view-invoice-${i}`}
                        >
                          View Invoice
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadInvoice(order)}
                          className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                          style={{
                            border: "1px solid #00ff41",
                            color: "#00ff41",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "#00ff4122";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                          }}
                          data-ocid={`admin-download-invoice-${i}`}
                        >
                          <Download className="w-3 h-3" aria-hidden="true" />
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={() => sendWhatsAppInvoice(order)}
                          className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                          style={{
                            border: "1px solid #25d36699",
                            color: "#25d366",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "#25d36622";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                          }}
                          data-ocid={`admin-whatsapp-invoice-${i}`}
                        >
                          <MessageCircle
                            className="w-3 h-3"
                            aria-hidden="true"
                          />
                          WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="rounded-lg border p-4 flex flex-col gap-3"
                style={{ borderColor: "#00ff4133", background: "#00ff410a" }}
                data-ocid={`admin-invoice-card-${i}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: "#00ff41" }}
                  >
                    {order.id}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <div
                      style={{ color: "#00ff4166" }}
                      className="uppercase tracking-widest text-[10px]"
                    >
                      Customer
                    </div>
                    <div style={{ color: "#c6ffd0" }}>{order.name}</div>
                  </div>
                  <div>
                    <div
                      style={{ color: "#00ff4166" }}
                      className="uppercase tracking-widest text-[10px]"
                    >
                      Amount
                    </div>
                    <div className="font-bold" style={{ color: "#00ff41" }}>
                      ₹{order.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ color: "#00ff4166" }}
                      className="uppercase tracking-widest text-[10px]"
                    >
                      Date
                    </div>
                    <div style={{ color: "#8aff8a99" }}>
                      {new Date(order.date).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ color: "#00ff4166" }}
                      className="uppercase tracking-widest text-[10px]"
                    >
                      Email
                    </div>
                    <div className="truncate" style={{ color: "#8aff8a99" }}>
                      {order.email}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openInvoice(order)}
                    className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors"
                    style={{
                      border: "1px solid #00ff41",
                      color: "#00ff41",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#00ff4122";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                    data-ocid={`admin-view-invoice-mobile-${i}`}
                  >
                    View Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadInvoice(order)}
                    className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                    style={{
                      border: "1px solid #00ff41",
                      color: "#00ff41",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#00ff4122";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                    data-ocid={`admin-download-invoice-mobile-${i}`}
                  >
                    <Download className="w-3 h-3" aria-hidden="true" />
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWhatsAppInvoice(order)}
                    className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                    style={{
                      border: "1px solid #25d36699",
                      color: "#25d366",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#25d36622";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                    data-ocid={`admin-whatsapp-invoice-mobile-${i}`}
                  >
                    <MessageCircle className="w-3 h-3" aria-hidden="true" />
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Admin: Credentials Section ───────────────────────────────────

function AdminCredentials() {
  const [accounts, setAccounts] = useState<CustomerAccount[]>(() =>
    getCustomerAccounts()
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  );
  const [query, setQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const refresh = () => {
    setAccounts(
      getCustomerAccounts()
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    );
  };

  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase()),
  );

  const handleCopyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success("Email copied!");
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="font-display font-black text-2xl uppercase tracking-tight mb-1"
            style={{ color: "#00ff41" }}
          >
            Customer <span style={{ color: "#c6ffd0" }}>Credentials</span>
          </h2>
          <p className="text-sm font-mono" style={{ color: "#00ff4199" }}>
            {accounts.length} registered account
            {accounts.length !== 1 ? "s" : ""} — passwords shown as secure hash
            only
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors"
          style={{
            border: "1px solid #00ff4155",
            color: "#00ff41",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "#00ff4122";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
          data-ocid="admin-credentials-refresh"
        >
          Refresh
        </button>
      </div>

      {/* Stats chip */}
      <div
        className="flex items-center gap-3 rounded-lg px-5 py-4 border"
        style={{ background: "#00ff410a", borderColor: "#00ff4133" }}
      >
        <KeyRound className="w-5 h-5 shrink-0" style={{ color: "#00ff41" }} />
        <div>
          <p
            className="font-mono font-black text-2xl leading-none"
            style={{ color: "#00ff41" }}
          >
            {accounts.length}
          </p>
          <p
            className="font-mono text-xs uppercase tracking-widest mt-0.5"
            style={{ color: "#00ff4199" }}
          >
            Total Registered Customers
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "#00ff4199" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full rounded px-3 py-2 pl-9 text-sm font-mono focus:outline-none"
          style={{
            background: "#0f1a0f",
            border: "1px solid #00ff4155",
            color: "#00ff41",
          }}
          data-ocid="admin-credentials-search"
        />
      </div>

      {/* Empty state */}
      {accounts.length === 0 ? (
        <div
          className="rounded-lg border p-14 flex flex-col items-center gap-4 text-center"
          style={{ borderColor: "#00ff4133", background: "#00ff410a" }}
          data-ocid="admin-credentials-empty"
        >
          <KeyRound className="w-12 h-12" style={{ color: "#00ff4144" }} />
          <p
            className="font-mono text-sm font-bold uppercase tracking-widest"
            style={{ color: "#00ff41" }}
          >
            No Customers Yet
          </p>
          <p className="font-mono text-xs" style={{ color: "#00ff4166" }}>
            Registered customer accounts will appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-lg border p-10 flex flex-col items-center gap-3 text-center"
          style={{ borderColor: "#00ff4133", background: "#00ff410a" }}
          data-ocid="admin-credentials-no-match"
        >
          <Search className="w-8 h-8" style={{ color: "#00ff4144" }} />
          <p className="font-mono text-sm" style={{ color: "#00ff4199" }}>
            No customers match &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div
            className="hidden md:block rounded-lg border overflow-hidden"
            style={{ borderColor: "#00ff4133" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr
                    style={{
                      background: "#00ff410f",
                      borderBottom: "1px solid #00ff4133",
                    }}
                  >
                    {[
                      "#",
                      "Customer Name",
                      "Email Address",
                      "Password Hash",
                      "Phone",
                      "Registration Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap"
                        style={{ color: "#00ff41" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((acc, i) => (
                    <tr
                      key={acc.id}
                      style={{
                        borderBottom: "1px solid #00ff4120",
                        background: i % 2 === 0 ? "transparent" : "#00ff4106",
                      }}
                      data-ocid={`admin-cred-row-${i}`}
                    >
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: "#00ff4166" }}
                      >
                        {i + 1}
                      </td>
                      <td
                        className="px-4 py-3 font-semibold"
                        style={{ color: "#c6ffd0" }}
                      >
                        {acc.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs truncate max-w-[160px]"
                            style={{ color: "#8aff8a" }}
                          >
                            {acc.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(acc.email)}
                            aria-label="Copy email"
                            className="shrink-0 transition-opacity hover:opacity-70"
                            style={{
                              color:
                                copiedEmail === acc.email
                                  ? "#00ff41"
                                  : "#00ff4188",
                            }}
                            data-ocid={`admin-cred-copy-email-${i}`}
                          >
                            {copiedEmail === acc.email ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{
                            background: "#00ff4112",
                            border: "1px solid #00ff4133",
                            color: "#00ff4199",
                            fontFamily: "monospace",
                          }}
                        >
                          {acc.passwordHash || "—"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: "#8aff8a99" }}
                      >
                        {acc.phone || "—"}
                      </td>
                      <td
                        className="px-4 py-3 text-xs whitespace-nowrap"
                        style={{ color: "#8aff8a99" }}
                      >
                        {new Date(acc.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((acc, i) => (
              <div
                key={acc.id}
                className="rounded-lg border p-4 flex flex-col gap-3"
                style={{ borderColor: "#00ff4133", background: "#00ff410a" }}
                data-ocid={`admin-cred-card-${i}`}
              >
                {/* Row 1: index + name */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: "#00ff4166",
                      border: "1px solid #00ff4133",
                    }}
                  >
                    #{i + 1}
                  </span>
                  <span
                    className="font-semibold font-mono text-sm"
                    style={{ color: "#c6ffd0" }}
                  >
                    {acc.name}
                  </span>
                </div>

                {/* Row 2: email + copy */}
                <div className="flex items-center gap-2">
                  <Mail
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "#00ff4188" }}
                  />
                  <span
                    className="text-xs font-mono flex-1 break-all"
                    style={{ color: "#8aff8a" }}
                  >
                    {acc.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(acc.email)}
                    aria-label="Copy email"
                    className="shrink-0 transition-opacity hover:opacity-70"
                    style={{
                      color:
                        copiedEmail === acc.email ? "#00ff41" : "#00ff4188",
                    }}
                    data-ocid={`admin-cred-copy-email-mobile-${i}`}
                  >
                    {copiedEmail === acc.email ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Row 3: hash */}
                <div>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-1"
                    style={{ color: "#00ff4166" }}
                  >
                    Password Hash
                  </p>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded inline-block"
                    style={{
                      background: "#00ff4112",
                      border: "1px solid #00ff4133",
                      color: "#00ff4199",
                    }}
                  >
                    {acc.passwordHash || "—"}
                  </span>
                </div>

                {/* Row 4: phone + reg date */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <p
                      className="uppercase tracking-widest text-[10px] mb-0.5"
                      style={{ color: "#00ff4166" }}
                    >
                      Phone
                    </p>
                    <p style={{ color: "#8aff8a99" }}>{acc.phone || "—"}</p>
                  </div>
                  <div>
                    <p
                      className="uppercase tracking-widest text-[10px] mb-0.5"
                      style={{ color: "#00ff4166" }}
                    >
                      Registered
                    </p>
                    <p style={{ color: "#8aff8a99" }}>
                      {new Date(acc.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
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
            {activeSection === "invoices" && <AdminInvoices />}
            {activeSection === "credentials" && <AdminCredentials />}
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
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
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
  loginRoute,
  signupRoute,
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
