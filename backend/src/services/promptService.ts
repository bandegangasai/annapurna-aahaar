/**
 * Annapurna Aahaar — Centralized Multilingual Prompt Engine
 * Provides natural spoken voice prompt texts across English, Marathi (मराठी), Hindi (हिंदी), and Telugu (తెలుగు).
 * Primary Business IVR Hotline: 9347036152
 */

export type IvrLanguage = 'ENGLISH' | 'MARATHI' | 'HINDI' | 'TELUGU';

export type PromptKey =
  | 'WELCOME'
  | 'LANGUAGE_MENU'
  | 'MAIN_MENU'
  | 'ORDER_MENU'
  | 'PRODUCT_MENU'
  | 'VARIANT_MENU'
  | 'QUANTITY_MENU'
  | 'ADDRESS_PROMPT'
  | 'PAYMENT_MENU'
  | 'ORDER_SUMMARY'
  | 'CONFIRM_ORDER'
  | 'ORDER_CREATED'
  | 'ORDER_TRACKING'
  | 'ORDER_CANCEL'
  | 'CANCEL_CONFIRMATION'
  | 'INVALID_INPUT'
  | 'NO_INPUT'
  | 'TRY_AGAIN'
  | 'CUSTOMER_SUPPORT'
  | 'GOODBYE'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'ORDER_NOT_FOUND'
  | 'ORDER_ACCEPTED'
  | 'ORDER_PROCESSING'
  | 'ORDER_READY'
  | 'ORDER_OUT_FOR_DELIVERY'
  | 'ORDER_DELIVERED'
  | 'ORDER_REJECTED'
  | 'LANGUAGE_CHANGED';

