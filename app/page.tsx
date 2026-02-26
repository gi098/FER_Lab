"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, ShoppingBag, Menu, Star, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">

      {/* === HEADER === */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold tracking-tighter text-foreground">
              LUXURY SCENT
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Collections</Link>
            <Link href="/" className="hover:text-primary transition-colors">Best Sellers</Link>
            {user && (
              <Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link>
            )}
            <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 animate-in fade-in duration-500">
                <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span>Hi, {user.user_metadata?.full_name || user.email}</span>
                </div>
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
                <Link href="/login" className="text-sm font-medium hover:text-primary hidden sm:block">
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
            <Button size="icon" variant="ghost" className="md:hidden rounded-full">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-end pb-12 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://v1.pinimg.com/videos/mc/720p/d9/da/c2/d9dac29588ff3a1e50986995d9ee1153.mp4" type="video/mp4" />
          </video>
          {/* Subtle Overlay - Reduced to barely visible to maximize video clarity */}
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Gradient for text legibility at the very bottom */}
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Minimalist Content */}
        <div className="relative z-10 w-full container mx-auto px-6 flex flex-col items-center gap-6 animate-in fade-in duration-1000 slide-in-from-bottom-8">

          {/* Shop Button - Minimal Ultra-Glass */}
          <Button
            size="lg"
            className="rounded-full px-12 h-14 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all duration-500 font-serif tracking-widest uppercase hover:scale-105"
          >
            Shop Collection
          </Button>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 mt-4 opacity-60 animate-bounce cursor-pointer hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white/80 uppercase tracking-widest">Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </div>
      </section>

      {/* === PRODUCTS GRID === */}
      <main className="container mx-auto px-6 py-24 border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
              Curated Selection
            </h2>
            <p className="text-muted-foreground">Handpicked for the discerning enthusiast.</p>
          </div>
          <Button variant="link" className="text-primary p-0 h-auto font-medium">
            View All Products <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      {/* === FOOTER === */}
      <footer className="bg-foreground text-background py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

            <div className="md:col-span-4 space-y-6">
              <h2 className="text-2xl font-serif font-bold tracking-tighter">
                LUXURY SCENT
              </h2>
              <p className="text-sm text-background/60 leading-relaxed max-w-xs">
                Elevating the art of jewelry since 2024. Use our pieces to express your unique identity and leave a lasting impression.
              </p>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="font-serif text-sm font-semibold tracking-widest uppercase text-background/90">Shop</h4>
              <ul className="space-y-4 text-sm text-background/60">
                <li className="hover:text-background cursor-pointer transition-colors">All Jewelry</li>
                <li className="hover:text-background cursor-pointer transition-colors">New Arrivals</li>
                <li className="hover:text-background cursor-pointer transition-colors">Best Sellers</li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="font-serif text-sm font-semibold tracking-widest uppercase text-background/90">Support</h4>
              <ul className="space-y-4 text-sm text-background/60">
                <li className="hover:text-background cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-background cursor-pointer transition-colors">Shipping</li>
                <li className="hover:text-background cursor-pointer transition-colors">Returns</li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-6">
              <h4 className="font-serif text-sm font-semibold tracking-widest uppercase text-background/90">Stay Connected</h4>
              <p className="text-sm text-background/60">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-b border-background/20 py-2 px-0 text-sm w-full outline-none focus:border-background transition-colors placeholder:text-background/40"
                />
                <Button variant="ghost" className="hover:bg-background hover:text-foreground">Submit</Button>
              </div>
            </div>

          </div>

          <div className="pt-16 mt-16 border-t border-background/10 flex flex-col md:flex-row justify-between items-center bg-foreground text-background/40 text-[10px] tracking-widest uppercase font-medium">
            <p>© 2026 Luxury Scent. All rights reserved.</p>
            <p>Crafted for Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}