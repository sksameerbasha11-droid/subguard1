import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubGuard — Subscription Payment Firewall",
  description:
    "Manage and protect recurring subscription payments with programmable rules powered by MST Blockchain.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>",
  },
  openGraph: {
    title: "SubGuard — Subscription Payment Firewall",
    description:
      "Your Subscriptions. Your Rules. Blockchain-powered subscription manager and payment firewall.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-[#F7F9FC] text-slate-900 font-sans antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
