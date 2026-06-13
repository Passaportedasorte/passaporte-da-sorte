import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import JadeChat from "@/components/JadeChat";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Passaporte da Sorte",
  description:
    "Participe de campanhas, acumule milhas, acompanhe resultados e viva experiências incríveis com o Passaporte da Sorte.",

  keywords: [
    "passaporte da sorte",
    "viagens",
    "campanhas",
    "sorteio de viagens",
    "milhas",
    "experiências",
    "pass-id",
    "resultado federal",
  ],

  openGraph: {
    title: "Passaporte da Sorte",
    description:
      "Campanhas, viagens, experiências e resultados oficiais.",
    url: "https://passaportedasorte.com.br",
    siteName: "Passaporte da Sorte",
    locale: "pt_BR",
    type: "website",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col">
  {children}

  <JadeChat />
  <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-G01G81LKFN"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-G01G81LKFN');
  `}
</Script>
</body>
    </html>
  );
}
