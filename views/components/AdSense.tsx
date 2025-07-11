"use client";

import { useEffect } from "react";

export default function AdsenseLoader({ pId }: { pId: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [pId]);

  return null;
}
