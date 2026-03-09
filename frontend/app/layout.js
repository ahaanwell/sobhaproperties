import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sobha Limited | Residential Projects In Bangalore, Chennai, Hyderabad, Delhi NCR and Dubai",
  description: "Sobha Limited, a trusted real estate developer in Bangalore, Chennai, Hyderabad, Delhi NCR and Dubai known for innovative residential projects. Explore Lavish Homes's Suites now!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
