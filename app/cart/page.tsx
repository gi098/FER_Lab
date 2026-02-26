"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleRemove = (id: number, name: string) => {
        removeFromCart(id);
        toast(`Removed ${name} from cart`, "error");
    };

    const handleCheckout = async () => {
        if (!user) {
            toast("Please login to proceed with checkout", "error");
            router.push("/login?redirect=/cart");
            return;
        }

        setIsCheckingOut(true);
        try {
            const { error } = await supabase.from('orders').insert({
                user_id: user.id,
                items: cart,
                total_price: cartTotal,
                status: 'pending'
            });

            if (error) throw error;

            toast("Order placed successfully!", "success");
            clearCart();
            router.push("/orders");
        } catch (err: any) {
            toast(err.message || "Failed to place order", "error");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 pt-20 bg-background">
                <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <ShieldCheck className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-serif text-foreground">Your Shopping Bag is Empty</h2>
                <p className="text-muted-foreground max-w-md text-center">
                    Discover our exclusive collection of luxury jewelry and find the perfect piece for you.
                </p>
                <Link href="/">
                    <Button className="rounded-full px-8 h-12 text-base shadow-lg hover:scale-105 transition-transform">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <h1 className="text-4xl font-serif font-bold text-foreground mb-12 text-center md:text-left">Shopping Bag</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: Cart Items */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    {/* Image */}
                                    <Link href="#" className="w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-secondary/10 relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </Link>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="space-y-1">
                                            <h3 className="font-serif font-semibold text-lg text-foreground leading-tight">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">Luxury Collection</p>
                                            <p className="font-medium text-primary sm:hidden">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-8">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-3 bg-secondary/20 rounded-full px-4 py-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="hover:text-primary transition-colors disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Price & Remove */}
                                            <div className="text-right hidden sm:block">
                                                <p className="font-bold text-foreground">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} each
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.id, item.name)}
                                                className="text-muted-foreground/50 hover:text-destructive transition-colors p-2"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 text-primary text-sm font-medium border border-primary/10">
                            <Truck className="w-5 h-5" />
                            <span>Complimentary secure shipping on all orders.</span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 p-8 rounded-2xl bg-card border border-border/40 shadow-xl space-y-6">
                            <h3 className="font-serif font-bold text-xl">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="pt-3 border-t border-border/50 flex justify-between font-bold text-lg text-foreground">
                                    <span>Total</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full rounded-full h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                            >
                                {isCheckingOut ? "Processing..." : "Checkout Now"}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Secure Checkout
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
