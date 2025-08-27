import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EchoPilot - AI-powered Meeting Intelligence',
  description: 'Automatically join, listen, summarize, and track action items from your meetings',
  keywords: ['meeting assistant', 'AI transcription', 'meeting summaries', 'action items', 'productivity'],
  authors: [{ name: 'EchoPilot Team' }],
  creator: 'EchoPilot',
  publisher: 'EchoPilot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://echopilot.com'),
  openGraph: {
    title: 'EchoPilot - AI-powered Meeting Intelligence',
    description: 'Automatically join, listen, summarize, and track action items from your meetings',
    url: 'https://echopilot.com',
    siteName: 'EchoPilot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EchoPilot - AI-powered Meeting Intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EchoPilot - AI-powered Meeting Intelligence',
    description: 'Automatically join, listen, summarize, and track action items from your meetings',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
