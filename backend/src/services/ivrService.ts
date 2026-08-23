import { ENV } from '../config/env';
import prisma from '../config/prisma';

export type IvrLanguage = 'ENGLISH' | 'MARATHI' | 'HINDI' | 'TELUGU';

export interface IvrSessionData {
  callSid: string;
  fromPhone: string;
  toPhone: string;
  language: IvrLanguage;
  step: string;
  selectedProductId?: string;
  selectedVariantId?: string;
  selectedQuantity?: number;
  customerName?: string;
  customerAddress?: string;
  orderNumberToTrack?: string;
  orderNumberToCancel?: string;
}

// Memory session cache with 1-hour TTL
export const ivrSessions = new Map<string, IvrSessionData>();

export function getOrCreateSession(callSid: string, fromPhone: string): IvrSessionData {
  let session = ivrSessions.get(callSid);
  if (!session) {
    session = {
      callSid,
      fromPhone: fromPhone || '9848012345',
      toPhone: ENV.IVR_PHONE_NUMBER || '9347036152',
      language: 'ENGLISH',
      step: 'LANGUAGE_SELECT',
    };
    ivrSessions.set(callSid, session);
  }
  return session;
}

export function updateSession(callSid: string, updates: Partial<IvrSessionData>): IvrSessionData {
  const session = getOrCreateSession(callSid, updates.fromPhone || '');
  Object.assign(session, updates);
  ivrSessions.set(callSid, session);
  return session;
}

/**
 * Multilingual Voice Prompt Dictionary
 */
