import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HideInAdmin } from "@/components/layout/HideInAdmin";
import { WcagWidget } from "@/components/layout/WcagWidget";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SkipToContent } from "@/components/layout/SkipToContent";

import { prisma } from "@/lib/prisma";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

  const title = config?.seoTitle || config?.siteName || "RiseGen";
  const description = config?.seoDescription || "Stowarzyszenie RiseGen";
  // const icons = config?.faviconUrl ? { icon: config.faviconUrl } : undefined; // This line is no longer needed

  const openGraph = config?.ogImageUrl ? {
    images: [{ url: config.ogImageUrl }],
  } : undefined;

  const timestamp = new Date().getTime();
  const faviconUrl = config?.faviconUrl
    ? `${config.faviconUrl}?v=${timestamp}`
    : `/favicon.ico?v=${timestamp}`;

  return {
    metadataBase: new URL('https://risegen.pl'), // Fixes relative URL issues
    title: {
      default: title,
      template: `%s | ${config?.siteName || "RiseGen"}`,
    },
    description,
    keywords: config?.seoKeywords ? config.seoKeywords.split(",").map(k => k.trim()) : undefined,
    authors: config?.seoAuthor ? [{ name: config.seoAuthor }] : undefined,
    robots: config?.seoRobots || "index, follow",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    manifest: '/manifest.json',
    openGraph: {
      ...openGraph,
      title,
      description,
      siteName: config?.siteName || "Rise Gen",
      type: 'website',
      locale: 'pl_PL',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: config?.ogImageUrl ? [config.ogImageUrl] : undefined,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: config?.siteName || "RiseGen",
    },
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  };
}

import { Toaster } from "sonner";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { GoogleAnalytics } from "@/components/providers/GoogleAnalytics";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

import { ThemeProvider } from "@/components/providers/ThemeProvider";

// ... existing imports

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

  let pathname = "";
  try {
    const headersList = await headers();
    pathname = headersList.get("x-pathname") || "";
  } catch (e) { }

  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/auth");
  const isMaintenancePage = pathname === "/maintenance" || pathname === "/maintenance/";
  const isApi = pathname.startsWith("/api");

  // Maintenance Mode Logic
  if (config?.isMaintenanceMode) {
    // Only redirect if we are SURE we are not in an exempted area.
    if (pathname && !isAdmin && !isAuth && !isMaintenancePage && !isApi) {
      redirect("/maintenance");
    }
  }

  // Determine if we should show the regular navigation and widgets
  // We hide them on the dedicated maintenance page to provide a clean offline experience.
  // We hide them even for admins ONLY on this specific page to check the offline view.
  const showNavigation = !isMaintenancePage;

  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('risegen-ui-theme') || 'system';
                const root = document.documentElement;
                
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-50`}
      >
        <ThemeProvider>
          <SkipToContent />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": config?.siteName || "RiseGen",
                "url": "https://risegen.pl",
                "logo": config?.logoUrl ? `https://risegen.pl${config.logoUrl}` : "https://risegen.pl/logo.png",
                "description": config?.seoDescription || "Stowarzyszenie RiseGen - Wspieramy rozwój i innowacje",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config?.orgAddress || "",
                  "addressCountry": "PL"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": config?.phone,
                  "contactType": "customer service"
                },
                "sameAs": [
                  config?.facebookUrl,
                  config?.instagramUrl,
                  config?.tiktokUrl
                ].filter(Boolean)
              })
            }}
          />

          <GoogleAnalytics gaId={config?.googleAnalyticsId} />
          <Toaster position="top-center" richColors />
          {showNavigation && <Navbar config={config} />}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          {showNavigation && (
            <HideInAdmin>
              <Footer config={config} />
              <WcagWidget />
              <CookieBanner />
              <ScrollToTop />
            </HideInAdmin>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
