import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate({ to: "/checkout" });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={closeCart}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeCart();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-card border-l border-border flex flex-col shadow-[-8px_0_40px_rgba(0,0,0,0.6)]"
        aria-label="Shopping cart"
        data-ocid="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border border-accent-top">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">
              Cart{" "}
              {itemCount > 0 && (
                <span className="text-primary">({itemCount})</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Close cart"
            data-ocid="cart-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-12"
            data-ocid="cart-empty"
          >
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm text-center">
              Your cart is empty.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                closeCart();
                navigate({ to: "/" });
              }}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3"
                  data-ocid={`cart-item-${item.product.id}`}
                >
                  <div className="w-16 h-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="font-display font-semibold text-sm text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="font-mono text-xs text-primary">
                      ₹{item.product.price.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-smooth"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-sm text-foreground w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-smooth"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-smooth"
                        aria-label="Remove item"
                        data-ocid={`cart-remove-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border">
            <Separator className="mb-3" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground font-body">
                Total
              </span>
              <span className="font-mono font-bold text-lg text-primary">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold tracking-wide glow-accent transition-smooth"
              onClick={handleCheckout}
              data-ocid="cart-checkout-btn"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
