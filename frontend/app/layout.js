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
  metadataBase: new URL("https://www.sobhaproperties.in"),

  title: {
    default:
      "Sobha Properties | Luxury Residential Projects in Bangalore, Chennai, Hyderabad & Dubai",
    template: "%s | Sobha Properties",
  },

  description:
    "Explore Sobha Properties – premium residential projects in Bangalore, Chennai, Hyderabad, Delhi NCR & Dubai. Discover luxury apartments, villas, and investment opportunities.",
     verification: {
    google: "Z3zZneQYQMxruFu3Q2yUoeYuEAUySKP7qhdBuH3JiBg",
  },
  keywords: [
    "Sobha Properties",
    "Sobha Projects Bangalore",
    "Luxury Apartments Bangalore",
    "Sobha Developers India",
    "Real Estate Bangalore",
    "Apartments in Chennai",
    "Flats in Hyderabad",
    "Property in Delhi NCR",
    "Dubai Real Estate",
  ],

  authors: [{ name: "Sobha Properties" }],
  creator: "Sobha Properties",
  publisher: "Sobha Properties",

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
    canonical: "https://www.sobhaproperties.in",
  },

  openGraph: {
    title:
      "Sobha Properties | Premium Residential Projects in India & Dubai",
    description:
      "Discover luxury homes by Sobha Properties in Bangalore, Chennai, Hyderabad, Delhi NCR & Dubai. Explore premium apartments and villas.",
    url: "https://www.sobhaproperties.in",
    siteName: "Sobha Properties",
    images: [
      {
        url: "/og-image.jpg", // add this image in public folder
        width: 1200,
        height: 630,
        alt: "Sobha Properties",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Sobha Properties | Luxury Homes in India & Dubai",
    description:
      "Explore premium Sobha residential projects across top cities.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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