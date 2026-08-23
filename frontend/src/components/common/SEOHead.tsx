import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Annapurna Aahaar | Tradition in Every Grain',
  description = 'Discover authentic Indian food products from Annapurna Aahaar — pure ingredients, traditional stone-ground milling, crispy handcrafted papads, fresh sevaya, and pure spices.',
  keywords = 'Annapurna Aahaar, Indian food, authentic papad, urad dal papad, sevaya, pure turmeric, haldi, noodles, traditional flour, Indian spices',
  image = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
  url = 'https://annapurnaaahaar.in/',
}) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) meta.setAttribute('property', name);
        else meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  }, [title, description, keywords, image, url]);

  return null;
};
