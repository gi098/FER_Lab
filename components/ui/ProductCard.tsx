/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import confetti from "canvas-confetti";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const ProductCard: React.FC<ProductProps> = ({ id, name, image, description, price }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Lấy vị trí tọa độ của con trỏ chuột khi bấm vào nút
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // 2. Bắn pháo hoa màu Vàng - Trắng (chuẩn Luxury) từ vị trí nút bấm
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#FFD700', '#FDF5E6', '#FFFFFF'], // Màu Vàng Gold và Trắng
      disableForReducedMotion: true,
      zIndex: 100
    });

    // 3. Thêm vào giỏ và thông báo
    addToCart({ id, name, image, price, quantity: 1 });
    toast(`Added ${name} to cart`);
  };

  return (
    <div className="group relative flex flex-col gap-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-xl p-2 bg-background border border-transparent hover:border-border/30">
      {/* Image Container with subtle hover zoom */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary/20">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        {/* Quick Add Overlay - Visible on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-white/90 text-black backdrop-blur-sm hover:bg-white shadow-lg overflow-hidden relative"
          >
            <ShoppingCart className="mr-2 h-4 w-4 relative z-10" />
            <span className="relative z-10">Add to Cart</span>
          </Button>
        </div>
      </div>

      {/* Product Info - Minimalist */}
      <div className="space-y-1 text-center">
        <h3 className="font-serif text-lg font-medium tracking-tight text-primary">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1 px-4">
          {description}
        </p>
        <p className="font-medium text-foreground mt-1">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;