import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../../context/AuthContext";
import { Toaster } from "react-hot-toast";
import NavSwitcher from "../../components/NavbarSwitcher";
import Footer from "../../components/Footer";
import { ErrorProvider } from "../../context/error-context";

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-orbitron',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kirub-Rental",
  description: "Kirub Car Rental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NavSwitcher />
          <Toaster position="top-center" reverseOrder={false} />
          <ErrorProvider>
            {children}
          </ErrorProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html >
  );
}
