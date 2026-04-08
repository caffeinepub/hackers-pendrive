import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Send, Star, X, ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Gallery ─────────────────────────────────────────────────────

export const GALLERY_IMAGES = [
  {
    src: "/assets/generated/hero-pendrive.dim_1200x600.jpg",
    alt: "Hacker's Pendrive — front view",
  },
  {
    src: "/assets/generated/gallery-side.dim_600x600.jpg",
    alt: "Side profile with glowing LED indicators",
  },
  {
    src: "/assets/generated/gallery-chip.dim_600x600.jpg",
    alt: "32GB flash memory chip close-up",
  },
  {
    src: "/assets/generated/gallery-tools.dim_600x600.jpg",
    alt: "125+ cybersecurity tools pre-installed",
  },
  {
    src: "/assets/generated/gallery-terminal.dim_600x600.jpg",
    alt: "Live terminal — boot from USB in seconds",
  },
  {
    src: "/assets/generated/gallery-kit.dim_600x600.jpg",
    alt: "Full kit — USB + quick-start guide",
  },
];

// ── Reviews helpers ─────────────────────────────────────────────

const REVIEWS_KEY = "product-reviews-v1";

export interface LocalReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  text: string;
  timestamp: string;
}

const SEED_REVIEWS: LocalReview[] = [
  {
    id: "r1",
    productId: "hackers-pendrive-1",
    customerName: "Rahul Mehta",
    rating: 5,
    text: "Absolutely insane value. Booted Kali directly from the pendrive in 2 minutes. All 125 tools pre-configured — saved me weeks of setup.",
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "r2",
    productId: "hackers-pendrive-1",
    customerName: "Priya Nair",
    rating: 5,
    text: "Used it at a CTF competition — total game changer. Wireshark, Burp Suite and Metasploit all running flawlessly.",
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "r3",
    productId: "hackers-pendrive-1",
    customerName: "Arjun Singh",
    rating: 4,
    text: "Solid build quality. AES-256 encryption was a great surprise at this price. Fast delivery too.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function getLocalReviews(): LocalReview[] {
  try {
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (stored) return JSON.parse(stored) as LocalReview[];
  } catch {
    /* ignore */
  }
  return SEED_REVIEWS;
}

export function saveLocalReview(review: LocalReview) {
  const reviews = getLocalReviews();
  reviews.unshift(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// ── StarRating ──────────────────────────────────────────────────

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const cls = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
        >
          <Star
            className={`${cls} transition-colors duration-150 ${n <= active ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Lightbox ────────────────────────────────────────────────────

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof GALLERY_IMAGES;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center px-4"
      onClick={onClose}
      aria-label="Image lightbox"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        data-ocid="lightbox-close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth z-10"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
        data-ocid="lightbox-prev"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
        data-ocid="lightbox-next"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <motion.div
        key={index}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="max-w-4xl w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index].src}
          alt={images[index].alt}
          className="max-h-[75vh] w-auto rounded-lg border border-primary/30 shadow-[0_0_40px_oklch(0.70_0.18_142/0.25)] object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/assets/generated/hero-pendrive.dim_1200x600.jpg";
          }}
        />
        <p className="text-sm font-body text-muted-foreground text-center">
          {images[index].alt}
        </p>
        <p className="font-mono text-xs text-primary">
          {index + 1} / {images.length}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Product Gallery ─────────────────────────────────────────────

export function ProductGallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const close = () => setLightboxIdx(null);
  const prev = () =>
    setLightboxIdx((i) =>
      i === null ? 0 : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
    );
  const next = () =>
    setLightboxIdx((i) => (i === null ? 0 : (i + 1) % GALLERY_IMAGES.length));

  return (
    <section className="bg-muted/30 py-20 border-b border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-black text-3xl lg:text-5xl text-foreground tracking-tight uppercase mb-3">
            Product <span className="text-primary">Gallery</span>
          </h2>
          <p className="text-muted-foreground font-body">
            Click any image to view full size.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setLightboxIdx(i)}
              className="group relative overflow-hidden rounded-lg border border-border hover:border-primary/50 bg-card transition-smooth hover:shadow-[0_0_20px_oklch(0.70_0.18_142/0.15)] aspect-square"
              data-ocid={`gallery-img-${i}`}
              aria-label={img.alt}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/assets/generated/hero-pendrive.dim_1200x600.jpg";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-8 h-8 text-primary drop-shadow-lg" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      {lightboxIdx !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          index={lightboxIdx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

// ── Reviews Section ─────────────────────────────────────────────

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<LocalReview[]>(() =>
    getLocalReviews(),
  );
  const [form, setForm] = useState({ customerName: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);
  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.text.trim()) return;
    setSubmitting(true);
    const r: LocalReview = {
      id: `rv-${Date.now()}`,
      productId,
      customerName: form.customerName.trim(),
      rating: form.rating,
      text: form.text.trim(),
      timestamp: new Date().toISOString(),
    };
    saveLocalReview(r);
    setReviews(getLocalReviews());
    setForm({ customerName: "", rating: 5, text: "" });
    setSubmitting(false);
    toast.success("Review posted!");
  };

  return (
    <section className="bg-background py-20 border-b border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-black text-3xl lg:text-5xl text-foreground tracking-tight uppercase mb-3">
            Operator <span className="text-primary">Reviews</span>
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-2">
              <StarRating value={Math.round(avgRating)} readonly size="sm" />
              <span className="font-mono font-bold text-primary text-lg">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Review list */}
          <div className="flex flex-col gap-4" data-ocid="reviews-list">
            {reviews.slice(0, 6).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-smooth hover:shadow-[0_0_16px_oklch(0.70_0.18_142/0.1)]"
                data-ocid={`review-card-${r.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="font-mono text-xs font-bold text-primary">
                        {r.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-foreground">
                        {r.customerName}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {new Date(r.timestamp).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <StarRating value={r.rating} readonly size="sm" />
                </div>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  {r.text}
                </p>
              </motion.div>
            ))}
            {reviews.length === 0 && (
              <div
                className="bg-card border border-border rounded-lg px-6 py-10 text-center"
                data-ocid="reviews-empty"
              >
                <Star className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Be the first to review the Hacker's Pendrive!
                </p>
              </div>
            )}
          </div>

          {/* Add review form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5 sticky top-24"
              data-ocid="review-form"
            >
              <div>
                <h3 className="font-display font-black text-lg text-foreground uppercase tracking-tight mb-0.5">
                  Leave a <span className="text-primary">Review</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your review posts instantly.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="review-name"
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  Your Name
                </Label>
                <Input
                  id="review-name"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerName: e.target.value }))
                  }
                  placeholder="e.g. Alex Kumar"
                  required
                  className="bg-background border-border focus:border-primary"
                  data-ocid="review-name-input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  Rating
                </Label>
                <StarRating
                  value={form.rating}
                  onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="review-text"
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  Your Review
                </Label>
                <Textarea
                  id="review-text"
                  value={form.text}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, text: e.target.value }))
                  }
                  placeholder="Share your experience with the Hacker's Pendrive…"
                  rows={4}
                  required
                  className="bg-background border-border focus:border-primary resize-none"
                  data-ocid="review-text-input"
                />
              </div>
              <Button
                type="submit"
                disabled={
                  submitting || !form.customerName.trim() || !form.text.trim()
                }
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-widest uppercase glow-accent transition-smooth disabled:opacity-40"
                data-ocid="review-submit-btn"
              >
                <Send className="w-4 h-4 mr-2" /> Post Review
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
