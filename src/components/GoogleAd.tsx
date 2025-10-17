import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd = ({ slot, format = 'auto', className = '', style }: GoogleAdProps) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAd;
