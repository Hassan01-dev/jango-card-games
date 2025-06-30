"use client";

import { useEffect } from "react";

const Layout = ({ children }: React.PropsWithChildren) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error: any) {
      console.log("Add error: ", error.message);
    }
  }, []);

  return <>{children}</>;
};

export default Layout;
