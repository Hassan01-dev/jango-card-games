'use client';
import { useEffect } from 'react';

type Props = {
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: string;
};

export default function AdSenseAd({
  slot,
  style = { display: 'block' },
  format = 'auto',
  responsive = 'true',
}: Props) {
  useEffect(() => {
    try {
      interface WindowWithAdSense extends Window {
        adsbygoogle: Array<{ push(obj: { [key: string]: any }): void }>;
      }
      
      if (typeof window !== 'undefined') {
        const windowWithAds = window as unknown as WindowWithAdSense;
        if (windowWithAds.adsbygoogle) {
          windowWithAds.adsbygoogle[0].push({});
        }
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-8741211413490579"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
