import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beranda | Panti Asuhan Anak Luar Biasa Asih Madiun",
  description:
    "Yayasan Panti Asuhan Anak Luar Biasa Asih — Jalan Raya Dungus No 309, Karangrejo, Wungu, Kabupaten Madiun. Informasi donasi, usaha panti, dan kontak.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
