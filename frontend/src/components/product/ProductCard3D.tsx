import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductCard3DProps {
  product: Product;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({ product }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return product.variants?.[0] || {
      id: 'default',
      productId: product.id,
      weight: '1 kg',
      unit: 'kg',
      price: 150,
      stock: 100,
      isActive: true,
    };
  });

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, selectedVariant, 1);
    setIsAdded(true);
    showToast(`Added ${product.name} (${selectedVariant.weight}) to cart!`, 'success');

    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-3xl overflow-hidden border border-heritage-gold/25 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Showcase */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-gradient-to-b from-[#FAF6EE] to-[#F3EBD9] aspect-square p-4 flex items-center justify-center border-b border-heritage-gold/15"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category & Verified Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-heritage-maroon/90 backdrop-blur-sm text-cream-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-heritage-gold/30">
            {product.category}
          </span>
          {product.isFeatured && (
            <span className="bg-heritage-gold text-heritage-darkMaroon text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Speciality
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="group-hover:text-heritage-richRed transition-colors"
          >
            <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variant Picker (Weight / Pack Size) */}
        {product.variants && product.variants.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Available Weight / Pack:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(v);
                  }}
                  className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${
                    selectedVariant.id === v.id
                      ? 'bg-heritage-maroon text-cream-100 shadow-md border border-heritage-gold'
                      : 'bg-cream-100 text-stone-700 hover:bg-cream-200 border border-heritage-gold/20'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-black text-xl text-heritage-maroon">
                {formatINR(selectedVariant.price)}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ {selectedVariant.weight}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-heritage-maroon to-heritage-richRed hover:from-heritage-darkMaroon hover:to-heritage-maroon text-cream-100 border border-heritage-gold/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-heritage-gold" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
