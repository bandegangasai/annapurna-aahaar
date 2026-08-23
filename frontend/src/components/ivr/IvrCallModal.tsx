import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle2,
  Package,
  Clock,
  Sparkles,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { Product } from '../../types';

interface IvrCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
}

export const IvrCallModal: React.FC<IvrCallModalProps> = ({
  isOpen,
  onClose,
  defaultPhone = '9848012345',
}) => {
  const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [callSid, setCallSid] = useState('');
  const [callerPhone, setCallerPhone] = useState(defaultPhone);
  const [language, setLanguage] = useState<'ENGLISH' | 'MARATHI' | 'HINDI' | 'TELUGU'>('ENGLISH');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentStep, setCurrentStep] = useState<
    'LANGUAGE' | 'MAIN_MENU' | 'PRODUCT_SELECT' | 'VARIANT_SELECT' | 'CONFIRM' | 'SUCCESS' | 'TRACK' | 'CANCEL' | 'SUPPORT'
  >('LANGUAGE');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const durationTimerRef = useRef<any>(null);

  // Fetch live products on open
  useEffect(() => {
    if (isOpen) {
      api.getProducts().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      });
      startCall();
    } else {
      endCall();
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  // Voice synthesis helper
  const speakPrompt = (text: string, lang: 'ENGLISH' | 'MARATHI' | 'HINDI' | 'TELUGU') => {
    setCurrentPrompt(text);
    if (!speechEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (lang === 'HINDI') utterance.lang = 'hi-IN';
      else if (lang === 'MARATHI') utterance.lang = 'mr-IN';
      else if (lang === 'TELUGU') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';

      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Start new inbound call session
  const startCall = async () => {
    const newCallSid = `WEB_IVR_${Date.now()}`;
    setCallSid(newCallSid);
    setCallState('CONNECTING' as any);
    setCallDuration(0);
    setSelectedProduct(null);
    setSelectedVariant(null);
    setCreatedOrder(null);
    setCurrentStep('LANGUAGE');

    try {
      // Register incoming call in backend
      await api.simulateIvr({
        action: 'INCOMING',
        callSid: newCallSid,
        fromPhone: callerPhone,
        language: 'ENGLISH',
      } as any);

      setCallState('CONNECTED');
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      speakPrompt(
        'Welcome to Annapurna Aahaar, Bhainsa, Telangana. For English, press 1. मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ. తెలుగు కోసం 4 నొక్కండి.',
        'ENGLISH'
      );
    } catch {
      setCallState('CONNECTED');
    }
  };

  // End active call session
  const endCall = () => {
    setCallState('ENDED');
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Handle DTMF Keypress (1, 2, 3, 4, 9, 0)
  const handleKeypadPress = async (digit: string) => {
    // 1. Language Selection Step
    if (currentStep === 'LANGUAGE') {
      let chosenLang: 'ENGLISH' | 'MARATHI' | 'HINDI' | 'TELUGU' = 'ENGLISH';
      if (digit === '2') chosenLang = 'MARATHI';
      else if (digit === '3') chosenLang = 'HINDI';
      else if (digit === '4') chosenLang = 'TELUGU';

      setLanguage(chosenLang);
      setCurrentStep('MAIN_MENU');

      try {
        await api.simulateIvr({
          action: 'SELECT_LANGUAGE',
          callSid,
          fromPhone: callerPhone,
          digits: digit,
          language: chosenLang,
        } as any);
      } catch {}

      if (chosenLang === 'MARATHI') {
        speakPrompt(
          'अन्नपूर्णा आहार मध्ये आपले स्वागत आहे. नवीन ऑर्डर करण्यासाठी 1 दाबा. आपली ऑर्डर ट्रॅक करण्यासाठी 2 दाबा. ऑर्डर रद्द करण्यासाठी 3 दाबा. ग्राहक सेवेशी बोलण्यासाठी 4 दाबा. हा मेनू पुन्हा ऐकण्यासाठी 9 दाबा.',
          'MARATHI'
        );
      } else if (chosenLang === 'HINDI') {
        speakPrompt(
          'अन्नपूर्णा आहार में आपका स्वागत है। ऑर्डर करने के लिए 1 दबाएँ। ऑर्डर ट्रैक करने के लिए 2 दबाएँ। ऑर्डर कैंसल करने के लिए 3 दबाएँ। ग्राहक सहायता के लिए 4 दबाएँ। मेनू दोबारा सुनने के लिए 9 दबाएँ।',
          'HINDI'
        );
      } else if (chosenLang === 'TELUGU') {
        speakPrompt(
          'అన్నపూర్ణ ఆహార్ కు స్వాగతం. ఆర్డర్ చేయడానికి 1 నొక్కండి. మీ ఆర్డర్ను ట్రాక్ చేయడానికి 2 నొక్కండి. ఆర్డర్ను రద్దు చేయడానికి 3 నొక్కండి. కస్టమర్ సహాయం కోసం 4 నొక్కండి. మెనూను మళ్లీ వినడానికి 9 నొక్కండి.',
          'TELUGU'
        );
      } else {
        speakPrompt(
          'Welcome to Annapurna Aahaar. For placing or confirming an order, press 1. For tracking your order, press 2. For cancelling an order, press 3. To speak with customer support, press 4. To repeat this menu, press 9.',
          'ENGLISH'
        );
      }
      return;
    }

    // 2. Main Menu Step
    if (currentStep === 'MAIN_MENU') {
      if (digit === '1') {
        // Place Order -> Go to Product Selection
        setCurrentStep('PRODUCT_SELECT');
        let prodText = 'Please select a product. ';
        products.slice(0, 8).forEach((p, idx) => {
          prodText += `For ${p.name}, press ${idx + 1}. `;
        });
        prodText += 'To repeat products, press 9. To return, press 0.';
        speakPrompt(prodText, language);
        return;
      }

      if (digit === '2') {
        // Track Order
        setCurrentStep('TRACK');
        const trackMsg =
          language === 'TELUGU'
            ? `మీ ఫోన్ నంబర్ ${callerPhone} పై ఉన్న ఆర్డర్ ప్రస్తుత స్థితి: ACCEPTED. కిచెన్ మేనేజర్ ప్యాకింగ్ చేస్తున్నారు.`
            : language === 'HINDI'
            ? `आपके फ़ोन नंबर ${callerPhone} पर ऑर्डर की स्थिति: ACCEPTED है।`
            : language === 'MARATHI'
            ? `आपल्या फोन नंबर ${callerPhone} वरील ऑर्डर सध्या ACCEPTED स्थितीत आहे.`
            : `Your recent order from phone ${callerPhone} is currently ACCEPTED and being packed.`;
        speakPrompt(trackMsg, language);
        return;
      }

      if (digit === '3') {
        // Cancel Order
        setCurrentStep('CANCEL');
        const cancelMsg =
          language === 'TELUGU'
            ? 'మీరు మీ ఆర్డర్ ను రద్దు చేయాలనుకుంటున్నారా? రద్దు చేయడానికి 1 నొక్కండి. ఉంచడానికి 2 నొక్కండి.'
            : language === 'HINDI'
            ? 'क्या आप अपना ऑर्डर रद्द करना चाहते हैं? रद्द करने के लिए 1 दबाएँ। रखने के लिए 2 दबाएँ।'
            : language === 'MARATHI'
            ? 'आपण आपली ऑर्डर रद्द करू इच्छिता? पुष्टीसाठी 1 दाबा.'
            : 'Do you want to cancel your order? Press 1 to confirm cancellation. Press 2 to keep your order.';
        speakPrompt(cancelMsg, language);
        return;
      }

      if (digit === '4') {
        // Customer Support
        setCurrentStep('SUPPORT');
        const supportMsg =
          language === 'TELUGU'
            ? 'దయచేసి వేచి ఉండండి, మీ కాల్ ను అన్నపూర్ణ ఆహార్ ప్రతినిధి 6305970844 కు బదిలీ చేస్తున్నాము.'
            : language === 'HINDI'
            ? 'कृपया प्रतीक्षा करें, हम आपका कॉल ग्राहक सेवा 6305970844 को ट्रांसफर कर रहे हैं।'
            : language === 'MARATHI'
            ? 'कृपया थांबा, आम्ही आपला कॉल प्रतिनिधीकडे ट्रान्सफर करत आहोत.'
            : 'Please hold while we transfer your call to our customer helpline at 6305970844.';
        speakPrompt(supportMsg, language);
        return;
      }

      if (digit === '9') {
        handleKeypadPress('1');
        return;
      }
    }

    // 3. Product Selection Step
    if (currentStep === 'PRODUCT_SELECT') {
      if (digit === '0') {
        setCurrentStep('MAIN_MENU');
        handleKeypadPress('9');
        return;
      }

      const index = parseInt(digit, 10) - 1;
      if (index >= 0 && index < products.length) {
        const prod = products[index];
        setSelectedProduct(prod);
        setCurrentStep('VARIANT_SELECT');

        let varText = `You selected ${prod.name}. Please select package weight: `;
        prod.variants.forEach((v, vIdx) => {
          varText += `For ${v.weight} at ${v.price} rupees, press ${vIdx + 1}. `;
        });
        varText += 'To return, press 0.';
        speakPrompt(varText, language);
        return;
      }
    }

    // 4. Variant Selection Step
    if (currentStep === 'VARIANT_SELECT' && selectedProduct) {
      if (digit === '0') {
        setCurrentStep('PRODUCT_SELECT');
        return;
      }

      const vIndex = parseInt(digit, 10) - 1;
      if (vIndex >= 0 && vIndex < selectedProduct.variants.length) {
        const vr = selectedProduct.variants[vIndex];
        setSelectedVariant(vr);
        setCurrentStep('CONFIRM');

        const subtotal = vr.price;
        const deliveryFee = subtotal >= 500 ? 0 : 40;
        const total = subtotal + deliveryFee;

        let confText = `You selected 1 pack of ${selectedProduct.name} ${vr.weight}. Total amount is ${total} rupees. Payment method is Cash on Delivery. To confirm this order, press 1. To change, press 2. To cancel, press 3.`;
        if (language === 'TELUGU') {
          confText = `మీరు ${selectedProduct.name} ${vr.weight} ఎంచుకున్నారు. మొత్తం ధర ${total} రూపాయలు. ఈ ఆర్డర్ ను నిర్ధారించడానికి 1 నొక్కండి. మార్చడానికి 2 నొక్కండి.`;
        } else if (language === 'HINDI') {
          confText = `आपने ${selectedProduct.name} ${vr.weight} चुना है। कुल राशि ${total} रुपये है। इस ऑर्डर की पुष्टि के लिए 1 दबाएँ। बदलने के लिए 2 दबाएँ।`;
        } else if (language === 'MARATHI') {
          confText = `आपण ${selectedProduct.name} ${vr.weight} निवडले आहे. एकूण रक्कम ${total} रुपये आहे. ऑर्डर कन्फर्म करण्यासाठी 1 दाबा.`;
        }

        speakPrompt(confText, language);
        return;
      }
    }

    // 5. Order Confirmation Step
    if (currentStep === 'CONFIRM') {
      if (digit === '2') {
        setCurrentStep('PRODUCT_SELECT');
        return;
      }

      if (digit === '3') {
        setCurrentStep('MAIN_MENU');
        return;
      }

      if (digit === '1') {
        // Create live order in database!
        try {
          const res = await api.simulateIvr({
            action: 'PLACE_ORDER',
            callSid,
            fromPhone: callerPhone,
            language,
          } as any);

          if (res.success && res.data) {
            setCreatedOrder(res.data);
            setCurrentStep('SUCCESS');

            let thankMsg = `Thank you! Your order number is ${res.data.orderNumber} for total ${res.data.total} rupees. It is permanently saved in the database and sent to kitchen. Goodbye.`;
            if (language === 'TELUGU') {
              thankMsg = `ధన్యవాదాలు! మీ ఆర్డర్ నంబర్ ${res.data.orderNumber}. మొత్తం ధర ${res.data.total} రూపాయలు. మా బృందం త్వరలో తయారు చేస్తుంది. నమస్కారం.`;
            } else if (language === 'HINDI') {
              thankMsg = `धन्यवाद! आपका ऑर्डर नंबर ${res.data.orderNumber} है। कुल राशि ${res.data.total} रुपये है। नमस्ते।`;
            } else if (language === 'MARATHI') {
              thankMsg = `धन्यवाद! आपली ऑर्डर नंबर ${res.data.orderNumber} आहे. एकूण रक्कम ${res.data.total} रुपये आहे. नमस्कार.`;
            }

            speakPrompt(thankMsg, language);
          }
        } catch (e) {
          console.error('Simulate order error:', e);
        }
      }
    }

    // 6. Cancel Step
    if (currentStep === 'CANCEL' && digit === '1') {
      speakPrompt('Your order has been successfully cancelled in the database.', language);
      setCurrentStep('MAIN_MENU');
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-[#2A060C] text-white max-w-md w-full rounded-3xl shadow-2xl border-2 border-heritage-gold/40 overflow-hidden flex flex-col justify-between">
        {/* Call Header */}
        <div className="p-6 text-center border-b border-white/10 space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-stone-400 hover:text-white text-sm p-1"
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 bg-heritage-gold/20 text-heritage-gold px-3 py-1 rounded-full text-xs font-bold border border-heritage-gold/30 uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Voice IVR Simulator</span>
          </div>

          <h3 className="font-serif font-black text-2xl text-cream-50">
            Annapurna Aahaar
          </h3>
          <p className="font-mono text-sm text-heritage-gold font-bold tracking-widest">
            9347036152
          </p>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{callState === 'CONNECTED' ? `CONNECTED • ${formatTimer(callDuration)}` : 'CALLING...'}</span>
          </div>
        </div>

        {/* Live Spoken Voice Bubble */}
        <div className="p-5 mx-4 my-2 bg-white/10 backdrop-blur-md rounded-2xl border border-heritage-gold/30 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Voice Prompt ({language})</span>
            </div>
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-bold"
            >
              {speechEnabled ? 'Audio Speech ON' : 'Muted'}
            </button>
          </div>
          <p className="text-cream-100 font-serif leading-relaxed italic text-xs">
            "{currentPrompt}"
          </p>
        </div>

        {/* Successful Order Banner */}
        {createdOrder && (
          <div className="mx-4 p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-1 animate-bounce">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-serif font-bold text-base text-emerald-200">
              Order #{createdOrder.orderNumber} Created!
            </div>
            <p className="text-[11px] text-emerald-300">
              Total: {formatINR(createdOrder.total)} • Source: IVR • Saved to Database
            </p>
          </div>
        )}

        {/* DTMF Interactive Phone Keypad */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto text-center">
            {[
              { num: '1', sub: 'ENG / Order' },
              { num: '2', sub: 'मराठी / Track' },
              { num: '3', sub: 'हिंदी / Cancel' },
              { num: '4', sub: 'తెలుగు / Support' },
              { num: '5', sub: 'Rice Papad' },
              { num: '6', sub: 'Turmeric' },
              { num: '7', sub: 'Maggie' },
              { num: '8', sub: 'Noodles' },
              { num: '9', sub: 'Repeat' },
              { num: '*', sub: 'Back' },
              { num: '0', sub: 'Main Menu' },
              { num: '#', sub: 'Finish' },
            ].map((k) => (
              <button
                key={k.num}
                onClick={() => handleKeypadPress(k.num)}
                className="bg-white/10 hover:bg-heritage-gold hover:text-heritage-darkMaroon active:scale-95 text-white p-3 rounded-2xl border border-white/15 transition-all shadow-md flex flex-col items-center justify-center group"
              >
                <span className="font-mono font-black text-xl">{k.num}</span>
                <span className="text-[8px] text-stone-400 group-hover:text-heritage-darkMaroon font-semibold truncate max-w-[65px]">
                  {k.sub}
                </span>
              </button>
            ))}
          </div>

          {/* End Call / Restart Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={startCall}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Restart Call</span>
            </button>

            <button
              onClick={onClose}
              className="bg-rose-700 hover:bg-rose-800 text-white px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Hang Up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
