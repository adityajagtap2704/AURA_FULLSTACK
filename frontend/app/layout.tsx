import type { Metadata } from "next";
import Script from "next/script";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { CommandPaletteProvider } from "@/providers/CommandPaletteProvider";
import CommandPalette from "@/components/command/CommandPalette";
import CommandToast from "@/components/command/CommandToast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "AURA - Unified Productivity Space",
  description: "Your daily focus, calendar, communication, and notes aggregated into one elegant SaaS workspace.",
  verification: {
    google: "Q5rqUD9F3qba3VScpCgmLmB0Wd8pSNOGtuwg1oUIjxY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function() {
            try {
              var theme = localStorage.getItem('aura-theme');
              var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
              var active = 'light';
              if (theme === 'dark') active = 'dark';
              else if (theme === 'system') active = mediaQuery.matches ? 'dark' : 'light';
              document.documentElement.classList.add(active);
              document.documentElement.classList.remove(active === 'dark' ? 'light' : 'dark');
            } catch (e) {
              // Ignore when localStorage is unavailable
            }
          })();`}
        </Script>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <CommandPaletteProvider>
                {children}
                <CommandPalette />
                <CommandToast />
              </CommandPaletteProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
