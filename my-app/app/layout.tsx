import type { Metadata } from "next";
import { Roboto, Lato, Montserrat } from "next/font/google";
import "./ui/globals.css";
import Header from "./ui/components/Header";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "Marketplace for handcrafted products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${roboto.variable} ${lato.variable} ${montserrat.variable}`}
    >
      <body>
        <Header></Header>
        <main>
          {children}
        </main>
        <footer>
          <p>&copy; 2026 Handcrafted Haven | WDD 430, Group 15</p>
          <p className="caption-text">All rights reserved</p>
        </footer>
      </body>
    </html>
  );
}