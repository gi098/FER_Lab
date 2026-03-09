"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Navigation() {
    const { cartCount } = useCart();
    const { user, signOut } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a consistent server HTML
    if (!isMounted) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <h1 className="text-2xl font-serif font-bold tracking-tighter text-foreground cursor-pointer">
                                LUXURY SCENT
                            </h1>
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <h1 className="text-2xl font-serif font-bold tracking-tighter text-foreground cursor-pointer">
                            LUXURY SCENT
                        </h1>
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4 animate-in fade-in duration-500">
                            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground">
                                <User className="w-4 h-4 text-primary" />
                                <span>Hi, {user.user_metadata?.full_name || user.email}</span>
                            </div>

                            <Link href="/orders">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-primary transition-colors hidden sm:flex"
                                >
                                    <Package className="w-4 h-4 mr-2" /> My Orders
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => signOut()}
                                className="text-muted-foreground hover:text-destructive transition-colors hidden sm:flex"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hidden sm:block relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100">
                                Log In
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all hover:scale-105 active:scale-95 border-none font-bold">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}

                    <Link href="/cart" className="relative">
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in duration-300">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
