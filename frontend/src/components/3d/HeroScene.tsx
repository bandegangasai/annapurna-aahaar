import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Award, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { getProductImageUrl } from '../../utils/formatters';

export const HeroScene: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt physics for realistic 3D perspective depth
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.08, 0.95]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const heroImageSrc = getProductImageUrl('/images/hero-3d-heritage-spread.webp');

  return (
    <div
      className="w-full relative py-2 flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Ambient Backdrop Warm Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#C79A45]/20 via-[#173F35]/15 to-transparent rounded-3xl blur-2xl transform scale-95 pointer-events-none" />

      {/* 3D Perspective Card Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[580px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF6EE] to-[#F1E9D5] p-3 sm:p-4 border-2 border-[#C79A45]/50 shadow-2xl transition-shadow duration-300 hover:shadow-[#173F35]/25"
      >
        {/* Main Image Frame with 3D Depth */}
        <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[430px] rounded-2xl overflow-hidden border border-[#C79A45]/40 shadow-inner group">
          <motion.img
            src={heroImageSrc}
            alt="Annapurna Aahaar Handcrafted Indian Food Products - Traditional Papads, Pure Turmeric & Wheat Sevaya"
            style={{
              filter: isHovered ? 'brightness(1.04) saturate(1.05)' : 'brightness(1)',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.5s ease',
            }}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />

          {/* Subtle Dynamic Light Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#173F35]/70 via-transparent to-black/20 pointer-events-none" />

          {/* Top Left: 3D Heritage Floating Pill */}
          <motion.div
            style={{ transform: 'translateZ(35px)' }}
            className="absolute top-3.5 left-3.5 bg-[#173F35]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C79A45]/60 shadow-lg flex items-center gap-2 text-xs font-bold text-[#F8F3E7]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C79A45] animate-spin-slow" />
            <span>Handcrafted in Bhainsa (504103)</span>
          </motion.div>

          {/* Top Right: Quality Guarantee Badge */}
          <motion.div
            style={{ transform: 'translateZ(30px)' }}
            className="absolute top-3.5 right-3.5 bg-[#C79A45] text-[#173F35] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-1.5 text-xs"
          >
            <Award className="w-3.5 h-3.5 text-[#173F35]" />
            <span>100% Pure & Stone-Ground</span>
          </motion.div>

          {/* Bottom Overlay Card: Product Highlights & Live Hotline */}
          <motion.div
            style={{ transform: 'translateZ(45px)' }}
            className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-[#C79A45]/50 shadow-xl space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#C79A45] tracking-widest block">
                  Heritage Collection
                </span>
                <h3 className="font-serif font-black text-sm sm:text-base text-[#173F35]">
                  Authentic Papads • Pure Turmeric • Sevaya
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Zero Preservatives</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
              <span className="text-stone-muted text-[11px]">
                Direct Kitchen Dispatch • Telangana
              </span>
              <a
                href="tel:9347036152"
                className="inline-flex items-center gap-1 text-[11px] font-black text-[#173F35] bg-[#FAF6EE] hover:bg-[#F1E9D5] px-2.5 py-1 rounded-lg border border-[#C79A45]/40 transition-colors shadow-xs"
              >
                <Phone className="w-3 h-3 text-[#C79A45]" />
                <span>Call to Order: 9347036152</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* 3D Depth Base Reflection Line */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-stone-muted px-2">
          <span className="flex items-center gap-1.5 text-[#173F35]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C79A45]" />
            <span>Proprietor: Bande Omkar</span>
          </span>
          <span className="text-[#C79A45] font-serif italic text-xs">
            "Tradition in Every Grain."
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroScene;
