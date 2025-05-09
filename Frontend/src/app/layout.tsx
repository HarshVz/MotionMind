import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { AnimatePresence } from "motion/react";
import "./globals.css";

const hostgrotesk = Host_Grotesk({
  variable: "--font-hostgrotesk",
  subsets: ["latin"],
});


export const metadata: Metadata = {
    title: "Manim Animation Generator | Create Math & CS Visuals Online",
    description:
      "Generate beautiful, professional-grade animations using Manim directly from your browser. No coding required. Perfect for math, CS, and educational content creators.",
    keywords: [
      "Manim animation generator",
      "create math animations",
      "CS visualizations",
      "online animation tool",
      "math video generator",
      "educational animation"
    ],
    authors: [{ name: "harshdev_", url: "https://yourdomain.com" }],
    openGraph: {
      title: "Manim Animation Generator",
      description:
        "Create stunning Manim animations online. Great for math and computer science videos.",
      url: "https://yourdomain.com",
      siteName: "Manim Animation Generator",
      type: "website",
      images: [
        {
          url: "./preview.png", // Replace with your actual image
          width: 1200,
          height: 630,
          alt: "Manim Animation Example",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Manim Animation Generator",
      description:
        "Generate Manim animations online without writing code. Ideal for teachers, YouTubers, and educators.",
      creator: "@harshdev_",
      images: ["/preview.png"],
    },
  };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <AnimatePresence>
      <body
        className={`${hostgrotesk.variable} antialiased bg-black`}
      >
        {children}
      </body>
      </AnimatePresence>
    </html>
  );
}
