import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  Phone,
  MessageCircle,
  HelpCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/whatsapp';
import { formatINR } from '../../utils/formatters';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  products?: Product[];
  actionType?: 'whatsapp' | 'call' | 'products' | 'track';
}

const QUICK_SUGGESTIONS = [
  '🍲 Tell me about your Papads',
  '🌾 Wheat Sevaya details',
  '🌶️ Pure Haldi / Turmeric',
  '💰 Products under ₹150',
  '🚚 Delivery & Shipping charges',
  '💬 How to order on WhatsApp?',
];

export const AiAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Namaste! 🙏 Welcome to Annapurna Aahaar. I am your Smart Heritage Assistant. How can I help you find authentic handcrafted foods today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    api.getProducts().then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateAssistantResponse(query, products);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  const handleAddToCart = (product: Product) => {
    const variant = product.variants?.[0];
    if (variant) {
      addItem(product, variant, 1);
      showToast(`${product.name} added to cart!`, 'success');
      setIsCartOpen(true);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 transform active:scale-95 ${
            isOpen
              ? 'bg-[#0C241E] text-[#C79A45] border-2 border-[#C79A45]'
              : 'bg-[#173F35] text-[#F8F3E7] hover:bg-[#0C241E] border-2 border-[#C79A45] hover:scale-105'
          }`}
          title="Chat with Annapurna Aahaar AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#C79A45] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#173F35]"></span>
          </div>
          <span className="text-xs tracking-wide hidden sm:inline">AI Food Assistant</span>
        </button>
      </div>

      {/* Chat Dialog Modal */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[80vh] bg-[#FAF6EE] rounded-3xl shadow-2xl border-2 border-[#C79A45]/40 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#173F35] text-[#F8F3E7] p-4 flex items-center justify-between border-b border-[#C79A45]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0C241E] border border-[#C79A45]/50 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-[#C79A45]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  Annapurna Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[11px] text-[#C79A45]">Tradition in Every Grain • Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-[#173F35] text-[#C79A45] flex items-center justify-center shrink-0 mt-0.5 border border-[#C79A45]/40">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#173F35] text-[#F8F3E7] rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-[#C79A45]/20 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Matching Product Chips / Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#FAF6EE] p-2.5 rounded-xl border border-[#C79A45]/30 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg bg-white shrink-0 border border-stone-200"
                            />
                            <div className="truncate">
                              <p className="font-bold text-[#173F35] truncate text-[11px]">
                                {prod.name}
                              </p>
                              <p className="text-[#C79A45] font-semibold text-[10px]">
                                {formatINR(prod.variants?.[0]?.price || 100)} /{' '}
                                {prod.variants?.[0]?.weight || '500g'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/products/${prod.slug}`);
                              }}
                              className="bg-[#173F35] hover:bg-[#0C241E] text-white p-1.5 rounded-lg text-[10px] font-bold"
                              title="View Details"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAddToCart(prod)}
                              className="bg-[#C79A45] hover:bg-[#b08537] text-[#173F35] p-1.5 rounded-lg text-[10px] font-bold"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#C79A45] text-[#173F35] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic pl-9">
                <div className="w-2 h-2 rounded-full bg-[#C79A45] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#C79A45] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#C79A45] animate-bounce [animation-delay:0.4s]"></div>
                <span>Annapurna Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Strip */}
          <div className="p-2 bg-white/80 border-t border-[#C79A45]/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="whitespace-nowrap px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#173F35] hover:text-white text-stone-700 rounded-full text-[10px] font-medium border border-[#C79A45]/30 transition-all"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#C79A45]/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about products, prices, recipes, delivery..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#FAF6EE] border border-[#C79A45]/40 rounded-2xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C79A45]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-[#173F35] hover:bg-[#0C241E] disabled:opacity-40 text-[#F8F3E7] p-2.5 rounded-2xl transition-all shadow-md"
              >
                <Send className="w-4 h-4 text-[#C79A45]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function generateAssistantResponse(query: string, products: Product[]): ChatMessage {
  const q = query.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Papad Queries
  if (q.includes('papad') || q.includes('urad') || q.includes('moong') || q.includes('masala')) {
    const papads = products.filter((p) => p.category === 'Papad' || p.slug.includes('papad'));
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `We offer 4 handcrafted varieties of sun-cured papads made with authentic stone-ground pulses and traditional spices:\n\n• Urad Dal Papad (Classic crunch)\n• Moong Dal Papad (Light & easy to digest)\n• Masala Papad (Spicy with cumin & ajwain)\n• Rice Papad (Delicate & crispy)\n\nPrices start from ₹150 for 500g:`,
      products: papads,
      timestamp: time,
    };
  }

  // 2. Sevaya / Vermicelli / Noodles
  if (q.includes('sevaya') || q.includes('vermicelli') || q.includes('noodle') || q.includes('maggie') || q.includes('flour') || q.includes('grain')) {
    const grains = products.filter(
      (p) => p.category === 'Flours & Grains' || p.category === 'Noodles & Instant Foods' || p.slug.includes('sevaya') || p.slug.includes('noodle') || p.slug.includes('maggie')
    );
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🌾 *Traditional Wheat Sevaya:* Made from 100% whole-wheat grain flour with zero maida. Perfect for festive sweet kheer or savory morning upma!\n\n🍜 We also offer Hakka Noodles and Indian Masala Maggie. Check them out below:`,
      products: grains,
      timestamp: time,
    };
  }

  // 3. Turmeric / Haldi / Spices
  if (q.includes('turmeric') || q.includes('haldi') || q.includes('spice')) {
    const spices = products.filter((p) => p.slug.includes('turmeric') || p.category === 'Spices');
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🌶️ *Pure Stone-Ground Turmeric (Haldi) Powder:*\n\n100% natural, farm-sourced turmeric roots ground using slow traditional stone-milling to preserve natural curcumin and aromatic essential oils. Zero artificial coloring or chemical preservatives.\n\n• 500g Pack: ₹80\n• 1 kg Pack: ₹150`,
      products: spices,
      timestamp: time,
    };
  }

  // 4. Products under ₹150 / Budget
  if (q.includes('under') || q.includes('cheap') || q.includes('budget') || q.includes('150') || q.includes('100')) {
    const affordable = products.filter((p) => {
      const minPrice = p.variants?.[0]?.price || 100;
      return minPrice <= 150;
    });
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Here are our popular handcrafted food products under ₹150:`,
      products: affordable,
      timestamp: time,
    };
  }

  // 5. WhatsApp Ordering
  if (q.includes('whatsapp') || q.includes('how to order') || q.includes('order')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `📱 *Ordering is fast and easy:*\n\n1. Add items to your cart.\n2. Click the green "Order on WhatsApp" button in the cart or on any product page.\n3. Send your pre-filled order directly to WhatsApp: *9542836358*.\n\nAlternatively, dial our 24/7 Telephone Helpline at *9347036152*!`,
      timestamp: time,
      actionType: 'whatsapp',
    };
  }

  // 6. Delivery & Shipping
  if (q.includes('delivery') || q.includes('shipping') || q.includes('courier') || q.includes('charge')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🚚 *Shipping & Delivery Terms:*\n\n• Flat ₹40 delivery across Telangana, Andhra Pradesh, Maharashtra, Karnataka & All India.\n• **FREE SHIPPING on orders above ₹500!**\n• Orders are dispatched within 24 hours directly from our Bhainsa heritage workshop.\n• Typical transit time is 2 to 5 business days.`,
      timestamp: time,
    };
  }

  // 7. Contact / Location / Founder
  if (q.includes('contact') || q.includes('phone') || q.includes('address') || q.includes('location') || q.includes('owner') || q.includes('omkar')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🏛️ *Annapurna Aahaar Business Profile:*\n\n• **Founder & Owner:** Bande Omkar\n• **Workshop & Dispatch:** Main Market Area, Bhainsa, Nirmal District, Telangana (504103)\n• **24/7 Voice Telephone Helpline:** 9347036152\n• **WhatsApp Support & UPI:** 9542836358\n• **Email:** annapurnaaahaar@gmail.com`,
      timestamp: time,
    };
  }

  // 8. Returns / Refunds
  if (q.includes('return') || q.includes('refund') || q.includes('damage') || q.includes('cancel')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🛡️ *Return & Refund Guarantee:*\n\nWe provide a **7-Day Return Window** for any damaged or defective packages. 100% refund is processed within 3-5 business days upon inspection.`,
      timestamp: time,
    };
  }

  // Fallback: General catalogue showcase
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: `We specialize in authentic traditional Indian food products from Bhainsa, Telangana:\n\n• Roasted Whole Wheat Sevaya\n• Sun-Cured Dal Papads (Urad, Moong, Masala, Rice)\n• Stone-Ground Turmeric Powder\n• Healthy Wheat Noodles & Maggie\n\nHere are some of our featured items:`,
    products: products.slice(0, 4),
    timestamp: time,
  };
}
