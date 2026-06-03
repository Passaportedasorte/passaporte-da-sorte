import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import JadeChat from "@/app/components/JadeChat";


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
</body>
    </html>
  );
}
