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
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
        google_ad_client: 'ca-pub-8741211413490579',
        enable_page_level_ads: true,
      });
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
