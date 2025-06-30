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
  format = 'auto',
  responsive = 'true',
}: Props) {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('Error loading ads:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8741211413490579"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
