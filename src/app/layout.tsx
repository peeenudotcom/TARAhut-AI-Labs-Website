import type { Metadata } from 'next';
import { Inter, Geist_Mono, Playfair_Display, Space_Grotesk, Manrope } from 'next/font/google';
import Script from 'next/script';
import { siteConfig } from '@/config/site';
import { MetaPixel } from '@/components/analytics/meta-pixel';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { OrganizationSchema } from '@/components/seo/structured-data';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${playfair.variable} ${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        {children}
        {clarityId && (
          <Script id="clarity-tracker" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
        {metaPixelId && <MetaPixel pixelId={metaPixelId} />}
        {gaMeasurementId && <GoogleAnalytics measurementId={gaMeasurementId} />}
      </body>
    </html>
  );
}
