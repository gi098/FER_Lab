/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

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

  const handleAddToCart = () => {
    addToCart({ id, name, image, price, quantity: 1 });
    toast(`Added ${name} to cart`);
  };

  return (
    <div className="group relative flex flex-col gap-4">
      {/* Image Container with subtle hover zoom */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary/20">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        {/* Quick Add Overlay - Visible on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-white/90 text-black backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
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