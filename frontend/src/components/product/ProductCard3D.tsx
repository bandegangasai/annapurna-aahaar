import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { formatINR, getProductImageUrl } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCard3DProps {
  product: Product;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({ product }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { t, getLocalizedProduct } = useLanguage();

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

  const localized = getLocalizedProduct(
    product.slug || product.id,
    product.name,
    product.description
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, selectedVariant, 1);
    setIsAdded(true);
    showToast(`${t('prod_btn_added')}: ${localized.name} (${selectedVariant.weight})`, 'success');

    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-3xl overflow-hidden border border-[#C79A45]/30 shadow-subtle hover:shadow-card-lift hover:border-[#C79A45] transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Showcase */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[#FAF6EE] aspect-square p-4 flex items-center justify-center border-b border-[#C79A45]/15"
      >
        <img
          src={getProductImageUrl(product.imageUrl)}
          alt={localized.name}
          className="w-full h-full object-contain object-center group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category & Heritage Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#173F35]/95 backdrop-blur-sm text-[#F8F3E7] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#C79A45]/40">
            {product.category}
          </span>
          {product.isFeatured && (
            <span className="bg-[#C79A45] text-[#173F35] text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              {t('prod_badge_popular')}
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="group-hover:text-[#173F35] transition-colors"
          >
            <h3 className="font-serif font-bold text-stone-primary text-lg sm:text-xl line-clamp-1">
              {localized.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-stone-muted line-clamp-2 mt-1.5 leading-relaxed">
            {localized.description}
          </p>
        </div>

        {/* Variant Picker (Weight / Pack Size) */}
        {product.variants && product.variants.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-stone-muted uppercase tracking-wider block mb-1.5">
              {t('prod_select_weight')}
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
                      ? 'bg-[#173F35] text-[#F8F3E7] shadow-sm border border-[#C79A45]'
                      : 'bg-[#F8F3E7] text-stone-primary hover:bg-[#F1E9D5] border border-[#C79A45]/25'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-muted block uppercase font-bold tracking-wider">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-black text-xl text-[#173F35]">
                {formatINR(selectedVariant.price)}
              </span>
              <span className="text-xs text-stone-muted font-medium">/ {selectedVariant.weight}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 ${
              isAdded
                ? 'bg-emerald-800 text-white'
                : 'bg-[#173F35] hover:bg-[#0C241E] text-[#F8F3E7] border border-[#C79A45]/40'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t('prod_btn_added')}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#C79A45]" />
                <span>{t('prod_btn_add')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard3D;
