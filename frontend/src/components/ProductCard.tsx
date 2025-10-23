import { Link } from "react-router-dom";
import { Product } from "../types";
import { ShoppingCart, Heart } from "lucide-react";
import { cartService } from "../services/cartService";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    setIsAddingToCart(true);
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="mb-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-500">
            {product.category?.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="btn-primary btn-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