export const PROMPTS = {
  GREETING_LANG_SELECT: {
    ENGLISH: 'Welcome to Annapurna Aahaar, Bhainsa, Telangana. For English, press 1. मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ. తెలుగు కోసం 4 నొక్కండి.',
    MARATHI: 'अन्नपूर्णा आहार मध्ये आपले स्वागत आहे. मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ. తెలుగు కోసం 4 నొక్కండి. For English, press 1.',
    HINDI: 'अन्नपूर्णा आहार में आपका स्वागत है। हिंदी के लिए 3 दबाएँ। मराठीसाठी 2 दाबा। తెలుగు కోసం 4 నొక్కండి। For English, press 1.',
    TELUGU: 'అన్నపూర్ణ ఆహార్ కు స్వాగతం. తెలుగు కోసం 4 నొక్కండి. For English, press 1. मराठीसाठी 2 दाबा. हिंदी के लिए 3 दबाएँ.',
  },
  MAIN_MENU: {
    ENGLISH: 'Welcome to Annapurna Aahaar. For placing or confirming an order, press 1. For tracking your order, press 2. For cancelling an order, press 3. To speak with customer support, press 4. To repeat this menu, press 9.',
    MARATHI: 'अन्नपूर्णा आहार मध्ये आपले स्वागत आहे. नवीन ऑर्डर करण्यासाठी किंवा पुष्टी करण्यासाठी 1 दाबा. आपली ऑर्डर ट्रॅक करण्यासाठी 2 दाबा. ऑर्डर रद्द करण्यासाठी 3 दाबा. ग्राहक सेवेशी बोलण्यासाठी 4 दाबा. हा मेनू पुन्हा ऐकण्यासाठी 9 दाबा.',
    HINDI: 'अन्नपूर्णा आहार में आपका स्वागत है। ऑर्डर करने या ऑर्डर की पुष्टि करने के लिए 1 दबाएँ। ऑर्डर ट्रैक करने के लिए 2 दबाएँ। ऑर्डर कैंसल करने के लिए 3 दबाएँ। ग्राहक सहायता के लिए 4 दबाएँ। मेनू दोबारा सुनने के लिए 9 दबाएँ।',
    TELUGU: 'అన్నపూర్ణ ఆహార్ కు స్వాగతం. ఆర్డర్ చేయడానికి లేదా ఆర్డర్ నిర్ధారించడానికి 1 నొక్కండి. మీ ఆర్డర్ను ట్రాక్ చేయడానికి 2 నొక్కండి. ఆర్డర్ను రద్దు చేయడానికి 3 నొక్కండి. కస్టమర్ సహాయం కోసం 4 నొక్కండి. మెనూను మళ్లీ వినడానికి 9 నొక్కండి.',
  },
  INVALID_OPTION: {
    ENGLISH: 'Sorry, that is not a valid option. Please try again.',
    MARATHI: 'क्षमस्व, हा पर्याय उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.',
    HINDI: 'क्षमा करें, यह एक अमान्य विकल्प है। कृपया पुनः प्रयास करें।',
    TELUGU: 'క్షమించండి, అది సరైన ఎంపిక కాదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },
  SUPPORT_TRANSFER: {
    ENGLISH: `Please hold while we transfer your call to our customer support manager at Annapurna Aahaar Bhainsa.`,
    MARATHI: `कृपया थांबा, आम्ही आपला कॉल अन्नपूर्णा आहार ग्राहक प्रतिनिधीकडे ट्रान्सफर करत आहोत.`,
    HINDI: `कृपया प्रतीक्षा करें, हम आपका कॉल अन्नपूर्णा आहार ग्राहक सहायता प्रतिनिधि को ट्रांसफर कर रहे हैं।`,
    TELUGU: `దయచేసి వేచి ఉండండి, మీ కాల్ ను అన్నపూర్ణ ఆహార్ కస్టమర్ కేర్ ప్రతినిధికి బదిలీ చేస్తున్నాము.`,
  },
  SUPPORT_LEAVE_MESSAGE: {
    ENGLISH: 'All our lines are currently busy. Please state your name and message after the beep, and we will call you back shortly.',
    MARATHI: 'आमचे सर्व प्रतिनिधी व्यस्त आहेत. कृपया बीप नंतर आपले नाव आणि संदेश रेकॉर्ड करा.',
    HINDI: 'हमारे सभी प्रतिनिधि व्यस्त हैं। कृपया बीप के बाद अपना नाम और संदेश रिकॉर्ड करें।',
    TELUGU: 'మా ప్రతినిధులు అందరూ బిజీగా ఉన్నారు. దయచేసి బీప్ శబ్దం తర్వాత మీ పేరు మరియు సందేశాన్ని రికార్డ్ చేయండి.',
  },
};

/**
 * Standard Telephony TwiML/VoiceXML Generator
 */
export function buildTwimlResponse(options: {
  say: string;
  language?: IvrLanguage;
  gatherAction?: string;
  numDigits?: number;
  timeout?: number;
  dialNumber?: string;
  recordAction?: string;
  redirectUrl?: string;
}): string {
  const { say, language = 'ENGLISH', gatherAction, numDigits = 1, timeout = 6, dialNumber, recordAction, redirectUrl } = options;

  let voice = 'Polly.Aditi'; // High-quality Indian bilingual voice
  let langCode = 'en-IN';
  if (language === 'HINDI') {
    voice = 'Polly.Aditi';
    langCode = 'hi-IN';
  } else if (language === 'MARATHI') {
    voice = 'Polly.Aditi';
    langCode = 'mr-IN';
  } else if (language === 'TELUGU') {
    voice = 'Polly.Chitra';
    langCode = 'te-IN';
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n`;

  if (dialNumber) {
    xml += `  <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
    xml += `  <Dial timeout="20" action="${ENV.LIVE_SITE_URL}/api/ivr/status-callback">${dialNumber}</Dial>\n`;
  } else if (recordAction) {
    xml += `  <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
    xml += `  <Record maxLength="60" action="${recordAction}" playBeep="true" />\n`;
  } else if (gatherAction) {
    xml += `  <Gather action="${gatherAction}" method="POST" numDigits="${numDigits}" timeout="${timeout}">\n`;
    xml += `    <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
    xml += `  </Gather>\n`;
    if (redirectUrl) {
      xml += `  <Redirect method="POST">${redirectUrl}</Redirect>\n`;
    }
  } else {
    xml += `  <Say language="${langCode}" voice="${voice}">${escapeXml(say)}</Say>\n`;
    if (redirectUrl) {
      xml += `  <Redirect method="POST">${redirectUrl}</Redirect>\n`;
    } else {
      xml += `  <Hangup/>\n`;
    }
  }

  xml += `</Response>`;
  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetch and construct dynamic Product List in caller's language
 */
export async function getIvrProductMenuText(language: IvrLanguage): Promise<{ text: string; products: any[] }> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  });

  let prompt = '';
  if (language === 'ENGLISH') {
    prompt = 'Please select a product. ';
    products.forEach((p, idx) => {
      prompt += `For ${p.name}, press ${idx + 1}. `;
    });
    prompt += 'To repeat products, press 9. To return to main menu, press 0.';
  } else if (language === 'MARATHI') {
    prompt = 'कृपया उत्पादन निवडा. ';
    products.forEach((p, idx) => {
      prompt += `${p.name} साठी ${idx + 1} दाबा. `;
    });
    prompt += 'उत्पादने पुन्हा ऐकण्यासाठी 9 दाबा. मुख्य मेनूसाठी 0 दाबा.';
  } else if (language === 'HINDI') {
    prompt = 'कृपया उत्पाद चुनें। ';
    products.forEach((p, idx) => {
      prompt += `${p.name} के लिए ${idx + 1} दबाएँ। `;
    });
    prompt += 'उत्पाद दोबारा सुनने के लिए 9 दबाएँ। मुख्य मेनू के लिए 0 दबाएँ।';
  } else if (language === 'TELUGU') {
    prompt = 'దయచేసి ప్రోడక్ట్ ఎంచుకోండి. ';
    products.forEach((p, idx) => {
      prompt += `${p.name} కొరకు ${idx + 1} నొక్కండి. `;
    });
    prompt += 'ప్రోడక్ట్‌లు మళ్లీ వినడానికి 9 నొక్కండి. మెయిన్ మెనూ కోసం 0 నొక్కండి.';
  }

  return { text: prompt, products };
}

