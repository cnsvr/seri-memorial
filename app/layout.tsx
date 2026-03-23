import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Şeri 🐾',
  description: 'In loving memory of Şeri',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#0a0a0a] text-[#f5f0e8] min-h-screen">
        {children}
      </body>
    </html>
  );
}
