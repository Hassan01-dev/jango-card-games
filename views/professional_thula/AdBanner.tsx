"use client";

import React, { useEffect } from "react";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

const AdBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerTypes) => {

  return (
    <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8741211413490579"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        ></ins>
  );
};

export default AdBanner;