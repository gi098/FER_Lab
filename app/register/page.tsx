"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, ArrowRight, Loader2 } from "lucide-react";

import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast("Account created successfully!");
        // Redirect to login on success
        router.push("/login");
      } else {
        const errorMsg = data.error || "Registration failed";
        setError(errorMsg);
        toast(errorMsg, "error");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

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
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-md p-10 relative z-10 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem]">
        <div className="text-center mb-8 space-y-2">
          <div className="flex flex-col items-center justify-center gap-3 text-white mb-2">
            <div className="p-3 bg-white/10 rounded-full border border-white/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-white">Luxury Scent</span>
          </div>
          <h1 className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase pt-2">
            Create Account
          </h1>
          <p className="text-white/60 text-xs tracking-wide">
            Begin your journey into the world of exclusive fragrances.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                required
                disabled={loading}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:ring-0 rounded-xl px-4 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Email</label>
              <Input
                type="email"
                placeholder="name@example.com"
                required
                disabled={loading}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:ring-0 rounded-xl px-4 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 focus:ring-0 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          <Button
            disabled={loading}
            className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-medium tracking-wide shadow-lg transition-all group"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
            )}
          </Button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-white hover:text-white/80 transition-colors border-b border-transparent hover:border-white/50">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center text-[10px] uppercase tracking-widest text-white/30">
          © 2026 Luxury Scent
        </div>
      </div>
    </div>
  );
}