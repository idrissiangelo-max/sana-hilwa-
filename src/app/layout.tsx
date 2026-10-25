import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "عيد ميلاد سعيد يا أغلى الناس 🎉💖 | موقع الاحتفال الخاص",
  description: "موقع إلكتروني مصمم بكل حب للاحتفال بعيد ميلاد أجمل وأعز صديقة، مليء بالذكريات والهدايا والمفاجآت.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎂</text></svg>",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;500;600;700;800;900&family=Reem+Kufi:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo bg-slate-950 text-slate-100 antialiased selection:bg-pink-500 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
