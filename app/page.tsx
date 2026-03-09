"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, ShoppingBag, Menu, User, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://i.pinimg.com/1200x/cd/33/29/cd33292adc24a3a1efccc6023f8ad85c.jpg",
    "https://i.pinimg.com/736x/0c/ae/dc/0caedc2d2d7ab311e7315988235327de.jpg",
    "https://i.pinimg.com/1200x/ff/43/a7/ff43a7a5d8b58450458290f9fc587dfe.jpg",
    "https://i.pinimg.com/1200x/50/ae/fa/50aefaf0a9a94bb16a965f6e6528aca3.jpg",
    "https://i.pinimg.com/1200x/77/7e/b2/777eb250c7aaff92c6534c887e929eef.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">

      {/* Header moved to global layout component */}

      {/* === HERO SECTION === */}
      <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center pb-12 overflow-hidden bg-background">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0 bg-stone-100 flex items-center justify-center overflow-hidden">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform flex items-center justify-center p-4 sm:p-12 ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
            >
              <img
                src={src}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>
          ))}
        </div>
        {/* Elegant Gradient Overlay - Top & Bottom only so middle (product) is clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 pointer-events-none"></div>

        {/* Minimalist Content */}
        <div className="relative z-10 w-full container mx-auto px-6 flex flex-col items-center gap-8 mt-auto animate-in fade-in duration-1000 slide-in-from-bottom-8">

          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl bg-background/30 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground drop-shadow-sm tracking-tight">
              Timeless Elegance
            </h2>
            <p className="text-muted-foreground font-medium md:text-lg">
              Discover the perfect piece that speaks to your unique style.
            </p>
          </div>

          {/* Shop Button - Solid & Professional */}
          <Button
            size="lg"
            className="rounded-full px-12 h-14 bg-foreground hover:bg-foreground/90 text-background font-medium tracking-widest uppercase transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            Explore Collection
          </Button>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3 mt-8">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-500 rounded-full ${idx === currentSlide
                  ? "w-8 h-2 bg-foreground"
                  : "w-2 h-2 bg-foreground/30 hover:bg-foreground/50"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
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
    </div >
  );
}