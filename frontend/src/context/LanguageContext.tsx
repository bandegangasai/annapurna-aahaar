import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'mr' | 'hi' | 'te';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🚩' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🌾' },
];

export const TRANSLATIONS = {
  en: {
    // Navigation & Top Bar
    nav_home: 'Home',
    nav_products: 'Products',
    nav_about: 'Our Story',
    nav_why_us: 'Why Us',
    nav_how_to_order: 'How to Order',
    nav_track: 'Track Order',
    nav_contact: 'Contact Us',
    nav_call_to_order: 'Call to Order',
    nav_hotline: '9347036152',
    nav_cart: 'Cart',
    nav_admin: 'Admin',
    tagline: 'Tradition in Every Grain.',
    brand_location: 'Bhainsa, Nirmal District, Telangana — 504103',

    // Hero Section
    hero_badge: '100% Pure & Authentic Handcrafted Indian Foods',
    hero_title_1: 'Annapurna Aahaar',
    hero_title_2: 'Authentic Indian Foods',
    hero_subtitle:
      'Handcrafted sun-dried papads, stone-ground pure turmeric, and authentic roasted wheat sevaya from the heritage kitchens of Bhainsa, Telangana.',
    hero_shop_now: 'Shop Products',
    hero_call_order: 'Call to Order (9347036152)',
    hero_stat_purity: '100% Pure Grains',
    hero_stat_trust: 'Loved by 5,000+ Families',
    hero_stat_dispatch: 'Same-Day Dispatch',

    // Accessibility Banner
    acc_banner_title: 'Not comfortable ordering online?',
    acc_banner_subtitle: 'Just dial our 24/7 dedicated telephone hotline. Follow simple voice instructions in English, Marathi, Hindi, or Telugu.',
    acc_banner_btn: 'Dial Hotline 9347036152',

    // Products Section
    prod_section_tag: 'Our Heritage Catalogue',
    prod_section_title: 'Authentic Traditional Delicacies',
    prod_section_desc: 'Every item is prepared with time-honored recipes, premium farm-sourced grains, and zero artificial preservatives.',
    cat_all: 'All Products',
    cat_papad: 'Crispy Papads',
    cat_sevaya: 'Wheat Sevaya',
    cat_spices: 'Pure Spices',
    cat_noodles: 'Instant Snacking',
    prod_btn_add: 'Add to Cart',
    prod_btn_added: 'Added to Cart ✓',
    prod_btn_buy: 'Buy Now',
    prod_select_weight: 'Select Package Weight:',
    prod_stock_in: 'In Stock (Fresh Batch)',
    prod_stock_low: 'Low Stock',
    prod_badge_popular: 'Bestseller',
    prod_badge_traditional: 'Handcrafted',
    prod_badge_pure: '100% Pure Stone-Ground',

    // Product Names & Descriptions
    prod_urad_name: 'Urad Dal Papad',
    prod_urad_desc: 'Authentic hand-rolled spiced black gram flour papad seasoned with black pepper and asafoetida.',
    prod_moong_name: 'Moong Dal Papad',
    prod_moong_desc: 'Light and crispy split green gram papad crafted with natural spices, digestive herbs, and rock salt.',
    prod_masala_name: 'Special Masala Papad',
    prod_masala_desc: 'Spicy and tangy papad blended with authentic Telangana red chili, cumin, coriander, and carom seeds.',
    prod_rice_name: 'Rice Papad (Biyyapu Appadalu)',
    prod_rice_desc: 'Traditional steamed and sun-dried rice flour papad with a delicate, melt-in-mouth crispiness.',
    prod_sevaya_name: 'Wheat Sevaya (Vermicelli)',
    prod_sevaya_desc: '100% whole wheat roasted sevaya. Ideal for rich sweet kheer, savory upma, and festive celebrations.',
    prod_turmeric_name: 'Pure Turmeric (Haldi) Powder',
    prod_turmeric_desc: '100% pure golden-yellow turmeric powder with high natural curcumin. Stone-ground from quality farm turmeric roots.',
    prod_maggie_name: 'Maggie Noodles',
    prod_maggie_desc: 'Classic Indian-spiced instant noodle packs with rich masala seasoning for quick family snacking.',
    prod_noodles_name: 'Desi Masala Noodles',
    prod_noodles_desc: 'Indian-style savory noodles with authentic desi masala seasoning for delicious evening snacks.',

    // Trust Badges (Why Choose Us)
    trust_section_tag: 'Our Promise',
    trust_section_title: 'Why Choose Annapurna Aahaar?',
    trust_1_title: 'Traditional Taste',
    trust_1_desc: 'Authentic family recipes perfected over generations for genuine homemade taste.',
    trust_2_title: '100% Pure Ingredients',
    trust_2_desc: 'Stone-ground grains and natural spices without artificial colors or preservatives.',
    trust_3_title: 'Handcrafted with Care',
    trust_3_desc: 'Sun-dried and hygienically packed with strict quality inspection in Bhainsa.',
    trust_4_title: 'Dedicated Phone Hotline',
    trust_4_desc: 'Dial 9347036152 anytime for simple voice ordering in your native language.',

    // Ordering Methods
    order_ways_tag: 'Seamless Ordering',
    order_ways_title: 'Order Your Way',
    order_way_web_title: '1. Online Website',
    order_way_web_desc: 'Browse product catalog, choose weights, and pay via UPI, Card or Cash on Delivery.',
    order_way_phone_title: '2. Phone Call',
    order_way_phone_desc: 'Speak directly with our kitchen assistance team at 6305970844 / 8688456925.',
    order_way_ivr_title: '3. 24/7 Telephone IVR',
    order_way_ivr_desc: 'Call 9347036152 and press keys to place, track, or cancel orders in 4 languages.',
    order_way_doorstep_title: '4. Fast Delivery',
    order_way_doorstep_desc: 'Freshly packed orders dispatched safely to your doorstep with live SMS tracking.',

    // Simple Voice Ordering Section
    ivr_sec_tag: '24/7 Voice Hotline',
    ivr_sec_title: 'Simple Voice Ordering (9347036152)',
    ivr_step_1: '1. Dial 9347036152',
    ivr_step_1_desc: 'Call our dedicated toll-free telephone IVR line from any mobile phone.',
    ivr_step_2: '2. Select Your Language',
    ivr_step_2_desc: 'Press 1 for English, 2 for Marathi, 3 for Hindi, or 4 for Telugu.',
    ivr_step_3: '3. Choose Food Products',
    ivr_step_3_desc: 'Select papad, sevaya, or turmeric and pick your desired packet quantity.',
    ivr_step_4: '4. Instant Confirmation',
    ivr_step_4_desc: 'Receive immediate SMS confirmation with Order Number and delivery updates.',

    // Cart Drawer
    cart_title: 'Shopping Cart',
    cart_empty: 'Your cart is empty',
    cart_empty_sub: 'Discover our handcrafted papads and spices.',
    cart_browse: 'Explore Catalog',
    cart_subtotal: 'Subtotal:',
    cart_delivery: 'Delivery Fee:',
    cart_free_delivery_tag: 'FREE Delivery on orders over ₹500!',
    cart_total: 'Total Payable:',
    cart_checkout_btn: 'Proceed to Checkout',
    cart_clear: 'Clear Cart',

    // Checkout Page
    checkout_title: 'Secure Checkout',
    checkout_step_1: '1. Delivery Details',
    checkout_step_2: '2. Payment Method',
    checkout_name: 'Full Name *',
    checkout_phone: 'Mobile Number *',
    checkout_email: 'Email Address (Optional)',
    checkout_address: 'Street / House Address *',
    checkout_city: 'City / Town *',
    checkout_district: 'District *',
    checkout_state: 'State *',
    checkout_pincode: 'PIN Code *',
    checkout_notes: 'Delivery Instructions / Notes (Optional)',
    checkout_pay_cod: 'Cash on Delivery (COD)',
    checkout_pay_cod_desc: 'Pay cash or QR scan upon delivery at your doorstep.',
    checkout_pay_upi: 'Direct UPI Payment',
    checkout_pay_upi_desc: 'Pay via Google Pay / PhonePe / Paytm to 9542836358@ybl.',
    checkout_pay_online: 'Online Gateway (Razorpay)',
    checkout_pay_online_desc: 'Instant checkout via UPI, Cards, NetBanking.',
    checkout_btn_place: 'Confirm & Place Order',
    checkout_placing: 'Securing Your Order...',
    checkout_upi_instruction: 'Send payment to UPI ID 9542836358@ybl or mobile 9542836358, then paste your 12-digit UTR number below.',
    checkout_utr_label: '12-Digit UPI Transaction / UTR ID *',
    checkout_copy_upi: 'Copy UPI ID',
    checkout_copy_phone: 'Copy Mobile',
    checkout_copied: 'Copied!',

    // Live Order Tracking
    track_title: 'Track Your Order Live',
    track_subtitle: 'Enter your Annapurna Aahaar Order Number (e.g. AA-20260824-1234) or registered phone number.',
    track_input_placeholder: 'Enter Order Number (e.g. AA-20260824-1234)',
    track_btn: 'Track Order',
    track_status_pending: 'Order Received (Pending Verification)',
    track_status_accepted: 'Order Accepted & Confirmed',
    track_status_processing: 'Fresh Batch Being Prepared',
    track_status_ready: 'Packed & Quality Verified',
    track_status_out_for_delivery: 'Out for Doorstep Delivery',
    track_status_delivered: 'Delivered Successfully',
    track_status_cancelled: 'Order Cancelled',
    track_status_rejected: 'Order Rejected',
    track_customer_info: 'Customer & Delivery Info',
    track_items_ordered: 'Items Ordered',

    // Order Success
    success_title: 'Order Placed Successfully!',
    success_subtitle: 'Thank you for choosing Annapurna Aahaar. Your authentic food order has been securely recorded in our kitchen production queue.',
    success_order_number: 'Order Number:',
    success_total: 'Total Amount:',
    success_payment: 'Payment Mode:',
    success_btn_track: 'Track Order Status',
    success_btn_home: 'Return to Homepage',

    // Contact & Footer
    contact_title: 'Get in Touch',
    contact_subtitle: 'Have a question about bulk wedding orders, retail distribution, or need help with phone ordering? Reach out to us.',
    contact_name: 'Your Name *',
    contact_phone: 'Phone Number *',
    contact_email: 'Email Address',
    contact_message: 'Your Message *',
    contact_btn_send: 'Send Message',
    contact_sending: 'Sending Message...',
    footer_tagline: 'Tradition in Every Grain. Authentic Indian food products handcrafted in Bhainsa, Nirmal District, Telangana.',
    footer_quick_links: 'Quick Links',
    footer_contact_info: 'Contact Information',
    footer_kitchen_helpline: 'Kitchen Help: 6305970844, 8688456925',
    footer_ivr_helpline: '24/7 Voice IVR: 9347036152',
    footer_payment_helpline: 'Payment Mobile: 9542836358',
    footer_rights: 'All rights reserved. Dedicated to authentic Indian culinary heritage.',
  },

  mr: {
    // Navigation & Top Bar
    nav_home: 'मुख्यपृष्ठ',
    nav_products: 'उत्पादने',
    nav_about: 'आमची कथा',
    nav_why_us: 'आमची वैशिष्ट्ये',
    nav_how_to_order: 'ऑर्डर कशी करावी',
    nav_track: 'ऑर्डर ट्रॅक करा',
    nav_contact: 'संपर्क',
    nav_call_to_order: 'फोनवरून ऑर्डर करा',
    nav_hotline: '9347036152',
    nav_cart: 'कार्ट',
    nav_admin: 'अ‍ॅडमिन',
    tagline: 'परंपरेची चव, प्रत्येक घासात.',
    brand_location: 'भैंसा, निर्मल जिल्हा, तेलंगणा — 504103',

    // Hero Section
    hero_badge: '१००% अस्सल व पारंपरिक भारतीय खाद्यपदार्थ',
    hero_title_1: 'अन्नपूर्णा आहार',
    hero_title_2: 'पारंपरिक शुद्ध खाद्यपदार्थ',
    hero_subtitle:
      'भैंसा येथील अस्सल हाताने लाटलेले पापड, उन्हात वाळवलेल्या गव्हाच्या शेवया आणि शुद्ध दगडी जात्यावर दळलेली हळद पावडर.',
    hero_shop_now: 'उत्पादने पहा',
    hero_call_order: 'कॉल करून ऑर्डर करा (9347036152)',
    hero_stat_purity: '१००% शुद्ध धान्य',
    hero_stat_trust: '५,०००+ समाधानी कुटुंबे',
    hero_stat_dispatch: 'त्याच दिवशी पाठवणी',

    // Accessibility Banner
    acc_banner_title: 'ऑनलाईन ऑर्डर करणे कठीण वाटते का?',
    acc_banner_subtitle: 'काळजी करू नका! आमच्या 9347036152 या हेल्पलाइनवर कॉल करा आणि सोप्या आवाजी सूचनांचे पालन करून मराठीत ऑर्डर नोंदवा.',
    acc_banner_btn: 'कॉल करा: 9347036152',

    // Products Section
    prod_section_tag: 'पारंपरिक खाद्यसंग्रह',
    prod_section_title: 'आमची अस्सल घरगुती उत्पादने',
    prod_section_desc: 'कोणतेही कृत्रिम रंग किंवा प्रिझर्व्हेटिव्ह न वापरता पारंपरिक पद्धतीने तयार केलेले स्वादिष्ट पदार्थ.',
    cat_all: 'सर्व उत्पादने',
    cat_papad: 'कुरकुरीत पापड',
    cat_sevaya: 'गव्हाच्या शेवया',
    cat_spices: 'शुद्ध मसाले व हळद',
    cat_noodles: 'नूडल्स व स्नॅक्स',
    prod_btn_add: 'कार्टमध्ये जोडा',
    prod_btn_added: 'कार्टमध्ये जोडले ✓',
    prod_btn_buy: 'आत्ताच खरेदी करा',
    prod_select_weight: 'पॅकेटचे वजन निवडा:',
    prod_stock_in: 'उपलब्ध आहे (ताजी बॅच)',
    prod_stock_low: 'मर्यादित साठा',
    prod_badge_popular: 'सर्वाधिक पसंती',
    prod_badge_traditional: 'हाताने बनवलेले',
    prod_badge_pure: '१००% शुद्ध दगडी दळण',

    // Product Names & Descriptions
    prod_urad_name: 'उडीद डाळ पापड',
    prod_urad_desc: 'काळी मिरी आणि हिंगाची चव असलेले पारंपरिक हाताने लाटलेले कुरकुरीत उडीद पापड.',
    prod_moong_name: 'मूग डाळ पापड',
    prod_moong_desc: 'पचनास हलके आणि खमंग चवीचे रुचकर मूग डाळ पापड.',
    prod_masala_name: 'स्पेशल मसाला पापड',
    prod_masala_desc: 'तेलंगणाची लाल मिरची, जिरे आणि ओव्याच्या चटपटीत चवीचा खमंग मसाला पापड.',
    prod_rice_name: 'तांदळाचे पापड',
    prod_rice_desc: 'वाफेवर शिजवून उन्हात वाळवलेले तोंडात विरघळणारे हलके तांदळाचे पापड.',
    prod_sevaya_name: 'गव्हाच्या शेवया',
    prod_sevaya_desc: '१००% शुद्ध गव्हाच्या शेवया. गोड खीर आणि उपम्यासाठी अत्यंत उत्तम.',
    prod_turmeric_name: 'शुद्ध हळद (हळदी) पावडर',
    prod_turmeric_desc: '१००% शुद्ध, नैसर्गिक पिवळीधमक हळद. भरपूर करक्युमिन असलेली दगडी जात्यावर दळलेली शुद्ध हळद.',
    prod_maggie_name: 'मॅगी नूडल्स',
    prod_maggie_desc: 'स्वादिष्ट भारतीय मसाल्यांनी युक्त झटपट फॅमिली स्नॅक नूडल्स.',
    prod_noodles_name: 'देशी मसाला नूडल्स',
    prod_noodles_desc: 'खमंग देशी मसाल्यांची चव असलेले स्वादिष्ट संध्याकाळचे स्नॅक्स नूडल्स.',

    // Trust Badges
    trust_section_tag: 'आमचा विश्वास',
    trust_section_title: 'अन्नपूर्णा आहार का निवडावे?',
    trust_1_title: 'पारंपरिक घरगुती चव',
    trust_1_desc: 'पिढ्यानपिढ्या चालत आलेली अस्सल चव आणि घरगुती बनवट.',
    trust_2_title: '१००% शुद्ध घटक',
    trust_2_desc: 'कोणतेही भेसळ किंवा कृत्रिम रंग नसलेले शुद्ध धान्य आणि मसाले.',
    trust_3_title: 'काळजीपूर्वक हाताळणी',
    trust_3_desc: 'उन्हात नैसर्गिकरीत्या वाळवून अत्यंत स्वच्छ वातावरणात पॅक केलेले.',
    trust_4_title: '२४ तास फोन हेल्पलाइन',
    trust_4_desc: '9347036152 वर कधीही फोन करून मराठीत ऑर्डर नोंदवा.',

    // Ordering Methods
    order_ways_tag: 'ऑर्डर पद्धती',
    order_ways_title: 'आपल्या सोयीनुसार ऑर्डर करा',
    order_way_web_title: '१. वेबसाईटवरून',
    order_way_web_desc: 'वेबसाईटवर उत्पादने निवडून युपीआय किंवा कॅश ऑन डिलिव्हरीने ऑर्डर करा.',
    order_way_phone_title: '२. थेट फोन कॉल',
    order_way_phone_desc: 'आमच्या 6305970844 / 8688456925 या क्रमांकावर थेट संपर्क साधा.',
    order_way_ivr_title: '३. २४ तास व्हॉईस IVR',
    order_way_ivr_desc: '9347036152 वर कॉल करून बटन दाबून ऑर्डर, ट्रॅक किंवा रद्द करा.',
    order_way_doorstep_title: '४. जलद डिलिव्हरी',
    order_way_doorstep_desc: 'ताजे पदार्थ थेट आपल्या घरापर्यंत सुरक्षितपणे पोहोचवले जातील.',

    // Simple Voice Ordering Section
    ivr_sec_tag: '२४ तास व्हॉईस हेल्पलाइन',
    ivr_sec_title: 'सोपी फोन ऑर्डर प्रणाली (9347036152)',
    ivr_step_1: '१. 9347036152 वर कॉल करा',
    ivr_step_1_desc: 'कोणत्याही साध्या किंवा स्मार्टफोनवरून आमच्या IVR नंबरवर कॉल करा.',
    ivr_step_2: '२. मराठी भाषेसाठी २ दाबा',
    ivr_step_2_desc: 'मराठी भाषेची निवड करा, संपूर्ण कॉल मराठीतच चालेल.',
    ivr_step_3: '३. उत्पादन व प्रमाण निवडा',
    ivr_step_3_desc: 'पापड, शेवया किंवा हळद निवडून पाकिटांची संख्या सांगा.',
    ivr_step_4: '४. त्वरित पुष्टीकरण',
    ivr_step_4_desc: 'आपल्या मोबाईलवर एसएमएस द्वारे ऑर्डर नंबर आणि माहिती प्राप्त होईल.',

    // Cart Drawer
    cart_title: 'आपली खरेदी कार्ट',
    cart_empty: 'आपली कार्ट रिकामी आहे',
    cart_empty_sub: 'आमची स्वादिष्ट उत्पादने पहा आणि कार्टमध्ये जोडा.',
    cart_browse: 'उत्पादने पहा',
    cart_subtotal: 'एकूण रक्कम:',
    cart_delivery: 'डिलिव्हरी शुल्क:',
    cart_free_delivery_tag: '₹५०० वरील ऑर्डरवर मोफत डिलिव्हरी!',
    cart_total: 'एकूण देय रक्कम:',
    cart_checkout_btn: 'ऑर्डर करण्यासाठी पुढे जा',
    cart_clear: 'कार्ट रिकामी करा',

    // Checkout Page
    checkout_title: 'सुरक्षित चेकआउट',
    checkout_step_1: '१. डिलिव्हरी पत्ता',
    checkout_step_2: '२. पेमेंट पद्धत निवडा',
    checkout_name: 'पूर्ण नाव *',
    checkout_phone: 'मोबाईल नंबर *',
    checkout_email: 'ईमेल पत्ता (ऐच्छिक)',
    checkout_address: 'घर / गल्लीचा पत्ता *',
    checkout_city: 'गाव / शहर *',
    checkout_district: 'जिल्हा *',
    checkout_state: 'राज्य *',
    checkout_pincode: 'पिन कोड *',
    checkout_notes: 'डिलिव्हरी सूचना (ऐच्छिक)',
    checkout_pay_cod: 'कॅश ऑन डिलिव्हरी (COD)',
    checkout_pay_cod_desc: 'डिलिव्हरीच्या वेळी रोख किंवा क्यूआर स्कॅन करून पैसे द्या.',
    checkout_pay_upi: 'थेट युपीआय (Google Pay / PhonePe)',
    checkout_pay_upi_desc: '9542836358@ybl वर थेट पैसे पाठवा.',
    checkout_pay_online: 'ऑनलाइन पेमेंट गेटवे (Razorpay)',
    checkout_pay_online_desc: 'कार्ड, नेटबँकिंग किंवा युपीआय द्वारे त्वरित पेमेंट.',
    checkout_btn_place: 'ऑर्डर पक्की करा',
    checkout_placing: 'ऑर्डर नोंदवत आहे...',
    checkout_upi_instruction: '9542836358@ybl किंवा 9542836358 वर पैसे पाठवून खाली १२-अंकी UTR नंबर नोंदवा.',
    checkout_utr_label: '१२-अंकी UPI ट्रान्झॅक्शन / UTR नंबर *',
    checkout_copy_upi: 'UPI ID कॉपी करा',
    checkout_copy_phone: 'मोबाईल नंबर कॉपी करा',
    checkout_copied: 'कॉपी झाले!',

    // Live Order Tracking
    track_title: 'ऑर्डरची सद्यस्थिती तपासा',
    track_subtitle: 'आपला अन्नपूर्णा आहार ऑर्डर नंबर (उदा. AA-20260824-1234) किंवा फोन नंबर टाका.',
    track_input_placeholder: 'ऑर्डर नंबर टाका (उदा. AA-20260824-1234)',
    track_btn: 'ट्रॅक करा',
    track_status_pending: 'ऑर्डर प्राप्त झाली (तपासणी सुरू)',
    track_status_accepted: 'ऑर्डर स्वीकारली गेली',
    track_status_processing: 'ताजा माल तयार होत आहे',
    track_status_ready: 'पॅक करून तयार आहे',
    track_status_out_for_delivery: 'डिलिव्हरीसाठी रवाना',
    track_status_delivered: 'यशस्वीरित्या वितरित झाली',
    track_status_cancelled: 'ऑर्डर रद्द केली',
    track_status_rejected: 'ऑर्डर नाकारली',
    track_customer_info: 'ग्राहक व डिलिव्हरी माहिती',
    track_items_ordered: 'ऑर्डर केलेले पदार्थ',

    // Order Success
    success_title: 'ऑर्डर यशस्वीरित्या नोंदवली गेली!',
    success_subtitle: 'अन्नपूर्णा आहार निवडल्याबद्दल धन्यवाद. आपली ऑर्डर आमच्या किचनमध्ये तयार करण्यासाठी पाठवली आहे.',
    success_order_number: 'ऑर्डर क्रमांक:',
    success_total: 'एकूण रक्कम:',
    success_payment: 'पेमेंट पद्धत:',
    success_btn_track: 'ऑर्डर ट्रॅक करा',
    success_btn_home: 'मुख्यपृष्ठावर जा',

    // Contact & Footer
    contact_title: 'आमच्याशी संपर्क साधा',
    contact_subtitle: 'लग्नकार्य, समारंभ किंवा घाऊक ऑर्डर्ससाठी आमच्याशी थेट बोला.',
    contact_name: 'आपले नाव *',
    contact_phone: 'मोबाईल नंबर *',
    contact_email: 'ईमेल पत्ता',
    contact_message: 'आपला संदेश *',
    contact_btn_send: 'संदेश पाठवा',
    contact_sending: 'संदेश पाठवत आहे...',
    footer_tagline: 'परंपरेची चव, प्रत्येक घासात. भैंसा, निर्मल जिल्हा, तेलंगणा येथे तयार केलेले अस्सल घरगुती अन्नपदार्थ.',
    footer_quick_links: 'महत्त्वाच्या लिंक्स',
    footer_contact_info: 'संपर्क माहिती',
    footer_kitchen_helpline: 'किचन फोन: 6305970844, 8688456925',
    footer_ivr_helpline: '२४ तास व्हॉईस IVR: 9347036152',
    footer_payment_helpline: 'पेमेंट मोबाईल: 9542836358',
    footer_rights: 'सर्व हक्क राखीव. अस्सल भारतीय अन्न संस्कृतीचे जतन.',
  },

  hi: {
    // Navigation & Top Bar
    nav_home: 'होम',
    nav_products: 'उत्पाद',
    nav_about: 'हमारी कहानी',
    nav_why_us: 'हमारी विशेषताएँ',
    nav_how_to_order: 'ऑर्डर कैसे करें',
    nav_track: 'ऑर्डर ट्रैक करें',
    nav_contact: 'संपर्क करें',
    nav_call_to_order: 'फोन से ऑर्डर करें',
    nav_hotline: '9347036152',
    nav_cart: 'कार्ट',
    nav_admin: 'एडमिन',
    tagline: 'परंपरा का स्वाद, हर निवाले में।',
    brand_location: 'भैंसा, निर्मल जिला, तेलंगाना — 504103',

    // Hero Section
    hero_badge: '100% शुद्ध और पारंपरिक भारतीय खाद्य उत्पाद',
    hero_title_1: 'अन्नपूर्णा आहार',
    hero_title_2: 'पारंपरिक शुद्ध खाद्य उत्पाद',
    hero_subtitle:
      'भैंसा, तेलंगाना की पारंपरिक रसोई से शुद्ध हाथ से बने पापड़, भुनी हुई गेहूं की सेवइयां और 100% शुद्ध पिसी हुई हल्दी पाउडर।',
    hero_shop_now: 'उत्पाद देखें',
    hero_call_order: 'कॉल करके ऑर्डर करें (9347036152)',
    hero_stat_purity: '100% शुद्ध अनाज',
    hero_stat_trust: '5,000+ खुशहाल परिवार',
    hero_stat_dispatch: 'उसी दिन डिस्पैच',

    // Accessibility Banner
    acc_banner_title: 'ऑनलाइन ऑर्डर करने में परेशानी हो रही है?',
    acc_banner_subtitle: 'चिंता न करें! हमारे 24/7 हेल्पलाइन नंबर 9347036152 पर कॉल करें और सरल वॉइस निर्देशों का पालन करके हिंदी में ऑर्डर करें।',
    acc_banner_btn: 'कॉल करें: 9347036152',

    // Products Section
    prod_section_tag: 'हमारा उत्पाद संग्रह',
    prod_section_title: 'स्वादिष्ट और पारंपरिक उत्पाद',
    prod_section_desc: 'बिना किसी मिलावट या कृत्रिम रंगों के पारंपरिक तरीके से तैयार किए गए शुद्ध व्यंजन।',
    cat_all: 'सभी उत्पाद',
    cat_papad: 'कुरकुरे पापड़',
    cat_sevaya: 'गेहूं सेवइयां',
    cat_spices: 'शुद्ध मसाले व हल्दी',
    cat_noodles: 'नूडल्स व स्नैक्स',
    prod_btn_add: 'कार्ट में जोड़ें',
    prod_btn_added: 'कार्ट में जोड़ा गया ✓',
    prod_btn_buy: 'अभी खरीदें',
    prod_select_weight: 'पैकेट का वजन चुनें:',
    prod_stock_in: 'उपलब्ध है (ताजा बैच)',
    prod_stock_low: 'सीमित स्टॉक',
    prod_badge_popular: 'सर्वाधिक लोकप्रिय',
    prod_badge_traditional: 'हाथ से बना',
    prod_badge_pure: '100% शुद्ध चक्की पिसाई',

    // Product Names & Descriptions
    prod_urad_name: 'उड़द दाल पापड़',
    prod_urad_desc: 'काली मिर्च और हींग के स्वाद से भरपूर पारंपरिक हाथ से बेले हुए उड़द दाल पापड़।',
    prod_moong_name: 'मूंग दाल पापड़',
    prod_moong_desc: 'स्वादिष्ट, हल्के और पाचक मसालों से युक्त खस्ता मूंग दाल पापड़।',
    prod_masala_name: 'स्पेशल मसाला पापड़',
    prod_masala_desc: 'तेलंगाना की लाल मिर्च, जीरा और अजवाइन के चटपटे स्वाद वाला खास मसाला पापड़।',
    prod_rice_name: 'चावल के पापड़',
    prod_rice_desc: 'भाप में पकाकर धूप में सुखाए गए मुंह में घुलने वाले कुरकुरे चावल के पापड़।',
    prod_sevaya_name: 'गेहूं की सेवइयां',
    prod_sevaya_desc: '100% शुद्ध गेहूं की भुनी हुई सेवइयां। खीर और उपमा के लिए सर्वोत्तम।',
    prod_turmeric_name: 'शुद्ध हल्दी पाउडर',
    prod_turmeric_desc: '100% प्राकृतिक और शुद्ध सुनहरी हल्दी। उच्च करक्यूमिन युक्त चक्की से पिसी हल्दी।',
    prod_maggie_name: 'मैगी नूडल्स',
    prod_maggie_desc: 'स्वादिष्ट भारतीय मसालों से भरपूर झटपट बनने वाले नूडल्स।',
    prod_noodles_name: 'देसी मसाला नूडल्स',
    prod_noodles_desc: 'चटपटे देसी मसालों से तैयार शाम के नाश्ते के लिए बेहतरीन नूडल्स।',

    // Trust Badges
    trust_section_tag: 'हमारा वादा',
    trust_section_title: 'अन्नपूर्णा आहार ही क्यों चुनें?',
    trust_1_title: 'पारंपरिक घर का स्वाद',
    trust_1_desc: 'पीढ़ियों से चला आ रहा शुद्ध और प्रामाणिक स्वाद।',
    trust_2_title: '100% शुद्ध सामग्री',
    trust_2_desc: 'बिना किसी रसायन या कृत्रिम रंग के शुद्ध अनाज और मसाले।',
    trust_3_title: 'हाथों से तैयार',
    trust_3_desc: 'धूप में सुखाकर अत्यंत स्वच्छता के साथ पैक किया गया।',
    trust_4_title: '24/7 फोन हेल्पलाइन',
    trust_4_desc: '9347036152 पर कभी भी कॉल करके हिंदी में ऑर्डर करें।',

    // Ordering Methods
    order_ways_tag: 'ऑर्डर के तरीके',
    order_ways_title: 'अपनी पसंद के अनुसार ऑर्डर करें',
    order_way_web_title: '1. वेबसाइट द्वारा',
    order_way_web_desc: 'वेबसाइट से उत्पाद चुनें और ऑनलाइन या कैश ऑन डिलीवरी से ऑर्डर करें।',
    order_way_phone_title: '2. सीधे फोन पर',
    order_way_phone_desc: 'हमारी रसोई टीम से 6305970844 / 8688456925 पर संपर्क करें।',
    order_way_ivr_title: '3. 24/7 वॉइस IVR',
    order_way_ivr_desc: '9347036152 पर कॉल कर बटन दबाकर ऑर्डर दर्ज, ट्रैक या रद्द करें।',
    order_way_doorstep_title: '4. तेज डिलीवरी',
    order_way_doorstep_desc: 'ताजा तैयार सामान सुरक्षित रूप से सीधे आपके घर पहुंचाया जाएगा।',

    // Simple Voice Ordering Section
    ivr_sec_tag: '24/7 वॉइस हेल्पलाइन',
    ivr_sec_title: 'सरल वॉइस ऑर्डरिंग प्रणाली (9347036152)',
    ivr_step_1: '1. 9347036152 पर कॉल करें',
    ivr_step_1_desc: 'किसी भी साधारण या स्मार्टफोन से हमारे IVR नंबर पर कॉल करें।',
    ivr_step_2: '2. हिंदी भाषा के लिए 3 दबाएँ',
    ivr_step_2_desc: 'हिंदी चुनें, पूरा कॉल आपकी भाषा में जारी रहेगा।',
    ivr_step_3: '3. उत्पाद और मात्रा चुनें',
    ivr_step_3_desc: 'पापड़, सेवई या हल्दी चुनें और पैकेट की संख्या बताएं।',
    ivr_step_4: '4. तुरंत कन्फर्मेशन',
    ivr_step_4_desc: 'एसएमएस द्वारा ऑर्डर नंबर और डिलीवरी की जानकारी तुरंत प्राप्त करें।',

    // Cart Drawer
    cart_title: 'आपकी शॉपिंग कार्ट',
    cart_empty: 'आपकी कार्ट खाली है',
    cart_empty_sub: 'हमारे स्वादिष्ट उत्पाद देखें और कार्ट में जोड़ें।',
    cart_browse: 'उत्पाद देखें',
    cart_subtotal: 'उप-योग:',
    cart_delivery: 'डिलीवरी शुल्क:',
    cart_free_delivery_tag: '₹500 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी!',
    cart_total: 'कुल देय राशि:',
    cart_checkout_btn: 'चेकआउट के लिए आगे बढ़ें',
    cart_clear: 'कार्ट खाली करें',

    // Checkout Page
    checkout_title: 'सुरक्षित चेकआउट',
    checkout_step_1: '1. डिलीवरी पता',
    checkout_step_2: '2. भुगतान का तरीका चुनें',
    checkout_name: 'पूरा नाम *',
    checkout_phone: 'मोबाइल नंबर *',
    checkout_email: 'ईमेल (वैकल्पिक)',
    checkout_address: 'मकान / गली का पता *',
    checkout_city: 'शहर / कस्बा *',
    checkout_district: 'जिला *',
    checkout_state: 'राज्य *',
    checkout_pincode: 'पिन कोड *',
    checkout_notes: 'डिलीवरी निर्देश (वैकल्पिक)',
    checkout_pay_cod: 'कैश ऑन डिलीवरी (COD)',
    checkout_pay_cod_desc: 'डिलीवरी के समय नकद या क्यूआर स्कैन करके भुगतान करें।',
    checkout_pay_upi: 'डायरेक्ट यूपीआई (Google Pay / PhonePe)',
    checkout_pay_upi_desc: '9542836358@ybl पर सीधे भुगतान भेजें।',
    checkout_pay_online: 'ऑनलाइन पेमेंट गेटवे (Razorpay)',
    checkout_pay_online_desc: 'कार्ड, नेटबैंकिंग या यूपीआई से तुरंत भुगतान।',
    checkout_btn_place: 'ऑर्डर पक्का करें',
    checkout_placing: 'ऑर्डर दर्ज हो रहा है...',
    checkout_upi_instruction: '9542836358@ybl या 9542836358 पर भुगतान भेजकर नीचे 12-अंकों का UTR नंबर दर्ज करें।',
    checkout_utr_label: '12-अंकों का UPI ट्रांजैक्शन / UTR नंबर *',
    checkout_copy_upi: 'UPI ID कॉपी करें',
    checkout_copy_phone: 'मोबाइल नंबर कॉपी करें',
    checkout_copied: 'कॉपी हो गया!',

    // Live Order Tracking
    track_title: 'ऑर्डर की स्थिति ट्रैक करें',
    track_subtitle: 'अपना ऑर्डर नंबर (जैसे AA-20260824-1234) या मोबाइल नंबर दर्ज करें।',
    track_input_placeholder: 'ऑर्डर नंबर दर्ज करें (जैसे AA-20260824-1234)',
    track_btn: 'ट्रैक करें',
    track_status_pending: 'ऑर्डर प्राप्त हुआ (समीक्षा जारी)',
    track_status_accepted: 'ऑर्डर स्वीकार कर लिया गया',
    track_status_processing: 'ताजा माल तैयार हो रहा है',
    track_status_ready: 'पैक होकर तैयार है',
    track_status_out_for_delivery: 'डिलीवरी के लिए निकल चुका है',
    track_status_delivered: 'सफलतापूर्वक डिलीवर हो गया',
    track_status_cancelled: 'ऑर्डर रद्द कर दिया गया',
    track_status_rejected: 'ऑर्डर अस्वीकार कर दिया गया',
    track_customer_info: 'ग्राहक व डिलीवरी जानकारी',
    track_items_ordered: 'ऑर्डर किए गए उत्पाद',

    // Order Success
    success_title: 'ऑर्डर सफलतापूर्वक दर्ज हो गया!',
    success_subtitle: 'अन्नपूर्णा आहार चुनने के लिए धन्यवाद। आपका ऑर्डर हमारी रसोई में तैयार किया जा रहा है।',
    success_order_number: 'ऑर्डर संख्या:',
    success_total: 'कुल राशि:',
    success_payment: 'भुगतान का तरीका:',
    success_btn_track: 'ऑर्डर ट्रैक करें',
    success_btn_home: 'होमपेज पर जाएं',

    // Contact & Footer
    contact_title: 'हमसे संपर्क करें',
    contact_subtitle: 'शादी-विवाह, थोक ऑर्डर या सहायता के लिए सीधे हमसे संपर्क करें।',
    contact_name: 'आपका नाम *',
    contact_phone: 'मोबाइल नंबर *',
    contact_email: 'ईमेल पता',
    contact_message: 'आपका संदेश *',
    contact_btn_send: 'संदेश भेजें',
    contact_sending: 'संदेश भेजा जा रहा है...',
    footer_tagline: 'परंपरा का स्वाद, हर निवाले में। भैंसा, निर्मल जिला, तेलंगाना से शुद्ध व प्रामाणिक खाद्य उत्पाद।',
    footer_quick_links: 'त्वरित लिंक्स',
    footer_contact_info: 'संपर्क जानकारी',
    footer_kitchen_helpline: 'रसोई फोन: 6305970844, 8688456925',
    footer_ivr_helpline: '24/7 वॉइस IVR: 9347036152',
    footer_payment_helpline: 'भुगतान मोबाइल: 9542836358',
    footer_rights: 'सर्वाधिकार सुरक्षित। पारंपरिक भारतीय खाद्य संस्कृति को समर्पित।',
  },

  te: {
    // Navigation & Top Bar
    nav_home: 'హోమ్',
    nav_products: 'ఉత్పత్తులు',
    nav_about: 'మా ప్రయాణం',
    nav_why_us: 'మా ప్రత్యేకతలు',
    nav_how_to_order: 'ఆర్డర్ ఎలా చేయాలి',
    nav_track: 'ఆర్డర్ ట్రాక్ చేయండి',
    nav_contact: 'సంప్రదించండి',
    nav_call_to_order: 'ఫోన్ చేసి ఆర్డర్ చేయండి',
    nav_hotline: '9347036152',
    nav_cart: 'కార్ట్',
    nav_admin: 'అడ్మిన్',
    tagline: 'ప్రతి ముద్దలో సంప్రదాయ రుచి.',
    brand_location: 'భైంసా, నిర్మల్ జిల్లా, తెలంగాణ — 504103',

    // Hero Section
    hero_badge: '100% స్వచ్ఛమైన & సంప్రదాయ భారతీయ ఆహార ఉత్పత్తులు',
    hero_title_1: 'అన్నపూర్ణ ఆహార్',
    hero_title_2: 'సాంప్రదాయ భారతీయ ఆహార ఉత్పత్తులు',
    hero_subtitle:
      'భైంసా సంప్రదాయ వంటింటి నుంచి చేతితో తయారుచేసిన అప్పడాలు, ఎండబెట్టిన గోధుమ సేమియా మరియు స్వచ్ఛమైన రాతితో విసిరిన పసుపు పొడి.',
    hero_shop_now: 'ఉత్పత్తులు చూడండి',
    hero_call_order: 'కాల్ చేసి ఆర్డర్ చేయండి (9347036152)',
    hero_stat_purity: '100% స్వచ్ఛమైన ధాన్యాలు',
    hero_stat_trust: '5,000+ సంతృప్తికర కుటుంబాలు',
    hero_stat_dispatch: 'అదే రోజు పంపకం',

    // Accessibility Banner
    acc_banner_title: 'ఆన్‌లైన్ ఆర్డర్ చేయడం కష్టంగా ఉందా?',
    acc_banner_subtitle: 'కంగారు పడకండి! మా 9347036152 హెల్ప్‌లైన్‌కు కాల్ చేసి సాధారణ వాయిస్ సూచనలు అనుసరించి తెలుగులోనే ఆర్డర్ చేయండి.',
    acc_banner_btn: 'కాల్ చేయండి: 9347036152',

    // Products Section
    prod_section_tag: 'మా సంప్రదాయ ఆహారాలు',
    prod_section_title: 'స్వచ్ఛమైన ఇంటి రుచులు',
    prod_section_desc: 'ఎటువంటి రసాయనాలు లేదా కృత్రిమ రంగులు లేకుండా సంప్రదాయ పద్ధతిలో తయారుచేసిన నాణ్యమైన ఉత్పత్తులు.',
    cat_all: 'అన్ని ఉత్పత్తులు',
    cat_papad: 'కరకరలాడే అప్పడాలు',
    cat_sevaya: 'గోధుమ సేమియా',
    cat_spices: 'స్వచ్ఛమైన పసుపు & మసాలాలు',
    cat_noodles: 'నూడుల్స్ & స్నాక్స్',
    prod_btn_add: 'కార్ట్‌లో చేర్చండి',
    prod_btn_added: 'కార్ట్‌లో చేర్చబడింది ✓',
    prod_btn_buy: 'ఇప్పుడే కొనండి',
    prod_select_weight: 'ప్యాకెట్ బరువు ఎంచుకోండి:',
    prod_stock_in: 'అందుబాటులో ఉంది (తాజా బ్యాచ్)',
    prod_stock_low: 'పరిమిత స్టాక్',
    prod_badge_popular: 'అత్యంత ప్రజాదరణ',
    prod_badge_traditional: 'చేతితో చేసినది',
    prod_badge_pure: '100% స్వచ్ఛమైన రాతి విసురుడు',

    // Product Names & Descriptions
    prod_urad_name: 'మినపప్పు అప్పడాలు',
    prod_urad_desc: 'మిరియాలు మరియు ఇంగువతో చేతితో రుబ్బి వడియాలుగా చేసిన సంప్రదాయ మినప అప్పడాలు.',
    prod_moong_name: 'పెసరపప్పు అప్పడాలు',
    prod_moong_desc: 'జీర్ణక్రియకు అనువైన మసాలాలతో తయారుచేసిన కరకరలాడే పెసర అప్పడాలు.',
    prod_masala_name: 'స్పెషల్ మసాలా అప్పడాలు',
    prod_masala_desc: 'తెలంగాణ ఎర్ర కారం, జీలకర్ర మరియు వాముతో కూడిన ఘాటైన మసాలా అప్పడాలు.',
    prod_rice_name: 'బియ్యపు అప్పడాలు',
    prod_rice_desc: 'ఆవిరిపై ఉడికించి ఎండబెట్టిన నోట్లో కరిగిపోయే తేలికపాటి బియ్యపు అప్పడాలు.',
    prod_sevaya_name: 'గోధుమ సేమియా',
    prod_sevaya_desc: '100% స్వచ్ఛమైన గోధుమలతో వేయించిన సేమియా. పాయసం మరియు ఉప్మాకు అత్యుత్తమం.',
    prod_turmeric_name: 'స్వచ్ఛమైన పసుపు పొడి',
    prod_turmeric_desc: '100% స్వచ్ఛమైన సహజ పసుపు. అధిక కర్కుమిన్ కలిగిన రాతి రోకలితో విసిరిన పసుపు.',
    prod_maggie_name: 'మ్యాగీ నూడుల్స్',
    prod_maggie_desc: 'రుచికరమైన మసాలాలతో కూడిన తక్షణ ఫ్యామిలీ స్నాక్ నూడుల్స్.',
    prod_noodles_name: 'దేశీ మసాలా నూడుల్స్',
    prod_noodles_desc: 'ఘాటైన దేశీ మసాలాలతో సాయంత్రం స్నాక్స్‌గా తినడానికి అనువైన నూడుల్స్.',

    // Trust Badges
    trust_section_tag: 'మా హామీ',
    trust_section_title: 'అన్నపూర్ణ ఆహార్ ఎందుకు ఎంచుకోవాలి?',
    trust_1_title: 'సంప్రదాయ ఇంటి రుచి',
    trust_1_desc: 'తరతరాలుగా వస్తున్న స్వచ్ఛమైన ఇంటి పద్ధతిలో తయారీ.',
    trust_2_title: '100% స్వచ్ఛమైన పదార్థాలు',
    trust_2_desc: 'ఎటువంటి రసాయనాలు కలపని సహజమైన ధాన్యాలు మరియు మసాలాలు.',
    trust_3_title: 'చేతితో పరిశుభ్రంగా తయారీ',
    trust_3_desc: 'ఎండలో ఎండబెట్టి అత్యంత శుభ్రమైన వాతావరణంలో ప్యాకింగ్.',
    trust_4_title: '24/7 ఫోన్ హెల్ప్‌లైన్',
    trust_4_desc: '9347036152 కు కాల్ చేసి తెలుగులోనే ఆర్డర్ వివరాలు చెప్పవచ్చు.',

    // Ordering Methods
    order_ways_tag: 'ఆర్డర్ విధానాలు',
    order_ways_title: 'మీకు నచ్చిన రీతిలో ఆర్డర్ చేయండి',
    order_way_web_title: '1. వెబ్‌సైట్ ద్వారా',
    order_way_web_desc: 'వెబ్‌సైట్‌లో నచ్చిన ఉత్పత్తులను ఎంచుకుని యూపీఐ లేదా క్యాష్ ఆన్ డెలివరీ ద్వారా కొనండి.',
    order_way_phone_title: '2. నేరుగా ఫోన్ కాల్',
    order_way_phone_desc: 'మా కిచెన్ సహాయకులను 6305970844 / 8688456925 నంబర్లలో నేరుగా సంప్రదించండి.',
    order_way_ivr_title: '3. 24/7 వాయిస్ IVR',
    order_way_ivr_desc: '9347036152 కు కాల్ చేసి బటన్ నొక్కి ఆర్డర్, ట్రాక్ లేదా రద్దు చేయండి.',
    order_way_doorstep_title: '4. వేగవంతమైన డెలివరీ',
    order_way_doorstep_desc: 'తాజా ఉత్పత్తులను సురక్షితంగా మీ ఇంటి వద్దకే నేరుగా అందజేస్తాము.',

    // Simple Voice Ordering Section
    ivr_sec_tag: '24/7 వాయిస్ హెల్ప్‌లైన్',
    ivr_sec_title: 'సులభమైన వాయిస్ ఆర్డరింగ్ (9347036152)',
    ivr_step_1: '1. 9347036152 కు కాల్ చేయండి',
    ivr_step_1_desc: 'ఏ సాధారణ ఫోన్ లేదా స్మార్ట్‌ఫోన్ నుంచైనా మా IVR నంబర్‌కు కాల్ చేయండి.',
    ivr_step_2: '2. తెలుగు కోసం 4 నొక్కండి',
    ivr_step_2_desc: 'తెలుగు భాషను ఎంచుకోండి, కాల్ మొత్తం తెలుగులోనే కొనసాగుతుంది.',
    ivr_step_3: '3. ఉత్పత్తి & పరిమాణం ఎంచుకోండి',
    ivr_step_3_desc: 'అప్పడాలు, సేమియా లేదా పసుపు ఎంచుకుని ప్యాకెట్ల సంఖ్య తెలపండి.',
    ivr_step_4: '4. తక్షణ నిర్ధారణ',
    ivr_step_4_desc: 'మీ మొబైల్‌కు ఎస్ఎమ్ఎస్ ద్వారా ఆర్డర్ నంబర్ మరియు వివరాలు అందుతాయి.',

    // Cart Drawer
    cart_title: 'షాపింగ్ కార్ట్',
    cart_empty: 'మీ కార్ట్ ఖాళీగా ఉంది',
    cart_empty_sub: 'మా రుచికరమైన ఉత్పత్తులను చూసి కార్ట్‌లో చేర్చండి.',
    cart_browse: 'ఉత్పత్తులు చూడండి',
    cart_subtotal: 'ఉప-మొత్తం:',
    cart_delivery: 'డెలివరీ ఛార్జీ:',
    cart_free_delivery_tag: '₹500 పైన ఆర్డర్లపై ఉచిత డెలివరీ!',
    cart_total: 'మొత్తం చెల్లించాల్సినది:',
    cart_checkout_btn: 'ఆర్డర్ పూర్తి చేయడానికి వెళ్లండి',
    cart_clear: 'కార్ట్ ఖాళీ చేయండి',

    // Checkout Page
    checkout_title: 'సురక్షిత చెక్అవుట్',
    checkout_step_1: '1. డెలివరీ చిరునామా',
    checkout_step_2: '2. చెల్లింపు విధానం ఎంచుకోండి',
    checkout_name: 'పూర్తి పేరు *',
    checkout_phone: 'మొబైల్ నంబర్ *',
    checkout_email: 'ఈమెయిల్ (ఐచ్ఛికం)',
    checkout_address: 'ఇంటి నంబర్ / వీధి చిరునామా *',
    checkout_city: 'గ్రామం / పట్టణం *',
    checkout_district: 'జిల్లా *',
    checkout_state: 'రాష్ట్రం *',
    checkout_pincode: 'పిన్ కోడ్ *',
    checkout_notes: 'డెలివరీ సూచనలు (ఐచ్ఛికం)',
    checkout_pay_cod: 'క్యాష్ ఆన్ డెలివరీ (COD)',
    checkout_pay_cod_desc: 'వస్తువులు ఇంటికి చేరిన తర్వాత నగదు లేదా క్యూఆర్ ద్వారా చెల్లించండి.',
    checkout_pay_upi: 'డైరెక్ట్ యూపీఐ (Google Pay / PhonePe)',
    checkout_pay_upi_desc: '9542836358@ybl కు నేరుగా చెల్లించండి.',
    checkout_pay_online: 'ఆన్‌లైన్ పేమెంట్ గేట్‌వే (Razorpay)',
    checkout_pay_online_desc: 'కార్డులు, నెట్‌బ్యాంకింగ్ లేదా యూపీఐ ద్వారా తక్షణ చెల్లింపు.',
    checkout_btn_place: 'ఆర్డర్ నిర్ధారించండి',
    checkout_placing: 'ఆర్డర్ నమోదు అవుతోంది...',
    checkout_upi_instruction: '9542836358@ybl లేదా 9542836358 కు చెల్లించి క్రింద 12 అంకెల UTR నంబర్ నమోదు చేయండి.',
    checkout_utr_label: '12 అంకెల UPI ట్రాన్సాక్షన్ / UTR నంబర్ *',
    checkout_copy_upi: 'UPI ID కాపీ చేయండి',
    checkout_copy_phone: 'మొబైల్ నంబర్ కాపీ చేయండి',
    checkout_copied: 'కాపీ అయ్యింది!',

    // Live Order Tracking
    track_title: 'ఆర్డర్ స్థితి ట్రాక్ చేయండి',
    track_subtitle: 'మీ అన్నపూర్ణ ఆహార్ ఆర్డర్ నంబర్ (ఉదా: AA-20260824-1234) లేదా ఫోన్ నంబర్ నమోదు చేయండి.',
    track_input_placeholder: 'ఆర్డర్ నంబర్ నమోదు చేయండి (ఉదా: AA-20260824-1234)',
    track_btn: 'ట్రాక్ చేయండి',
    track_status_pending: 'ఆర్డర్ అందింది (పరిశీలనలో ఉంది)',
    track_status_accepted: 'ఆర్డర్ ఆమోదించబడింది',
    track_status_processing: 'తాజా ఉత్పత్తులు తయారవుతున్నాయి',
    track_status_ready: 'ప్యాకింగ్ పూర్తయింది',
    track_status_out_for_delivery: 'డెలివరీకి బయలుదేరింది',
    track_status_delivered: 'విజయవంతంగా చేరింది',
    track_status_cancelled: 'ఆర్డర్ రద్దు చేయబడింది',
    track_status_rejected: 'ఆర్డర్ తిరస్కరించబడింది',
    track_customer_info: 'కస్టమర్ & డెలివరీ సమాచారం',
    track_items_ordered: 'ఆర్డర్ చేసిన వస్తువులు',

    // Order Success
    success_title: 'ఆర్డర్ విజయవంతంగా నమోదయింది!',
    success_subtitle: 'అన్నపూర్ణ ఆహార్ ఎంచుకున్నందుకు ధన్యవాదాలు. మీ ఆర్డర్ కిచెన్ తయారీ విభాగంలో చేర్చబడింది.',
    success_order_number: 'ఆర్డర్ నంబర్:',
    success_total: 'మొత్తం ఖర్చు:',
    success_payment: 'చెల్లింపు విధానం:',
    success_btn_track: 'ఆర్డర్ ట్రాక్ చేయండి',
    success_btn_home: 'హోమ్‌పేజీకి వెళ్లండి',

    // Contact & Footer
    contact_title: 'మమ్మల్ని సంప్రదించండి',
    contact_subtitle: 'పెళ్లిళ్లు, శుభకార్యాలు లేదా హోల్‌సేల్ ఆర్డర్ల కోసం నేరుగా మమ్మల్ని సంప్రదించండి.',
    contact_name: 'మీ పేరు *',
    contact_phone: 'మొబైల్ నంబర్ *',
    contact_email: 'ఈమెయిల్ చిరునామా',
    contact_message: 'మీ సందేశం *',
    contact_btn_send: 'సందేశం పంపండి',
    contact_sending: 'సందేశం పంపబడుతోంది...',
    footer_tagline: 'ప్రతి ముద్దలో సంప్రదాయ రుచి. భైంసా, నిర్మల్ జిల్లా, తెలంగాణ నుంచి స్వచ్ఛమైన భారతీయ ఆహార ఉత్పత్తులు.',
    footer_quick_links: 'ముఖ్యమైన లింకులు',
    footer_contact_info: 'సంప్రదింపు వివరాలు',
    footer_kitchen_helpline: 'కిచెన్ ఫోన్: 6305970844, 8688456925',
    footer_ivr_helpline: '24/7 వాయిస్ IVR: 9347036152',
    footer_payment_helpline: 'పేమెంట్ మొబైల్: 9542836358',
    footer_rights: 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి. స్వచ్ఛమైన భారతీయ ఆహార సంప్రదాయం.',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
  getLocalizedProduct: (productIdOrSlug: string, originalName: string, originalDesc: string) => { name: string; description: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'annapurna_lang_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'mr' || saved === 'hi' || saved === 'te' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Add/remove script class on body
    document.body.classList.remove('lang-en', 'lang-mr', 'lang-hi', 'lang-te');
    document.body.classList.add(`lang-${lang}`);
  };

  useEffect(() => {
    document.body.classList.remove('lang-en', 'lang-mr', 'lang-hi', 'lang-te');
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return (langDict as any)[key] || TRANSLATIONS.en[key] || String(key);
  };

  const currentLanguageOption =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const getLocalizedProduct = (
    productIdOrSlug: string,
    originalName: string,
    originalDesc: string
  ) => {
    const slug = (productIdOrSlug || '').toLowerCase();
    if (slug.includes('urad')) {
      return { name: t('prod_urad_name'), description: t('prod_urad_desc') };
    }
    if (slug.includes('moong')) {
      return { name: t('prod_moong_name'), description: t('prod_moong_desc') };
    }
    if (slug.includes('masala') && slug.includes('papad')) {
      return { name: t('prod_masala_name'), description: t('prod_masala_desc') };
    }
    if (slug.includes('rice') || slug.includes('biyyapu')) {
      return { name: t('prod_rice_name'), description: t('prod_rice_desc') };
    }
    if (slug.includes('sevaya') || slug.includes('vermicelli')) {
      return { name: t('prod_sevaya_name'), description: t('prod_sevaya_desc') };
    }
    if (slug.includes('turmeric') || slug.includes('haldi')) {
      return { name: t('prod_turmeric_name'), description: t('prod_turmeric_desc') };
    }
    if (slug.includes('maggie')) {
      return { name: t('prod_maggie_name'), description: t('prod_maggie_desc') };
    }
    if (slug.includes('noodle')) {
      return { name: t('prod_noodles_name'), description: t('prod_noodles_desc') };
    }
    return { name: originalName, description: originalDesc };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        currentLanguageOption,
        getLocalizedProduct,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
