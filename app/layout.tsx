import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

export const metadata: Metadata = {
  title: "Friendly Chatbot AI Assistant",
  description:
    "A modern, real-time AI chatbot powered by Groq + Llama 3.3. Ask anything, get instant answers.",
  keywords: ["AI", "chatbot", "assistant", "Groq", "Llama", "Next.js"],
  authors: [{ name: "Friendly Chatbot" }],
  openGraph: {
    title: "Friendly Chatbot AI Assistant",
    description: "Real-time AI chat powered by Groq + Llama 3.3.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable}`}
      lang="en"
    >
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        <QueryProvider>
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
