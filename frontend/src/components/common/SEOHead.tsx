import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Annapurna Aahaar | Traditional Indian Food Products',
  description = 'Annapurna Aahaar offers traditional Indian food products including sevaya, papad and turmeric powder from Bhainsa, Nirmal District, Telangana. Order online or call 9347036152.',
  keywords = 'Annapurna Aahaar, Annapurna Aahaar Bhainsa, Annapurna Aahaar Nirmal, Annapurna Aahaar Telangana, Annapurna Aahaar papad, Annapurna Aahaar sevaya, Annapurna Aahaar turmeric, papad Bhainsa, sevaya Bhainsa, traditional food Bhainsa, food products Bhainsa, 9347036152',
  image = 'https://annapurnaaahaar.in/images/hero-3d-heritage-spread.jpg',
  url = 'https://annapurnaaahaar.in/',
  jsonLd,
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

    // Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Primary & Social Tags
    setMeta('title', title);
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('og:site_name', 'Annapurna Aahaar', true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // Dynamic JSON-LD script for Product / Breadcrumb structured data
    let dynamicJsonLd = document.getElementById('dynamic-seo-jsonld') as HTMLScriptElement;
    if (jsonLd) {
      if (!dynamicJsonLd) {
        dynamicJsonLd = document.createElement('script');
        dynamicJsonLd.id = 'dynamic-seo-jsonld';
        dynamicJsonLd.type = 'application/ld+json';
        document.head.appendChild(dynamicJsonLd);
      }
      dynamicJsonLd.textContent = JSON.stringify(jsonLd);
    } else if (dynamicJsonLd) {
      dynamicJsonLd.remove();
    }
  }, [title, description, keywords, image, url, jsonLd]);

  return null;
};

export default SEOHead;