/**
 * Fetch and construct dynamic Variant List in caller's language
 */
export async function getIvrVariantMenuText(
  productId: string,
  language: IvrLanguage
): Promise<{ text: string; product: any; variants: any[] } | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
  });

  if (!product || product.variants.length === 0) return null;

  let prompt = '';
  if (language === 'ENGLISH') {
    prompt = `You selected ${product.name}. Please select package weight: `;
    product.variants.forEach((v, idx) => {
      prompt += `For ${v.weight} at ${v.price} rupees, press ${idx + 1}. `;
    });
    prompt += 'To cancel and return, press 0.';
  } else if (language === 'MARATHI') {
    prompt = `आपण ${product.name} निवडले आहे. कृपया वजन निवडा: `;
    product.variants.forEach((v, idx) => {
      prompt += `${v.weight} ${v.price} रुपयांसाठी ${idx + 1} दाबा. `;
    });
    prompt += 'रद्द करण्यासाठी 0 दाबा.';
  } else if (language === 'HINDI') {
    prompt = `आपने ${product.name} चुना है। कृपया वजन चुनें: `;
    product.variants.forEach((v, idx) => {
      prompt += `${v.weight} कीमत ${v.price} रुपये के लिए ${idx + 1} दबाएँ। `;
    });
    prompt += 'रद्द करने के लिए 0 दबाएँ।';
  } else if (language === 'TELUGU') {
    prompt = `మీరు ${product.name} ఎంచుకున్నారు. దయచేసి బరువు ఎంచుకోండి: `;
    product.variants.forEach((v, idx) => {
      prompt += `${v.weight} ధర ${v.price} రూపాయల కొరకు ${idx + 1} నొక్కండి. `;
    });
    prompt += 'రద్దు చేయడానికి 0 నొక్కండి.';
  }

  return { text: prompt, product, variants: product.variants };
}

/**
 * Format order confirmation speech
 */
export function getIvrOrderConfirmationText(options: {
  productName: string;
  weight: string;
  quantity: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerPhone: string;
  language: IvrLanguage;
}): string {
  const { productName, weight, quantity, total, deliveryFee, language } = options;

  if (language === 'ENGLISH') {
    return `You have selected ${quantity} pack of ${productName} ${weight}. Total payable is ${total} rupees${deliveryFee === 0 ? ' with free delivery' : ''}. Payment mode is Cash on Delivery. To confirm this order, press 1. To change, press 2. To cancel, press 3.`;
  } else if (language === 'MARATHI') {
    return `आपण ${productName} ${weight} चे ${quantity} पॅक निवडले आहे. एकूण देय रक्कम ${total} रुपये आहे. डिलिव्हरीवर रोख रक्कम स्वीकारली जाईल. ऑर्डर कन्फर्म करण्यासाठी 1 दाबा. बदलण्यासाठी 2 दाबा. रद्द करण्यासाठी 3 दाबा.`;
  } else if (language === 'HINDI') {
    return `आपने ${productName} ${weight} के ${quantity} पैकेट चुने हैं। कुल देय राशि ${total} रुपये है। डिलीवरी पर नकद भुगतान होगा। ऑर्डर की पुष्टि के लिए 1 दबाएँ। बदलने के लिए 2 दबाएँ। रद्द करने के लिए 3 दबाएँ।`;
  } else if (language === 'TELUGU') {
    return `మీరు ${productName} ${weight} ${quantity} ప్యాక్ ఎంచుకున్నారు. మొత్తం ధర ${total} రూపాయలు. డెలివరీ సమయంలో నగదు చెల్లించవచ్చు. ఈ ఆర్డర్ ను నిర్ధారించడానికి 1 నొక్కండి. మార్చడానికి 2 నొక్కండి. రద్దు చేయడానికి 3 నొక్కండి.`;
  }

  return '';
}