export const PROMPTS: Record<PromptKey, Record<IvrLanguage, string>> = {
  WELCOME: {
    ENGLISH: 'Welcome to Annapurna Aahaar, Bhainsa, Telangana. Tradition in Every Grain.',
    MARATHI: 'अन्नपूर्णा आहार मध्ये आपले स्वागत आहे. प्रत्येक दाण्यात परंपरेची चव.',
    HINDI: 'अन्नपूर्णा आहार में आपका स्वागत है। हर दाने में परंपरा का स्वाद।',
    TELUGU: 'అన్నపూర్ణ ఆహార్ కు స్వాగతం. ప్రతి గింజలో సంప్రదాయం.',
  },
  LANGUAGE_MENU: {
    ENGLISH: 'For English, press 1. मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ. తెలుగు కోసం 4 నొక్కండి.',
    MARATHI: 'मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ. తెలుగు కోసం 4 నొక్కండి. For English, press 1.',
    HINDI: 'हिंदी के लिए 3 दबाएँ। मराठीसाठी 2 दाबा। తెలుగు కోసం 4 నొక్కండి। For English, press 1.',
    TELUGU: 'తెలుగు కోసం 4 నొక్కండి. For English, press 1. मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ.',
  },
  MAIN_MENU: {
    ENGLISH:
      'Welcome to Annapurna Aahaar. To place or confirm an order, press 1. To track your order, press 2. To cancel your order, press 3. For customer support, press 4. To change your language, press 9.',
    MARATHI:
      'अन्नपूर्णा आहार मध्ये आपले स्वागत आहे. ऑर्डर करण्यासाठी किंवा ऑर्डरची पुष्टी करण्यासाठी 1 दाबा. तुमची ऑर्डर ट्रॅक करण्यासाठी 2 दाबा. ऑर्डर रद्द करण्यासाठी 3 दाबा. ग्राहक सेवेसाठी 4 दाबा. भाषा बदलण्यासाठी 9 दाबा.',
    HINDI:
      'अन्नपूर्णा आहार में आपका स्वागत है। ऑर्डर करने या ऑर्डर की पुष्टि करने के लिए 1 दबाएँ। अपना ऑर्डर ट्रैक करने के लिए 2 दबाएँ। ऑर्डर रद्द करने के लिए 3 दबाएँ। ग्राहक सहायता के लिए 4 दबाएँ। भाषा बदलने के लिए 9 दबाएँ।',
    TELUGU:
      'అన్నపూర్ణ ఆహార్ కు స్వాగతం. ఆర్డర్ చేయడానికి లేదా ఆర్డర్ నిర్ధారించడానికి 1 నొక్కండి. మీ ఆర్డర్ను ట్రాక్ చేయడానికి 2 నొక్కండి. ఆర్డర్ను రద్దు చేయడానికి 3 నొక్కండి. కస్టమర్ సహాయం కోసం 4 నొక్కండి. భాష మార్చడానికి 9 నొక్కండి.',
  },
  ORDER_MENU: {
    ENGLISH: 'Please select a product from our catalog. To repeat the product menu, press 9. To return to the main menu, press 0.',
    MARATHI: 'कृपया आमच्या सूचीमधून उत्पादन निवडा. उत्पादनांची यादी पुन्हा ऐकण्यासाठी 9 दाबा. मुख्य मेनूवर परत जाण्यासाठी 0 दाबा.',
    HINDI: 'कृपया हमारी सूची से उत्पाद चुनें। उत्पाद सूची दोबारा सुनने के लिए 9 दबाएँ। मुख्य मेनू पर लौटने के लिए 0 दबाएँ।',
    TELUGU: 'దయచేసి మా జాబితా నుండి ప్రోడక్ట్ ఎంచుకోండి. ప్రోడక్ట్ జాబితా మళ్లీ వినడానికి 9 నొక్కండి. మెయిన్ మెనూకు వెళ్లడానికి 0 నొక్కండి.',
  },
  PRODUCT_MENU: {
    ENGLISH: 'Please select a product by pressing its number.',
    MARATHI: 'कृपया उत्पादनाचा क्रमांक दाबून उत्पादन निवडा.',
    HINDI: 'कृपया उत्पाद का नंबर दबाकर उत्पाद चुनें।',
    TELUGU: 'దయచేసి నంబర్ నొక్కి ప్రోడక్ట్ ఎంచుకోండి.',
  },
  VARIANT_MENU: {
    ENGLISH: 'Please select your package weight. To return, press 0.',
    MARATHI: 'कृपया पॅकेटचे वजन निवडा. मागे जाण्यासाठी 0 दाबा.',
    HINDI: 'कृपया पैकेट का वजन चुनें। वापस जाने के लिए 0 दबाएँ।',
    TELUGU: 'దయచేసి ప్యాకెట్ బరువు ఎంచుకోండి. వెనుకకు వెళ్లడానికి 0 నొక్కండి.',
  },
  QUANTITY_MENU: {
    ENGLISH: 'Please enter the quantity of packs you would like to order, between 1 and 20.',
    MARATHI: 'कृपया आपल्याला हवी असलेली पाकिटांची संख्या 1 ते 20 दरम्यान प्रविष्ट करा.',
    HINDI: 'कृपया जितने पैकेट आप मंगाना चाहते हैं, 1 से 20 के बीच संख्या दर्ज करें।',
    TELUGU: 'దయచేసి మీకు కావలసిన ప్యాకెట్ల సంఖ్యను 1 నుండి 20 మధ్య నమోదు చేయండి.',
  },
  ADDRESS_PROMPT: {
    ENGLISH: 'Your delivery address is recorded from your mobile location in Bhainsa, Telangana.',
    MARATHI: 'आपला डिलिव्हरी पत्ता आपल्या मोबाईल स्थानानुसार भैंसा, तेलंगणा येथे नोंदवला गेला आहे.',
    HINDI: 'आपका डिलीवरी पता आपके मोबाइल स्थान के अनुसार भैंसा, तेलंगाना दर्ज किया गया है।',
    TELUGU: 'మీ డెలివరీ చిరునామా మీ మొబైల్ లొకేషన్ ప్రకారం భైంసా, తెలంగాణ గా నమోదు చేయబడింది.',
  },
  PAYMENT_MENU: {
    ENGLISH: 'Payment method is Cash on Delivery. For manual UPI to 9542826358, notify on delivery.',
    MARATHI: 'पेमेंट पद्धत कॅश ऑन डिलिव्हरी आहे. 9542826358 वर युपीआय द्वारे पैसे देण्याचा पर्याय देखील उपलब्ध आहे.',
    HINDI: 'भुगतान का तरीका कैश ऑन डिलीवरी है। 9542826358 पर यूपीआई से भी भुगतान कर सकते हैं।',
    TELUGU: 'చెల్లింపు విధానం క్యాష్ ఆన్ డెలివరీ. 9542826358 నంబర్‌కు యూపీఐ ద్వారా కూడా చెల్లించవచ్చు.',
  },
  ORDER_SUMMARY: {
    ENGLISH: 'Order summary: {summary}. Total payable amount is {total} rupees.',
    MARATHI: 'ऑर्डर तपशील: {summary}. एकूण देय रक्कम {total} रुपये आहे.',
    HINDI: 'ऑर्डर विवरण: {summary}। कुल देय राशि {total} रुपये है।',
    TELUGU: 'ఆర్డర్ వివరాలు: {summary}. మొత్తం చెల్లించాల్సిన మొత్తం {total} రూపాయలు.',
  },
  CONFIRM_ORDER: {
    ENGLISH: 'To confirm this order, press 1. To change the order, press 2. To cancel and return, press 3.',
    MARATHI: 'या ऑर्डरची पुष्टी करण्यासाठी 1 दाबा. ऑर्डर बदलण्यासाठी 2 दाबा. रद्द करण्यासाठी 3 दाबा.',
    HINDI: 'इस ऑर्डर की पुष्टि के लिए 1 दबाएँ। ऑर्डर बदलने के लिए 2 दबाएँ। रद्द करने के लिए 3 दबाएँ।',
    TELUGU: 'ఈ ఆర్డర్ ను నిర్ధారించడానికి 1 నొక్కండి. ఆర్డర్ మార్చడానికి 2 నొక్కండి. రద్దు చేయడానికి 3 నొక్కండి.',
  },
  ORDER_CREATED: {
    ENGLISH: 'Thank you! Your order number is {orderNumber}. Total amount is {total} rupees. Your fresh authentic food will be delivered shortly. Goodbye.',
    MARATHI: 'धन्यवाद! आपली ऑर्डर नंबर {orderNumber} आहे. एकूण रक्कम {total} रुपये आहे. आपली ताजी अस्सल उत्पादने लवकरच वितरित केली जातील. नमस्कार.',
    HINDI: 'धन्यवाद! आपका ऑर्डर नंबर {orderNumber} है। कुल राशि {total} रुपये है। आपका शुद्ध उत्पाद जल्द ही डिलीवर कर दिया जाएगा। नमस्ते।',
    TELUGU: 'ధన్యవాదాలు! మీ ఆర్డర్ నంబర్ {orderNumber}. మొత్తం ధర {total} రూపాయలు. మా బృందం త్వరలో తయారు చేసి డెలివరీ చేస్తుంది. నమస్కారం.',
  },
  ORDER_TRACKING: {
    ENGLISH: 'Your order number {orderNumber} is currently {status}. {statusDetail}',
    MARATHI: 'आपली ऑर्डर नंबर {orderNumber} सध्या {status} स्थितीत आहे. {statusDetail}',
    HINDI: 'आपका ऑर्डर नंबर {orderNumber} वर्तमान में {status} है। {statusDetail}',
    TELUGU: 'మీ ఆర్డర్ నంబర్ {orderNumber} ప్రస్తుత స్థితి: {status}. {statusDetail}',
  },
  ORDER_CANCEL: {
    ENGLISH: 'Do you want to cancel order number {orderNumber}? To confirm cancellation, press 1. To keep your order, press 2.',
    MARATHI: 'आपण ऑर्डर नंबर {orderNumber} रद्द करू इच्छिता? पुष्टीसाठी 1 दाबा. ऑर्डर चालू ठेवण्यासाठी 2 दाबा.',
    HINDI: 'क्या आप ऑर्डर नंबर {orderNumber} रद्द करना चाहते हैं? पुष्टि के लिए 1 दबाएँ। ऑर्डर रखने के लिए 2 दबाएँ।',
    TELUGU: 'మీరు ఆర్డర్ నంబర్ {orderNumber} ను రద్దు చేయాలనుకుంటున్నారా? నిర్ధారించడానికి 1 నొక్కండి. ఉంచడానికి 2 నొక్కండి.',
  },
  CANCEL_CONFIRMATION: {
    ENGLISH: 'Your order number {orderNumber} has been successfully cancelled.',
    MARATHI: 'आपली ऑर्डर नंबर {orderNumber} यशस्वीरित्या रद्द करण्यात आली आहे.',
    HINDI: 'आपका ऑर्डर नंबर {orderNumber} सफलतापूर्वक रद्द कर दिया गया है।',
    TELUGU: 'మీ ఆర్డర్ నంబర్ {orderNumber} విజయవంతంగా రద్దు చేయబడింది.',
  },
  INVALID_INPUT: {
    ENGLISH: 'Sorry, that is not a valid option. Please try again.',
    MARATHI: 'क्षमस्व, हा पर्याय उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.',
    HINDI: 'क्षमा करें, यह एक अमान्य विकल्प है। कृपया पुनः प्रयास करें।',
    TELUGU: 'క్షమించండి, అది సరైన ఎంపిక కాదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },
  NO_INPUT: {
    ENGLISH: 'We did not receive any input.',
    MARATHI: 'आम्हाला कोणताही इनपुट प्राप्त झाला नाही.',
    HINDI: 'हमें कोई इनपुट प्राप्त नहीं हुआ।',
    TELUGU: 'మాకు ఎటువంటి ఇన్పుట్ అందలేదు.',
  },
  TRY_AGAIN: {
    ENGLISH: 'Please listen to the options and press a number on your keypad.',
    MARATHI: 'कृपया पर्याय ऐका आणि आपल्या कीपॅडवर क्रमांक दाबा.',
    HINDI: 'कृपया विकल्प सुनें और अपने कीपैड पर नंबर दबाएँ।',
    TELUGU: 'దయచేసి ఎంపికలను విని మీ కీప్యాడ్ పై నంబర్ నొక్కండి.',
  },
  CUSTOMER_SUPPORT: {
    ENGLISH: 'Please hold while we transfer your call to our customer support manager at 6305970844.',
    MARATHI: 'कृपया थांबा, आम्ही आपला कॉल अन्नपूर्णा आहार ग्राहक प्रतिनिधीकडे 6305970844 वर ट्रान्सफर करत आहोत.',
    HINDI: 'कृपया प्रतीक्षा करें, हम आपका कॉल ग्राहक सहायता प्रतिनिधि को 6305970844 पर ट्रांसफर कर रहे हैं।',
    TELUGU: 'దయచేసి వేచి ఉండండి, మీ కాల్ ను అన్నపూర్ణ ఆహార్ కస్టమర్ కేర్ ప్రతినిధి 6305970844 కు బదిలీ చేస్తున్నాము.',
  },
  GOODBYE: {
    ENGLISH: 'Thank you for calling Annapurna Aahaar, Bhainsa. Have a wonderful day. Goodbye.',
    MARATHI: 'अन्नपूर्णा आहार, भैंसा येथे संपर्क केल्याबद्दल धन्यवाद. आपला दिवस शुभ जावो. नमस्कार.',
    HINDI: 'अन्नपूर्णा आहार, भैंसा में कॉल करने के लिए धन्यवाद। आपका दिन शुभ हो। नमस्ते।',
    TELUGU: 'అన్నపూర్ణ ఆహార్, భైంసా కు కాల్ చేసినందుకు ధన్యవాదాలు. శుభదినం. నమస్కారం.',
  },
  PAYMENT_PENDING: {
    ENGLISH: 'Payment is pending. You can pay via Cash on Delivery or UPI to 9542826358.',
    MARATHI: 'पेमेंट बाकी आहे. आपण डिलिव्हरीच्या वेळी रोख किंवा 9542826358 वर युपीआय करू शकता.',
    HINDI: 'भुगतान लंबित है। आप डिलीवरी पर नकद या 9542826358 पर यूपीआई कर सकते हैं।',
    TELUGU: 'చెల్లింపు పెండింగ్‌లో ఉంది. మీరు క్యాష్ ఆన్ డెలివరీ లేదా 9542826358 కు యూపీఐ చేయవచ్చు.',
  },
  PAYMENT_SUCCESS: {
    ENGLISH: 'Your payment has been successfully verified.',
    MARATHI: 'आपले पेमेंट यशस्वीरित्या सत्यापित झाले आहे.',
    HINDI: 'आपका भुगतान सफलतापूर्वक सत्यापित हो गया है।',
    TELUGU: 'మీ చెల్లింపు విజయవంతంగా ధృవీకరించబడింది.',
  },
  PAYMENT_FAILED: {
    ENGLISH: 'Payment verification was unsuccessful. Please check with customer support.',
    MARATHI: 'पेमेंट सत्यापन अयशस्वी झाले. कृपया ग्राहक सेवेशी संपर्क साधा.',
    HINDI: 'भुगतान सत्यापन असफल रहा। कृपया ग्राहक सहायता से संपर्क करें।',
    TELUGU: 'చెల్లింపు ధృవీకరణ విఫలమైంది. దయచేసి కస్టమర్ సపోర్ట్‌ను సంప్రదించండి.',
  },
  ORDER_NOT_FOUND: {
    ENGLISH: 'No active orders were found for your phone number. To place a new order, press 1.',
    MARATHI: 'आपल्या फोन नंबरवर कोणतीही ऑर्डर सापडली नाही. नवीन ऑर्डर करण्यासाठी 1 दाबा.',
    HINDI: 'आपके फ़ोन नंबर पर कोई सक्रिय ऑर्डर नहीं मिला। नया ऑर्डर करने के लिए 1 दबाएँ।',
    TELUGU: 'మీ ఫోన్ నంబర్ పై ఎలాంటి యాక్టివ్ ఆర్డర్ కనుగొనబడలేదు. కొత్త ఆర్డర్ చేయడానికి 1 నొక్కండి.',
  },
  ORDER_ACCEPTED: {
    ENGLISH: 'Your order has been accepted by our kitchen manager and is queued for preparation.',
    MARATHI: 'आपली ऑर्डर स्वीकारली गेली आहे आणि तयार करण्यासाठी पाठवली आहे.',
    HINDI: 'आपका ऑर्डर स्वीकार कर लिया गया है और तैयारी में है।',
    TELUGU: 'మీ ఆర్డర్ ఆమోదించబడింది మరియు తయారీలో ఉంది.',
  },
  ORDER_PROCESSING: {
    ENGLISH: 'Your order is currently being freshly prepared and packed.',
    MARATHI: 'आपली उत्पादने ताजी तयार करून पॅक केली जात आहेत.',
    HINDI: 'आपका उत्पाद ताजा तैयार करके पैक किया जा रहा है।',
    TELUGU: 'మీ ఆర్డర్ తాజాగా తయారు చేయబడి ప్యాక్ చేయబడుతోంది.',
  },
  ORDER_READY: {
    ENGLISH: 'Your order is packed and ready for dispatch.',
    MARATHI: 'आपली ऑर्डर पॅक झाली असून वितरणासाठी तयार आहे.',
    HINDI: 'आपका ऑर्डर पैक हो चुका है और डिलीवरी के लिए तैयार है।',
    TELUGU: 'మీ ఆర్డర్ ప్యాక్ చేయబడి డెలివరీకి సిద్ధంగా ఉంది.',
  },
  ORDER_OUT_FOR_DELIVERY: {
    ENGLISH: 'Your order is out for delivery with our delivery executive.',
    MARATHI: 'आपली ऑर्डर वितरणासाठी निघाली आहे.',
    HINDI: 'आपका ऑर्डर डिलीवरी के लिए निकल चुका है।',
    TELUGU: 'మీ ఆర్డర్ డెలివరీ కొరకు బయలుదేరింది.',
  },
  ORDER_DELIVERED: {
    ENGLISH: 'Your order has been successfully delivered. Enjoy authentic Annapurna Aahaar.',
    MARATHI: 'आपली ऑर्डर यशस्वीरित्या वितरित केली गेली आहे. अन्नपूर्णा आहाराचा आस्वाद घ्या.',
    HINDI: 'आपका ऑर्डर सफलतापूर्वक डिलीवर हो चुका है। अन्नपूर्णा आहार का आनंद लें।',
    TELUGU: 'మీ ఆర్డర్ విజయవంతంగా డెలివరీ చేయబడింది. అన్నపూర్ణ ఆహార్‌ను ఆస్వాదించండి.',
  },
  ORDER_REJECTED: {
    ENGLISH: 'Your order could not be fulfilled at this time. Please contact customer support.',
    MARATHI: 'सध्या ही ऑर्डर पूर्ण होऊ शकत नाही. कृपया ग्राहक सेवेशी संपर्क साधा.',
    HINDI: 'वर्तमान में यह ऑर्डर पूरा नहीं किया जा सका। कृपया ग्राहक सेवा से संपर्क करें।',
    TELUGU: 'ప్రస్తుతం ఈ ఆర్డర్ పూర్తి కాలేదు. దయచేసి కస్టమర్ కేర్‌ను సంప్రదించండి.',
  },
  LANGUAGE_CHANGED: {
    ENGLISH: 'Your language has been set to English.',
    MARATHI: 'आपली भाषा मराठी म्हणून निवडली गेली आहे.',
    HINDI: 'आपकी भाषा हिंदी के रूप में सेट कर दी गई है।',
    TELUGU: 'మీ భాష తెలుగుగా మార్చబడింది.',
  },
};

export class PromptService {
  /**
   * Retrieve translated voice prompt with dynamic parameter replacement
   */
  public static getPrompt(
    language: IvrLanguage,
    key: PromptKey,
    params?: Record<string, string | number>
  ): string {
    const lang = language || 'ENGLISH';
    const dict = PROMPTS[key] || PROMPTS.INVALID_INPUT;
    let text = dict[lang] || dict.ENGLISH;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  }
}
