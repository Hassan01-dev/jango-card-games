import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast'
import "@styles/globals.css";
import AdSense from "@views/components/AdSense";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cards - Playlab",
  description: "Play online card games with friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
         <title>Cards - Playlab</title>
         <meta name="keywords" content="card games, online card games, thulla, professional thulla, thulla card game, playlab, cards playlab, thulla playlab" />
         <meta
          name="google-adsense-account"
          content="ca-pub-3901174951575931"
        />
        <AdSense pId="3901174951575931" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-center" reverseOrder={true} />
        {children}
      </body>
    </html>
  );
}
