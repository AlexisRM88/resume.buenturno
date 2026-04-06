import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume.buenturno.com"),
  verification: {
    google: "google-site-verification", // reemplazar con el token de Search Console
  },
  title: {
    default: "Resume Gratis Puerto Rico | BuenTurno Resume",
    template: "%s | BuenTurno Resume",
  },
  description:
    "Crea tu resume profesional gratis en minutos. Estilo BuenTurno con disponibilidad por día y hora. Compatible con ATS y OCR. Para trabajadores de Puerto Rico. Los patronos te encuentran a ti.",
  keywords: [
    "resume Puerto Rico",
    "resume gratis Puerto Rico",
    "buscar trabajo Puerto Rico",
    "resume buenturno",
    "plantilla resume Puerto Rico",
    "curriculum vitae gratis PR",
    "resume ATS Puerto Rico",
    "empleo Puerto Rico",
    "crear resume gratis",
    "resume profesional Puerto Rico",
    "trabajo Puerto Rico",
    "resume disponibilidad horario",
  ],
  authors: [{ name: "BuenTurno" }],
  creator: "BuenTurno",
  publisher: "BuenTurno",
  openGraph: {
    title: "Resume Gratis Puerto Rico | BuenTurno",
    description:
      "Crea tu resume estilo BuenTurno gratis. Muestra tu disponibilidad por día y hora. Los patronos de PR te encuentran a ti.",
    url: "https://resume.buenturno.com",
    siteName: "BuenTurno Resume",
    locale: "es_PR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuenTurno Resume — Crea tu resume gratis en Puerto Rico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Gratis Puerto Rico | BuenTurno",
    description:
      "Crea tu resume profesional gratis. Los patronos de PR te encuentran a ti.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://resume.buenturno.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuenTurno Resume",
  url: "https://resume.buenturno.com",
  description:
    "Plataforma gratuita para crear resumes profesionales al estilo BuenTurno. Conecta candidatos de Puerto Rico con patronos que buscan su talento.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Gratis para candidatos",
  },
  inLanguage: "es-PR",
  areaServed: {
    "@type": "State",
    name: "Puerto Rico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {/* Google Analytics 4 */}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-DMRWKNGTVJ"
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DMRWKNGTVJ', { send_page_view: true });
            `}
          </Script>
          {/* Google AdSense */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8427212204766807"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        </head>
        <body className="min-h-full flex flex-col bg-gray-50">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
