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
    url: "https://passaportedasorte.tur.br",
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
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}
    (window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '4245174602462152');
    fbq('track', 'PageView');
  `}
</Script>
<noscript>
  <img
    height="1"
    width="1"
    style={{ display: "none" }}
    src="https://www.facebook.com/tr?id=4245174602462152&ev=PageView&noscript=1"
    alt=""
  />
</noscript>
<Script id="clarity" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xa7anzsupj");
  `}
</Script>
</body>
    </html>
  );
}
